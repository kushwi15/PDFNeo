import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { PenTool, Upload } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const EsignPdf = () => {
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [sigFiles, setSigFiles] = useState<File[]>([]);
    const [sigScale, setSigScale] = useState(0.5);
    const [processing, setProcessing] = useState(false);

    const handleSign = async () => {
        if (pdfFiles.length === 0 || sigFiles.length === 0) {
            toast.error("Please select both a PDF and a signature image");
            return;
        }
        setProcessing(true);

        try {
            const pdfBuffer = await pdfFiles[0].arrayBuffer();
            const sigBuffer = await sigFiles[0].arrayBuffer();

            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const isPng = sigFiles[0].type === "image/png";
            const sigImage = isPng
                ? await pdfDoc.embedPng(sigBuffer)
                : await pdfDoc.embedJpg(sigBuffer);

            const pages = pdfDoc.getPages();
            const lastPage = pages[pages.length - 1];
            const { width } = lastPage.getSize();

            const dims = sigImage.scale(sigScale);

            // Place at bottom right by default
            lastPage.drawImage(sigImage, {
                x: width - dims.width - 50,
                y: 50,
                width: dims.width,
                height: dims.height,
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `signed_${pdfFiles[0].name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF signed successfully!");
        } catch (error) {
            console.error("Signing failed:", error);
            toast.error("Failed to sign PDF. Ensure the signature is a valid image.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="eSign PDF"
            description="Electronically sign your PDF documents with an image of your signature."
            icon={PenTool}
        >
            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">1. Upload PDF</label>
                    <FileDropzone
                        files={pdfFiles}
                        onFilesChange={setPdfFiles}
                        multiple={false}
                        label="Drop PDF here to sign"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold">2. Upload Signature Image</label>
                    <FileDropzone
                        files={sigFiles}
                        onFilesChange={setSigFiles}
                        multiple={false}
                        accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
                        label="Drop signature image (PNG/JPG) here"
                    />
                </div>

                {pdfFiles.length > 0 && sigFiles.length > 0 && (
                    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Signature Size</label>
                                <span className="text-sm text-muted-foreground">{Math.round(sigScale * 100)}%</span>
                            </div>
                            <Slider
                                value={[sigScale]}
                                onValueChange={(val) => setSigScale(val[0])}
                                min={0.1}
                                max={1.5}
                                step={0.05}
                            />
                        </div>

                        <Button
                            onClick={handleSign}
                            disabled={processing}
                            className="w-full h-12 text-base font-semibold"
                            size="lg"
                        >
                            {processing ? "Signing..." : "Sign & Download PDF"}
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                            Signature will be placed on the bottom right of the last page.
                        </p>
                    </div>
                )}
            </div>
        </ToolLayout>
    );
};

export default EsignPdf;
