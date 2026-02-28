import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Merge } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    setProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const arrayBuffer = await files[i].arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Merge failed:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document. Drag to reorder."
      icon={Merge}
    >
      <FileDropzone files={files} onFilesChange={setFiles} />

      {files.length >= 2 && (
        <div className="mt-6 space-y-4">
          {processing && <Progress value={progress} className="h-2" />}
          <Button
            onClick={handleMerge}
            disabled={processing}
            className="w-full"
            size="lg"
          >
            {processing ? `Merging... ${progress}%` : `Merge ${files.length} files`}
          </Button>
        </div>
      )}
    </ToolLayout>
  );
};

export default MergePdf;
