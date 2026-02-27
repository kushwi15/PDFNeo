import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Layers } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FlattenPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleFlatten = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const form = pdfDoc.getForm();
            form.flatten();

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `flattened_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF flattened successfully! Form fields are now uneditable.");
        } catch (error) {
            console.error("Flatten failed:", error);
            toast.error("Failed to flatten PDF");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Flatten PDF"
            description="Make form fields uneditable and merge annotations with page content."
            icon={Layers}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to flatten"
            />

            {files.length > 0 && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Button
                        onClick={handleFlatten}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                    >
                        {processing ? "Flattening..." : "Flatten PDF"}
                    </Button>
                    <p className="mt-4 text-xs text-center text-muted-foreground">
                        This will merge all interactive form fields into the document content.
                    </p>
                </div>
            )}
        </ToolLayout>
    );
};

export default FlattenPdf;
