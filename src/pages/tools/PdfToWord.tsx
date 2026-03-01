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

const PdfToWord = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleConvert = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setProgress(0);

        try {
            // Ensure worker is set correctly
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>Converted Document</title>
          <style>
            @page { margin: 1in; }
            body { font-family: 'Arial', sans-serif; line-height: 1.5; }
            p { margin: 0 0 10pt 0; text-align: justify; }
          </style>
        </head>
        <body>
      `;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageItems = textContent.items.map((item: any) => item.str);

                let pageText = "";
                let lastY: number | null = null;

                textContent.items.forEach((item: any) => {
                    // Detection for basic line breaks
                    if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                        pageText += "</p><p>";
                    }
                    pageText += item.str + " ";
                    lastY = item.transform[5];
                });

                htmlContent += `<div class="page"><p>${pageText}</p></div>`;
                if (i < pdf.numPages) {
                    htmlContent += "<br clear=all style='mso-special-character:page-break'>";
                }
                setProgress(Math.round((i / pdf.numPages) * 100));
            }

            htmlContent += "</body></html>";

            // Use the .doc extension which Word handles as HTML/MSO-compatible
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
            toast.error("Failed to convert PDF to Word. Ensure the file is not corrupted.");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="PDF to Word"
            description="Refine and convert your PDF documents into editable Word files locally."
            icon={FileText}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to begin Word conversion"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Refining Document Structure</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleConvert}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold shadow-lg"
                    >
                        {processing ? "Converting..." : "Convert to Word"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default PdfToWord;
