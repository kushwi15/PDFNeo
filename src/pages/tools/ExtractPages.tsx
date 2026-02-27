import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileOutput } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ExtractPages = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [range, setRange] = useState("");
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const parseRange = (rangeStr: string, maxPage: number): number[] => {
        const pages = new Set<number>();
        const parts = rangeStr.split(",").map(p => p.trim());

        for (const part of parts) {
            if (part.includes("-")) {
                const [start, end] = part.split("-").map(n => parseInt(n));
                if (isNaN(start) || isNaN(end)) continue;
                for (let i = Math.max(1, start); i <= Math.min(maxPage, end); i++) {
                    pages.add(i - 1); // 0-indexed
                }
            } else {
                const page = parseInt(part);
                if (!isNaN(page) && page >= 1 && page <= maxPage) {
                    pages.add(page - 1);
                }
            }
        }
        return Array.from(pages).sort((a, b) => a - b);
    };

    const handleExtract = async () => {
        if (files.length === 0 || !range) {
            toast.error("Please select a file and enter a page range");
            return;
        }

        setProcessing(true);
        setProgress(0);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const sourcePdf = await PDFDocument.load(arrayBuffer);
            const totalPages = sourcePdf.getPageCount();

            const pageIndices = parseRange(range, totalPages);
            if (pageIndices.length === 0) {
                toast.error("Invalid page range specified");
                return;
            }

            const newPdf = await PDFDocument.create();
            const copiedPages = await newPdf.copyPages(sourcePdf, pageIndices);

            for (let i = 0; i < copiedPages.length; i++) {
                newPdf.addPage(copiedPages[i]);
                setProgress(Math.round(((i + 1) / copiedPages.length) * 100));
            }

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `extracted_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`Successfully extracted ${pageIndices.length} pages!`);
        } catch (error) {
            console.error("Extraction failed:", error);
            toast.error("Failed to extract pages");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="Extract Pages"
            description="Extract specific pages from your PDF into a new document."
            icon={FileOutput}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to extract pages"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Page Range</label>
                        <Input
                            placeholder="e.g. 1, 3, 5-10"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="h-12"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter individual pages separated by commas, or ranges using dashes.
                        </p>
                    </div>

                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Creating PDF</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleExtract}
                        disabled={processing || !range}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Extracting..." : "Extract Pages"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default ExtractPages;
