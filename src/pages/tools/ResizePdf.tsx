import { useState } from "react";
import { PDFDocument, PageSizes } from "pdf-lib";
import { Maximize2 } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ResizePdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [size, setSize] = useState("A4");
    const [processing, setProcessing] = useState(false);

    const handleResize = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            let newSize: [number, number];
            switch (size) {
                case "A4": newSize = PageSizes.A4; break;
                case "Letter": newSize = PageSizes.Letter; break;
                case "Legal": newSize = PageSizes.Legal; break;
                case "A3": newSize = PageSizes.A3; break;
                default: newSize = PageSizes.A4;
            }

            for (const page of pages) {
                page.setSize(newSize[0], newSize[1]);
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `resized_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success(`Successfully resized to ${size}!`);
        } catch (error) {
            console.error("Resize failed:", error);
            toast.error("Failed to resize PDF");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Resize PDF"
            description="Change the page size of your PDF document."
            icon={Maximize2}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to resize"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Target Size</label>
                        <Select value={size} onValueChange={setSize}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                                <SelectItem value="Letter">Letter (8.5 x 11 in)</SelectItem>
                                <SelectItem value="Legal">Legal (8.5 x 14 in)</SelectItem>
                                <SelectItem value="A3">A3 (297 x 420 mm)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleResize}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Resizing..." : "Resize PDF"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default ResizePdf;
