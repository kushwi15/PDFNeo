import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Trash2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DeletePages = () => {
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
        return Array.from(pages).sort((a, b) => b - a); // Sort descending for deletion
    };

    const handleDelete = async () => {
        if (files.length === 0 || !range) {
            toast.error("Please select a file and enter pages to delete");
            return;
        }

        setProcessing(true);
        setProgress(0);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const totalPages = pdfDoc.getPageCount();

            const pageIndices = parseRange(range, totalPages);
            if (pageIndices.length === 0) {
                toast.error("Invalid page range specified");
                return;
            }

            if (pageIndices.length >= totalPages) {
                toast.error("Cannot delete all pages from the PDF");
                return;
            }

            for (let i = 0; i < pageIndices.length; i++) {
                pdfDoc.removePage(pageIndices[i]);
                setProgress(Math.round(((i + 1) / pageIndices.length) * 100));
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `updated_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`Successfully deleted ${pageIndices.length} pages!`);
        } catch (error) {
            console.error("Deletion failed:", error);
            toast.error("Failed to delete pages");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="Delete Pages"
            description="Remove unwanted pages from your PDF document."
            icon={Trash2}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to delete pages"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Pages to Delete</label>
                        <Input
                            placeholder="e.g. 1, 3, 5-10"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            className="h-12"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter individual pages or ranges to remove.
                        </p>
                    </div>

                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Removing Pages</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleDelete}
                        disabled={processing || !range}
                        variant="destructive"
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Deleting..." : "Delete Pages"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default DeletePages;
