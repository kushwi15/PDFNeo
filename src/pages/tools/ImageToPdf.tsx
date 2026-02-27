import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileOutput } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const ImageToPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleConvert = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setProgress(0);

        try {
            const pdfDoc = await PDFDocument.create();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const arrayBuffer = await file.arrayBuffer();
                let image;

                if (file.type === "image/jpeg" || file.type === "image/jpg") {
                    image = await pdfDoc.embedJpg(arrayBuffer);
                } else if (file.type === "image/png") {
                    image = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    continue;
                }

                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height,
                });

                setProgress(Math.round(((i + 1) / files.length) * 100));
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "converted.pdf";
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Successfully converted images to PDF!");
        } catch (error) {
            console.error("Conversion failed:", error);
            toast.error("Failed to convert images to PDF");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="Image to PDF"
            description="Convert your images (JPG/PNG) into a single PDF document."
            icon={FileOutput}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={true}
                accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
                label="Drop images here to convert"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Embedding Images</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleConvert}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.01]"
                        size="lg"
                    >
                        {processing ? "Converting..." : `Convert ${files.length} images to PDF`}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default ImageToPdf;
