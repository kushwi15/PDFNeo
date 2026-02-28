import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileDropzoneProps {
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  label?: string;
}

const FileDropzone = ({
  accept = { "application/pdf": [".pdf"] },
  multiple = true,
  maxSize = 100 * 1024 * 1024,
  files,
  onFilesChange,
  label = "Drop PDF files here, or click to browse",
}: FileDropzoneProps) => {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onFilesChange(multiple ? [...files, ...accepted] : accepted);
    },
    [files, multiple, onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
  });

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-secondary/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Upload className="h-7 w-7" />
        </div>
        <div className="text-center">
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">Max {formatSize(maxSize)} per file</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 card-shadow"
            >
              <FileText className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
