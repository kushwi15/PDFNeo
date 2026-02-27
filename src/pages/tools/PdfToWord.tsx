import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileText } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const PdfToWord = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleConvert = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setProgress(0);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let htmlContent = "<html><body>";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                htmlContent += `<p>${pageText}</p><br clear=all style='mso-special-character:page-break'>`;
                setProgress(Math.round((i / pdf.numPages) * 100));
            }
            htmlContent += "</body></html>";

            // Convert to a basic Word-compatible .doc format
            const blob = new Blob([htmlContent], { type: "application/msword" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${file.name.replace(".pdf", "")}.doc`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Successfully converted to Word doc!");
        } catch (error) {
            console.error("Conversion failed:", error);
            toast.error("Failed to convert PDF to Word");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="PDF to Word"
            description="Convert your PDF document into an editable Word file (.doc)."
            icon={FileText}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to convert to Word"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Analyzing Content</span>
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
                        {processing ? "Converting..." : "Convert to Word"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default PdfToWord;
