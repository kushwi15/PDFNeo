import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Minimize2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CompressPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleCompress = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // pdf-lib's save with useObjectStreams: false and other optimizations
            // can sometimes reduce size by cleaning up unused objects.
            const pdfBytes = await pdfDoc.save({
                useObjectStreams: true,
                addDefaultPage: false,
            });

            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `compressed_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);

            const originalSize = file.size;
            const newSize = pdfBytes.length;
            const ratio = Math.max(0, Math.round((1 - newSize / originalSize) * 100));

            toast.success(`PDF processed! Reduced by ${ratio}%`);
        } catch (error) {
            console.error("Compression failed:", error);
            toast.error("Failed to compress PDF");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Compress PDF"
            description="Reduce PDF file size while maintaining quality."
            icon={Minimize2}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to compress"
            />

            {files.length > 0 && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Button
                        onClick={handleCompress}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Compressing..." : "Compress PDF"}
                    </Button>
                    <p className="mt-4 text-xs text-center text-muted-foreground italic">
                        Note: This tool optimizes the document structure. Efficiency depends on the original file content.
                    </p>
                </div>
            )}
        </ToolLayout>
    );
};

export default CompressPdf;
