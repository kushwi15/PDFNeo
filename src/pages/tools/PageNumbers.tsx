import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Hash } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const PageNumbers = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [position, setPosition] = useState("bottom-center");
    const [processing, setProcessing] = useState(false);

    const handlePageNumbers = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();
                const text = `Page ${i + 1} of ${pages.length}`;
                const fontSize = 10;
                const textWidth = font.widthOfTextAtSize(text, fontSize);

                let x = width / 2 - textWidth / 2;
                let y = 20;

                if (position === "bottom-left") x = 20;
                else if (position === "bottom-right") x = width - textWidth - 20;
                else if (position === "top-center") { y = height - 30; x = width / 2 - textWidth / 2; }
                else if (position === "top-left") { y = height - 30; x = 20; }
                else if (position === "top-right") { y = height - 30; x = width - textWidth - 20; }

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    font,
                    color: rgb(0.3, 0.3, 0.3),
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `numbered_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Page numbers added successfully!");
        } catch (error) {
            console.error("Page numbering failed:", error);
            toast.error("Failed to add page numbers");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Page Numbers"
            description="Add sequential page numbers to your PDF document."
            icon={Hash}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to add page numbers"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Position</label>
                        <Select value={position} onValueChange={setPosition}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                <SelectItem value="top-left">Top Left</SelectItem>
                                <SelectItem value="top-center">Top Center</SelectItem>
                                <SelectItem value="top-right">Top Right</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handlePageNumbers}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Adding..." : "Add Page Numbers"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default PageNumbers;
