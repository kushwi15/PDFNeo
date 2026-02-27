import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Crop } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CropPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [margins, setMargins] = useState({ top: 20, bottom: 20, left: 20, right: 20 });
    const [processing, setProcessing] = useState(false);

    const handleCrop = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            for (const page of pages) {
                const { width, height } = page.getSize();
                page.setCropBox(
                    margins.left,
                    margins.bottom,
                    width - margins.left - margins.right,
                    height - margins.top - margins.bottom
                );
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `cropped_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF cropped successfully!");
        } catch (error) {
            console.error("Crop failed:", error);
            toast.error("Failed to crop PDF. Check if margins are too large.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Crop PDF"
            description="Trim PDF page margins by specifying margin sizes."
            icon={Crop}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to crop"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Top Margin</label>
                            <Input
                                type="number"
                                value={margins.top}
                                onChange={(e) => setMargins({ ...margins, top: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bottom Margin</label>
                            <Input
                                type="number"
                                value={margins.bottom}
                                onChange={(e) => setMargins({ ...margins, bottom: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Left Margin</label>
                            <Input
                                type="number"
                                value={margins.left}
                                onChange={(e) => setMargins({ ...margins, left: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Right Margin</label>
                            <Input
                                type="number"
                                value={margins.right}
                                onChange={(e) => setMargins({ ...margins, right: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleCrop}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Cropping..." : "Crop PDF"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default CropPdf;
