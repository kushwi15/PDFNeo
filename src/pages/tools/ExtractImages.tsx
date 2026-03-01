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

const ExtractImages = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleExtract = async () => {
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

            let imageCount = 0;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const operatorList = await page.getOperatorList();

                const validImages = [pdfjsLib.OPS.paintImageXObject, pdfjsLib.OPS.paintInlineImageXObject];

                for (let j = 0; j < operatorList.fnArray.length; j++) {
                    if (validImages.includes(operatorList.fnArray[j])) {
                        const imageName = operatorList.argsArray[j][0];
                        try {
                            const image = await page.objs.get(imageName);
                            if (image) {
                                // Render image to canvas to export
                                const canvas = document.createElement("canvas");
                                const ctx = canvas.getContext("2d");
                                canvas.width = image.width;
                                canvas.height = image.height;

                                if (ctx) {
                                    const imgData = ctx.createImageData(image.width, image.height);
                                    imgData.data.set(image.data);
                                    ctx.putImageData(imgData, 0, 0);

                                    const dataUrl = canvas.toDataURL("image/png");
                                    const a = document.createElement("a");
                                    a.href = dataUrl;
                                    a.download = `extracted_image_${imageCount + 1}.png`;
                                    a.click();
                                    imageCount++;

                                    await new Promise(resolve => setTimeout(resolve, 200));
                                }
                            }
                        } catch (e) {
                            console.warn("Failed to extract image object:", imageName);
                        }
                    }
                }

                setProgress(Math.round((i / pdf.numPages) * 100));
            }

            if (imageCount === 0) {
                toast.info("No images found in this PDF");
            } else {
                toast.success(`Extracted ${imageCount} images!`);
            }
        } catch (error) {
            console.error("Extraction failed:", error);
            toast.error("Failed to extract images from PDF");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="Extract Images"
            description="Identify and extract all embedded images from your PDF document."
            icon={ImageIcon}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to extract images"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Scanning Pages</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleExtract}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Extracting..." : "Extract All Images"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default ExtractImages;
