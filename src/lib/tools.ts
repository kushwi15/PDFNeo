import { FileText, Merge, Scissors, Minimize2, RotateCw, Trash2, FileOutput, FileEdit, Crop, Maximize2, Layers, Lock, Unlock, Image, Stamp, Hash, AlignLeft, PenTool, Wrench, type LucideIcon } from "lucide-react";

export interface PdfTool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  route: string;
  category: "convert" | "edit" | "security";
  comingSoon?: boolean;
}

export const pdfTools: PdfTool[] = [
  // Core - Conversion
  { id: "pdf-to-word", name: "PDF to Word", description: "Convert PDF documents to editable Word files", icon: FileText, route: "/tools/pdf-to-word", category: "convert" },
  { id: "pdf-to-image", name: "PDF to Image", description: "Export PDF pages as high-quality images", icon: Image, route: "/tools/pdf-to-image", category: "convert" },
  { id: "pdf-to-text", name: "PDF to Text", description: "Extract all text content from PDFs", icon: FileText, route: "/tools/pdf-to-text", category: "convert" },
  { id: "image-to-pdf", name: "Image to PDF", description: "Combine images into a single PDF", icon: FileOutput, route: "/tools/image-to-pdf", category: "convert" },

  // Core - Editing
  { id: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one document", icon: Merge, route: "/tools/merge-pdf", category: "edit" },
  { id: "split-pdf", name: "Split PDF", description: "Split a PDF into separate documents", icon: Scissors, route: "/tools/split-pdf", category: "edit" },
  { id: "compress-pdf", name: "Compress PDF", description: "Reduce PDF file size without losing quality", icon: Minimize2, route: "/tools/compress-pdf", category: "edit" },
  { id: "rotate-pdf", name: "Rotate PDF", description: "Rotate PDF pages to any orientation", icon: RotateCw, route: "/tools/rotate-pdf", category: "edit" },
  { id: "delete-pages", name: "Delete Pages", description: "Remove unwanted pages from your PDF", icon: Trash2, route: "/tools/delete-pages", category: "edit" },
  { id: "extract-pages", name: "Extract Pages", description: "Extract specific pages from a PDF", icon: FileOutput, route: "/tools/extract-pages", category: "edit" },
  { id: "edit-metadata", name: "Edit Metadata", description: "Modify PDF title, author, and properties", icon: FileEdit, route: "/tools/edit-metadata", category: "edit" },
  { id: "crop-pdf", name: "Crop PDF", description: "Crop and trim PDF page margins", icon: Crop, route: "/tools/crop-pdf", category: "edit" },
  { id: "resize-pdf", name: "Resize PDF", description: "Change PDF page dimensions", icon: Maximize2, route: "/tools/resize-pdf", category: "edit" },
  { id: "edit-pdf", name: "Edit PDF", description: "Edit text, add images, and modify PDF content directly", icon: FileEdit, route: "/tools/edit-pdf", category: "edit" },
  { id: "flatten-pdf", name: "Flatten PDF", description: "Flatten form fields and annotations", icon: Layers, route: "/tools/flatten-pdf", category: "edit" },

  // Core - Security
  { id: "protect-pdf", name: "Protect PDF", description: "Add password protection to your PDF", icon: Lock, route: "/tools/protect-pdf", category: "security" },
  { id: "unlock-pdf", name: "Unlock PDF", description: "Remove password from protected PDFs", icon: Unlock, route: "/tools/unlock-pdf", category: "security" },

  // Coming Soon
  { id: "extract-images", name: "Extract Images", description: "Pull all images from a PDF document", icon: Image, route: "/tools/extract-images", category: "convert" },
  { id: "watermark", name: "Add Watermark", description: "Add text or image watermarks to PDFs", icon: Stamp, route: "/tools/watermark", category: "edit" },
  { id: "page-numbers", name: "Page Numbers", description: "Add page numbers to your PDF", icon: Hash, route: "/tools/page-numbers", category: "edit" },
  { id: "header-footer", name: "Header & Footer", description: "Add headers and footers to PDF pages", icon: AlignLeft, route: "/tools/header-footer", category: "edit" },
  { id: "esign", name: "eSign PDF", description: "Electronically sign your PDF documents", icon: PenTool, route: "/tools/esign", category: "edit" },
  { id: "repair-pdf", name: "Repair PDF", description: "Fix corrupted or damaged PDF files", icon: Wrench, route: "/tools/repair-pdf", category: "edit" },
];

export const coreTools = pdfTools;
export const comingSoonTools = [];
