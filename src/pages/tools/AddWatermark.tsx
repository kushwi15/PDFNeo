import { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { Stamp } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const AddWatermark = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [text, setText] = useState("CONFIDENTIAL");
    const [opacity, setOpacity] = useState(0.3);
    const [processing, setProcessing] = useState(false);

    const handleWatermark = async () => {
        if (files.length === 0 || !text) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const pages = pdfDoc.getPages();

            for (const page of pages) {
                const { width, height } = page.getSize();

                // Draw diagonal watermark
                page.drawText(text, {
                    x: width / 4,
                    y: height / 2,
                    size: 60,
                    font: helveticaFont,
                    color: rgb(0.5, 0.5, 0.5),
                    opacity: opacity,
                    rotate: degrees(45),
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `watermarked_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Watermark added successfully!");
        } catch (error) {
            console.error("Watermark failed:", error);
            toast.error("Failed to add watermark");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Add Watermark"
            description="Add a custom text watermark to every page of your PDF."
            icon={Stamp}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to add a watermark"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Watermark Text</label>
                            <Input
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter watermark text..."
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Opacity</label>
                                <span className="text-sm text-muted-foreground">{Math.round(opacity * 100)}%</span>
                            </div>
                            <Slider
                                value={[opacity]}
                                onValueChange={(val) => setOpacity(val[0])}
                                min={0}
                                max={1}
                                step={0.05}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleWatermark}
                        disabled={processing || !text}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Adding..." : "Add Watermark"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default AddWatermark;
