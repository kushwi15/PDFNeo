import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileText } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Use local worker
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfToText = () => {
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

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += `--- Page ${i} ---\n${pageText}\n\n`;
                setProgress(Math.round((i / pdf.numPages) * 100));
            }

            const blob = new Blob([fullText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${file.name.replace(".pdf", "")}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Text extracted successfully!");
        } catch (error) {
            console.error("Extraction failed:", error);
            toast.error("Failed to extract text from PDF");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="PDF to Text"
            description="Extract all text content from your PDF and save it as a text file."
            icon={FileText}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to extract text"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Extracting Text</span>
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
                        {processing ? "Extracting..." : "Extract Text"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default PdfToText;
