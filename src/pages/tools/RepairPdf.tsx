import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Wrench } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const RepairPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleRepair = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();

            // pdf-lib's load often fixes minor catalog inconsistencies
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `repaired_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF repair attempted. Saved a new clean version.");
        } catch (error) {
            console.error("Repair failed:", error);
            toast.error("Failed to repair PDF. The file might be severely corrupted.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Repair PDF"
            description="Attempt to fix corrupted or damaged PDF files by re-generating the document structure."
            icon={Wrench}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a damaged PDF file here to repair"
            />

            {files.length > 0 && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Button
                        onClick={handleRepair}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Repairing..." : "Repair PDF"}
                    </Button>
                    <p className="mt-4 text-xs text-center text-muted-foreground italic">
                        Note: This tool reconstructs the PDF internal structure. It may not fix all types of corruption.
                    </p>
                </div>
            )}
        </ToolLayout>
    );
};

export default RepairPdf;
