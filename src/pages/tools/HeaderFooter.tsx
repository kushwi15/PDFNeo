import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Layout } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const HeaderFooter = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [header, setHeader] = useState("");
    const [footer, setFooter] = useState("");
    const [alignment, setAlignment] = useState("center");
    const [processing, setProcessing] = useState(false);

    const handleApply = async () => {
        if (files.length === 0 || (!header && !footer)) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();

            for (const page of pages) {
                const { width, height } = page.getSize();
                const fontSize = 10;
                const color = rgb(0.4, 0.4, 0.4);

                if (header) {
                    const headerWidth = font.widthOfTextAtSize(header, fontSize);
                    let hx = width / 2 - headerWidth / 2;
                    if (alignment === "left") hx = 30;
                    else if (alignment === "right") hx = width - headerWidth - 30;

                    page.drawText(header, { x: hx, y: height - 30, size: fontSize, font, color });
                }

                if (footer) {
                    const footerWidth = font.widthOfTextAtSize(footer, fontSize);
                    let fx = width / 2 - footerWidth / 2;
                    if (alignment === "left") fx = 30;
                    else if (alignment === "right") fx = width - footerWidth - 30;

                    page.drawText(footer, { x: fx, y: 20, size: fontSize, font, color });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `updated_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Header and Footer added successfully!");
        } catch (error) {
            console.error("Failed to add header/footer:", error);
            toast.error("An error occurred while processing the PDF.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Header & Footer"
            description="Add custom text to the top or bottom of every page in your PDF."
            icon={Layout}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Header Text</label>
                            <Input
                                value={header}
                                onChange={(e) => setHeader(e.target.value)}
                                placeholder="Top of page text..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Footer Text</label>
                            <Input
                                value={footer}
                                onChange={(e) => setFooter(e.target.value)}
                                placeholder="Bottom of page text..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Alignment</label>
                            <Select value={alignment} onValueChange={setAlignment}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="left">Left</SelectItem>
                                    <SelectItem value="center">Center</SelectItem>
                                    <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={handleApply}
                        disabled={processing || (!header && !footer)}
                        className="w-full h-12 text-base font-semibold mt-4"
                        size="lg"
                    >
                        {processing ? "Applying..." : "Apply Header & Footer"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default HeaderFooter;
