import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Image as ImageIcon } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Use local worker
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfToImage = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleConvert = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setProgress(0);

        try {
            // Ensure worker is set
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2.0 }); // High quality

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport, canvas }).promise;
                    const dataUrl = canvas.toDataURL("image/png");

                    const a = document.createElement("a");
                    a.href = dataUrl;
                    a.download = `${file.name.replace(".pdf", "")}_page_${i}.png`;
                    a.click();
                }

                setProgress(Math.round((i / pdf.numPages) * 100));
                // Small delay to prevent blocking
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            toast.success("All pages exported as images!");
        } catch (error) {
            console.error("Conversion failed:", error);
            toast.error("Failed to convert PDF to images");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="PDF to Image"
            description="Convert your PDF pages into high-quality PNG images."
            icon={ImageIcon}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to convert to images"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Rendering Pages</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleConvert}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Converting..." : "Convert to Images"}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground italic">
                        Note: Your browser may prompt you to allow multiple file downloads.
                    </p>
                </div>
            )}
        </ToolLayout>
    );
};

export default PdfToImage;
