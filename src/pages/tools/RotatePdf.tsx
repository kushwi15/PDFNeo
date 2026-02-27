import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { RotateCw } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const RotatePdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [rotation, setRotation] = useState("90");
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleRotate = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setProgress(0);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            const deg = parseInt(rotation);

            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                const currentRotation = page.getRotation().angle;
                page.setRotation(degrees((currentRotation + deg) % 360));
                setProgress(Math.round(((i + 1) / pages.length) * 100));
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `rotated_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF rotated successfully!");
        } catch (error) {
            console.error("Rotation failed:", error);
            toast.error("Failed to rotate PDF");
        } finally {
            setProcessing(false);
            setProgress(0);
        }
    };

    return (
        <ToolLayout
            title="Rotate PDF"
            description="Rotate all pages in your PDF by 90, 180, or 270 degrees."
            icon={RotateCw}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to rotate"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Rotation Angle</label>
                            <Select value={rotation} onValueChange={setRotation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select angle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="90">90° Clockwise</SelectItem>
                                    <SelectItem value="180">180°</SelectItem>
                                    <SelectItem value="270">90° Counter-clockwise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {processing && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                <span>Processing Pages</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    )}

                    <Button
                        onClick={handleRotate}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.01]"
                        size="lg"
                    >
                        {processing ? "Rotating..." : "Rotate PDF"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default RotatePdf;
