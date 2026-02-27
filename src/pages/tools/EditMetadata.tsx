import { useState, useEffect } from "react";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";
import { FileEdit, Eye, Save } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface MetadataState {
    title: string;
    author: string;
    subject: string;
    keywords: string;
    creator: string;
    producer: string;
    creationDate: string;
    modificationDate: string;
}

const formatDateToPDFString = (date: Date | undefined): string => {
    if (!date) return "";
    const pad = (num: number) => String(num).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    const offsetMinutes = -date.getTimezoneOffset();
    const offsetSign = offsetMinutes >= 0 ? "+" : "-";
    const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60));
    const offsetMinRest = pad(Math.abs(offsetMinutes) % 60);
    return `D:${yyyy}${mm}${dd}${hh}${min}${ss}${offsetSign}${offsetHours}'${offsetMinRest}'`;
};

const EditMetadata = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [metadata, setMetadata] = useState<MetadataState>({
        title: "",
        author: "",
        subject: "",
        keywords: "",
        creator: "",
        producer: "",
        creationDate: "",
        modificationDate: "",
    });
    const [originalMetadata, setOriginalMetadata] = useState<MetadataState | null>(null);
    const [processing, setProcessing] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const loadMetadata = async () => {
            if (files.length === 0) {
                setOriginalMetadata(null);
                return;
            }
            try {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);

                const loadedMeta: MetadataState = {
                    title: pdfDoc.getTitle() || "",
                    author: pdfDoc.getAuthor() || "",
                    subject: pdfDoc.getSubject() || "",
                    keywords: pdfDoc.getKeywords() || "",
                    creator: pdfDoc.getCreator() || "",
                    producer: pdfDoc.getProducer() || "",
                    creationDate: formatDateToPDFString(pdfDoc.getCreationDate()),
                    modificationDate: formatDateToPDFString(pdfDoc.getModificationDate()),
                };

                setMetadata(loadedMeta);
                setOriginalMetadata(loadedMeta);
            } catch (error) {
                console.error("Failed to load metadata:", error);
                toast.error("Failed to read PDF metadata. It might be protected.");
            }
        };
        loadMetadata();
    }, [files]);

    const handleUpdate = async () => {
        if (files.length === 0) return;
        setProcessing(true);
        setShowPreview(false);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            pdfDoc.setTitle(metadata.title);
            pdfDoc.setAuthor(metadata.author);
            pdfDoc.setSubject(metadata.subject);
            pdfDoc.setKeywords(metadata.keywords.split(",").map((k) => k.trim()));
            pdfDoc.setCreator(metadata.creator);
            pdfDoc.setProducer(metadata.producer);

            const infoDict = (pdfDoc as any).getInfoDict();
            if (metadata.creationDate) {
                infoDict.set(PDFName.of("CreationDate"), PDFString.of(metadata.creationDate));
            }
            if (metadata.modificationDate) {
                infoDict.set(PDFName.of("ModDate"), PDFString.of(metadata.modificationDate));
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `refined_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Metadata updated and downloaded successfully!");
        } catch (error) {
            console.error("Metadata update failed:", error);
            toast.error("Failed to update and export metadata.");
        } finally {
            setProcessing(false);
        }
    };

    const fieldLabels: Record<keyof MetadataState, string> = {
        title: "Document Title",
        author: "Author",
        subject: "Subject",
        keywords: "Keywords",
        creator: "Creator",
        producer: "PDF Producer",
        creationDate: "Creation Date (RAW)",
        modificationDate: "Modification Date (RAW)",
    };

    return (
        <ToolLayout
            title="Edit Metadata"
            description="Professional high-precision metadata refinement, local and secure."
            icon={FileEdit}
        >
            <FileDropzone
                files={files}
                onFilesChange={setFiles}
                multiple={false}
                label="Drop a PDF file here to refine its metadata"
            />

            {files.length > 0 && originalMetadata && (
                <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.title}</label>
                            <Input
                                value={metadata.title}
                                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                                placeholder="Untitled Document"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.author}</label>
                            <Input
                                value={metadata.author}
                                onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                                placeholder="Anonymous"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.subject}</label>
                            <Input
                                value={metadata.subject}
                                onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                                placeholder="General"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.keywords}</label>
                            <Input
                                value={metadata.keywords}
                                onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                                placeholder="pdf, document, info"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.creationDate}</label>
                            <Input
                                value={metadata.creationDate}
                                onChange={(e) => setMetadata({ ...metadata, creationDate: e.target.value })}
                                placeholder="D:20240101120000+00'00'"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.modificationDate}</label>
                            <Input
                                value={metadata.modificationDate}
                                onChange={(e) => setMetadata({ ...metadata, modificationDate: e.target.value })}
                                placeholder="D:20240101120000+00'00'"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.creator}</label>
                            <Input
                                value={metadata.creator}
                                onChange={(e) => setMetadata({ ...metadata, creator: e.target.value })}
                                placeholder="Application name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{fieldLabels.producer}</label>
                            <Input
                                value={metadata.producer}
                                onChange={(e) => setMetadata({ ...metadata, producer: e.target.value })}
                                placeholder="PDF producer"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            onClick={() => setShowPreview(true)}
                            variant="outline"
                            className="flex-1 h-12 text-base font-semibold transition-all hover:bg-secondary/50"
                        >
                            <Eye className="mr-2 h-5 w-5" />
                            Preview Updates
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={processing}
                            className="flex-1 h-12 text-base font-semibold shadow-lg shadow-primary/20"
                        >
                            <Save className="mr-2 h-5 w-5" />
                            {processing ? "Refining..." : "Save & Export"}
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Verify Metadata Transformation</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[150px]">Field</TableHead>
                                    <TableHead>Current State</TableHead>
                                    <TableHead>Proposed State</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(Object.keys(fieldLabels) as Array<keyof MetadataState>).map((key) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-medium text-muted-foreground">
                                            {fieldLabels[key]}
                                        </TableCell>
                                        <TableCell className="break-all opacity-70 italic font-mono text-xs">
                                            {originalMetadata?.[key] || "Not available"}
                                        </TableCell>
                                        <TableCell className="break-all font-mono text-xs text-primary font-semibold">
                                            {metadata[key] || "Not available"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={() => setShowPreview(false)}>
                            Back to Editing
                        </Button>
                        <Button onClick={handleUpdate} disabled={processing}>
                            Confirm & Download
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ToolLayout>
    );
};

export default EditMetadata;
