import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import { decryptPDF } from "@pdfsmaller/pdf-decrypt";
import { Unlock, Eye, EyeOff } from "lucide-react";
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
    const [showPassword, setShowPassword] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleUnlock = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();

            // Decrypt the PDF
            const originalBytes = new Uint8Array(arrayBuffer);
            const decryptedBytes = await decryptPDF(originalBytes, password || "");

            // Load the decrypted PDF using pdf-lib to rebuild it without the encryption dictionary
            const pdfDoc = await PDFDocument.load(decryptedBytes, {
                ignoreEncryption: false
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `unlocked_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF unlocked successfully! The new version has no password.");
        } catch (error: any) {
            console.error("Unlock failed:", error);
            const errorMessage = error.message || "";
            if (errorMessage.includes("Input document is encrypted with missing or incorrect password")) {
                toast.error("Incorrect password. Please try again.");
            } else if (errorMessage.includes("unsupported encryption algorithm") || errorMessage.includes("Cannot read properties of undefined")) {
                toast.error("Failed to unlock. This PDF might use AES-256 encryption which is not currently supported.");
            } else {
                toast.error("Failed to unlock PDF. Ensure the file is not corrupted.");
            }
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
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter PDF password..."
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
