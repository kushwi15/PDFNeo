import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { Unlock } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Use local worker
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const UnlockPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [password, setPassword] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleUnlock = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();

            // We use pdf-lib to load with password and save without encryption
            // Note: pdf-lib's save() currently exports unencrypted PDFs by default.
            const pdfDoc = await PDFDocument.load(arrayBuffer, {
                password: password || undefined,
                ignoreEncryption: false
            } as any);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `unlocked_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF unlocked successfully! The new version has no password.");
        } catch (error) {
            console.error("Unlock failed:", error);
            toast.error("Failed to unlock PDF. Is the password correct?");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Unlock PDF"
            description="Remove password protection and security from your PDF files."
            icon={Unlock}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a protected PDF file here"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter PDF password..."
                        />
                    </div>

                    <Button
                        onClick={handleUnlock}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Unlocking..." : "Unlock PDF"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default UnlockPdf;
