import { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { FileEdit } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EditMetadata = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [metadata, setMetadata] = useState({
        title: "",
        author: "",
        subject: "",
        keywords: "",
        creator: "",
        producer: "",
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const loadMetadata = async () => {
            if (files.length === 0) return;
            try {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);

                setMetadata({
                    title: pdfDoc.getTitle() || "",
                    author: pdfDoc.getAuthor() || "",
                    subject: pdfDoc.getSubject() || "",
                    keywords: pdfDoc.getKeywords() || "",
                    creator: pdfDoc.getCreator() || "",
                    producer: pdfDoc.getProducer() || "",
                });
            } catch (error) {
                console.error("Failed to load metadata:", error);
            }
        };
        loadMetadata();
    }, [files]);

    const handleUpdate = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            pdfDoc.setTitle(metadata.title);
            pdfDoc.setAuthor(metadata.author);
            pdfDoc.setSubject(metadata.subject);
            pdfDoc.setKeywords(metadata.keywords.split(",").map(k => k.trim()));
            pdfDoc.setCreator(metadata.creator);
            pdfDoc.setProducer(metadata.producer);

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `meta_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Metadata updated successfully!");
        } catch (error) {
            console.error("Metadata update failed:", error);
            toast.error("Failed to update metadata");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <ToolLayout
            title="Edit Metadata"
            description="Modify PDF properties like title, author, and keywords."
            icon={FileEdit}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to edit its metadata"
            />

            {files.length > 0 && (
                <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={metadata.title}
                                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Author</label>
                            <Input
                                value={metadata.author}
                                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input
                                value={metadata.subject}
                                onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Keywords (comma separated)</label>
                            <Input
                                value={metadata.keywords}
                                onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Creator</label>
                            <Input
                                value={metadata.creator}
                                onChange={(e) => setMetadata({ ...metadata, creator: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Producer</label>
                            <Input
                                value={metadata.producer}
                                onChange={(e) => setMetadata({ ...metadata, producer: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleUpdate}
                        disabled={processing}
                        className="w-full h-12 text-base font-semibold mt-4"
                        size="lg"
                    >
                        {processing ? "Updating..." : "Update Metadata"}
                    </Button>
                </div>
            )}
        </ToolLayout>
    );
};

export default EditMetadata;
