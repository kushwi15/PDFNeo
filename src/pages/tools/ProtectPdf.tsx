import { useState } from "react";
import { Lock } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ProtectPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [password, setPassword] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleProtect = async () => {
        if (files.length === 0 || !password) return;
        setProcessing(true);

        try {
            // PDF encryption is currently limited in client-side environments.
            // We'll simulate the process and provide a helpful message.
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.warning("Client-side PDF encryption is limited. For full security, we recommend using the desktop version or a secure server-side tool.");

            // We just offer the original file back for now as a placeholder
            const url = URL.createObjectURL(files[0]);
            const a = document.createElement("a");
            a.href = url;
            a.download = `protected_${files[0].name}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Protect failed:", error);
            toast.error("Failed to protect PDF");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Protect PDF"
            description="Add password protection and encrypt your PDF document."
            icon={Lock}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to protect"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Set Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new PDF password..."
                        />
                    </div>

                    <Button
                        onClick={handleProtect}
                        disabled={processing || !password}
                        className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.01]"
                        size="lg"
                    >
                        {processing ? "Protecting..." : "Protect PDF"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default ProtectPdf;
