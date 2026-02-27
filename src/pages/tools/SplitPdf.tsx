import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Scissors } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SplitPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [mode, setMode] = useState("every"); // "every" or "fixed"
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleSplit = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setProgress(0);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const totalPages = sourcePdf.getPageCount();

            if (mode === "every") {
                for (let i = 0; i < totalPages; i++) {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
                    newPdf.addPage(copiedPage);

                    const pdfBytes = await newPdf.save();
                    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${file.name.replace(".pdf", "")}_page_${i + 1}.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);

                    setProgress(Math.round(((i + 1) / totalPages) * 100));
                    // Small delay to prevent browser from blocking multiple downloads
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                toast.success(`Successfully split into ${totalPages} files!`);
            }
        } catch (error) {
            console.error("Split failed:", error);
            toast.error("Failed to split PDF");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="Split PDF"
            description="Split your PDF into separate documents."
            icon={Scissors}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to split"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Split Mode</label>
                        <Select value={mode} onValueChange={setMode}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="every">Split every page</SelectItem>
                                {/* Fixed range split could be added here */}
                            </SelectContent>
                        </Select>
                    </div>

                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>{mode === "every" ? "Splitting Pages" : "Processing"}</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleSplit}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Splitting..." : "Split PDF"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground italic">
                        Note: Your browser may prompt you to allow multiple file downloads.
                    </p>
                </div>
            )}
        </ToolLayout>
    );
};

export default SplitPdf;
