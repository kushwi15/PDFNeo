import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { FileText } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Document, Packer, Paragraph, TextRun, ImageRun, SectionType, FrameAnchorType } from "docx";

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
            pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            const sections = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.0 });
                const { width, height } = viewport;

                const pageElements: any[] = [];

                // 1. Extract Images
                const operatorList = await page.getOperatorList();
                const validImages = [pdfjsLib.OPS.paintImageXObject, pdfjsLib.OPS.paintInlineImageXObject];

                for (let j = 0; j < operatorList.fnArray.length; j++) {
                    if (validImages.includes(operatorList.fnArray[j])) {
                        const imageName = operatorList.argsArray[j][0];
                        const transform = operatorList.argsArray[j - 1];

                        try {
                            const image = await page.objs.get(imageName);
                            if (image) {
                                const canvas = document.createElement("canvas");
                                const ctx = canvas.getContext("2d");
                                canvas.width = image.width;
                                canvas.height = image.height;
                                if (ctx) {
                                    const imgData = ctx.createImageData(image.width, image.height);
                                    imgData.data.set(image.data);
                                    ctx.putImageData(imgData, 0, 0);
                                    const dataUrl = canvas.toDataURL("image/png");
                                    const base64Data = dataUrl.split(',')[1];
                                    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

                                    if (transform && transform.length >= 6) {
                                        const [scaleX, , , scaleY, tx, ty] = transform;
                                        const left = Math.round(tx * 12700);
                                        const top = Math.round((height - ty - Math.abs(scaleY)) * 12700);

                                        pageElements.push(new Paragraph({
                                            children: [
                                                new ImageRun({
                                                    data: buffer,
                                                    type: "png",
                                                    transformation: {
                                                        width: Math.round(Math.abs(scaleX)),
                                                        height: Math.round(Math.abs(scaleY)),
                                                    },
                                                    floating: {
                                                        horizontalPosition: {
                                                            offset: left,
                                                        },
                                                        verticalPosition: {
                                                            offset: top,
                                                        },
                                                    },
                                                }),
                                            ],
                                        }));
                                    }
                                }
                            }
                        } catch (e) {
                            console.warn("Skipping image:", imageName);
                        }
                    }
                }

                // 2. Extract and Group Text
                const textContent = await page.getTextContent();
                const items = textContent.items as any[];

                // Group items by line (Y coordinate)
                const lines: any[][] = [];
                const sortedItems = [...items].sort((a, b) => {
                    const ay = a.transform[5];
                    const by = b.transform[5];
                    if (Math.abs(ay - by) < 1.5) { // Same line tolerance
                        return a.transform[4] - b.transform[4]; // Sort by X
                    }
                    return by - ay; // Sort by Y descending (top to bottom)
                });

                let currentLine: any[] = [];
                let lastY = -1;

                sortedItems.forEach((item) => {
                    const y = item.transform[5];
                    if (lastY === -1 || Math.abs(y - lastY) < 1.5) {
                        currentLine.push(item);
                    } else {
                        lines.push(currentLine);
                        currentLine = [item];
                    }
                    lastY = y;
                });
                if (currentLine.length > 0) lines.push(currentLine);

                // Process each line as a Paragraph
                lines.forEach((line) => {
                    const firstItem = line[0];
                    const [scaleX, skewY, skewX, scaleY, tx, ty] = firstItem.transform;
                    const fontSize = Math.sqrt(scaleX * scaleX + skewY * skewY);

                    // PDF Y is baseline. Word frame Y is top.
                    // Twips conversion (1pt = 20 twips)
                    const left = Math.round(tx * 20);
                    const top = Math.round((height - ty - fontSize) * 20);

                    // Calculate bounding box width for the line
                    const lineLastItem = line[line.length - 1];
                    const lineRight = lineLastItem.transform[4] + (lineLastItem.width || 0);
                    const lineLeft = firstItem.transform[4];
                    const lineWidth = lineRight - lineLeft;

                    pageElements.push(new Paragraph({
                        frame: {
                            type: "absolute",
                            position: {
                                x: left,
                                y: top,
                            },
                            width: Math.round((lineWidth + 5) * 20), // Small extension for safety
                            height: Math.round((fontSize + 4) * 20), // Small extension for safety
                            anchor: {
                                horizontal: FrameAnchorType.PAGE,
                                vertical: FrameAnchorType.PAGE,
                            },
                        },
                        children: line.map((item, idx) => {
                            const fontName = (item.fontName || "").toLowerCase();
                            const isBold = fontName.includes("bold") || fontName.includes("heavy") || fontName.includes("black");
                            const isItalic = fontName.includes("italic") || fontName.includes("oblique");

                            // Calculate spacing (gap) from previous item in points
                            let spacing = 0;
                            if (idx > 0) {
                                const prevItem = line[idx - 1];
                                const expectedX = prevItem.transform[4] + (prevItem.width || 0);
                                const actualX = item.transform[4];
                                const gapPoints = actualX - expectedX;
                                if (gapPoints > 0.5) { // Only add spacing if gap is significant
                                    spacing = Math.round(gapPoints * 20); // PT to Twips
                                }
                            }

                            return new TextRun({
                                text: item.str,
                                size: Math.round(fontSize * 2), // docx uses half-points
                                font: "Arial",
                                bold: isBold,
                                italics: isItalic,
                                spacing: spacing > 0 ? spacing : undefined,
                            });
                        }),
                    }));
                });

                sections.push({
                    properties: {
                        page: {
                            size: {
                                width: `${width}pt`,
                                height: `${height}pt`,
                            },
                            margin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                            },
                        },
                        type: i === 1 ? SectionType.CONTINUOUS : SectionType.NEXT_PAGE,
                    },
                    children: pageElements,
                });

                setProgress(Math.round((i / pdf.numPages) * 100));
            }

            const doc = new Document({
                sections: sections,
            });

            const blob = await Packer.toBlob(doc);
            const fileName = `${file.name.replace(".pdf", "")}.docx`;

            const a = document.createElement("a");
            const url = URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);

            toast.success("Successfully converted to DOCX with high fidelity!");
        } catch (error) {
            console.error("Conversion failed:", error);
            toast.error("Failed to convert PDF to Word. Error: " + (error as Error).message);
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
                        {processing ? "Converting..." : "Convert to DOCX"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default PdfToWord;
