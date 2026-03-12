import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";

const ProtectPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleProtect = async () => {
        if (files.length === 0 || !password) return;
        setProcessing(true);

        try {
            const file = files[0];
            const fileBytes = new Uint8Array(await file.arrayBuffer());

            // Encrypt the PDF using pdf-encrypt-lite
            const encryptedBytes = await encryptPDF(fileBytes, password, password);

            // Create and download the blob
            const blob = new Blob([new Uint8Array(encryptedBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `protected_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success("PDF protected successfully!");
            setPassword(""); // Clear password after success
            setFiles([]); // Clear file after success
        } catch (error) {
            console.error("Protect failed:", error);
            toast.error("Failed to protect PDF. Please try another file.");
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
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new PDF password..."
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
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
