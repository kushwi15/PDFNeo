import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToHash from "./components/ScrollToHash";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MergePdf from "./pages/tools/MergePdf";
import RotatePdf from "./pages/tools/RotatePdf";
import SplitPdf from "./pages/tools/SplitPdf";
import ExtractPages from "./pages/tools/ExtractPages";
import DeletePages from "./pages/tools/DeletePages";
import EditMetadata from "./pages/tools/EditMetadata";
import ResizePdf from "./pages/tools/ResizePdf";
import FlattenPdf from "./pages/tools/FlattenPdf";
import ImageToPdf from "./pages/tools/ImageToPdf";
import AddWatermark from "./pages/tools/AddWatermark";
import PageNumbers from "./pages/tools/PageNumbers";
import CropPdf from "./pages/tools/CropPdf";
import RepairPdf from "./pages/tools/RepairPdf";
import CompressPdf from "./pages/tools/CompressPdf";
import EsignPdf from "./pages/tools/EsignPdf";
import HeaderFooter from "./pages/tools/HeaderFooter";
import PdfToWord from "./pages/tools/PdfToWord";
import PdfToText from "./pages/tools/PdfToText";
import PdfToImage from "./pages/tools/PdfToImage";
import ExtractImages from "./pages/tools/ExtractImages";
import UnlockPdf from "./pages/tools/UnlockPdf";
import ProtectPdf from "./pages/tools/ProtectPdf";
import ToolPlaceholder from "./pages/tools/ToolPlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools/merge-pdf" element={<MergePdf />} />
          <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
          <Route path="/tools/split-pdf" element={<SplitPdf />} />
          <Route path="/tools/extract-pages" element={<ExtractPages />} />
          <Route path="/tools/delete-pages" element={<DeletePages />} />
          <Route path="/tools/edit-metadata" element={<EditMetadata />} />
          <Route path="/tools/resize-pdf" element={<ResizePdf />} />
          <Route path="/tools/flatten-pdf" element={<FlattenPdf />} />
          <Route path="/tools/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/tools/watermark" element={<AddWatermark />} />
          <Route path="/tools/page-numbers" element={<PageNumbers />} />
          <Route path="/tools/crop-pdf" element={<CropPdf />} />
          <Route path="/tools/repair-pdf" element={<RepairPdf />} />
          <Route path="/tools/compress-pdf" element={<CompressPdf />} />
          <Route path="/tools/esign" element={<EsignPdf />} />
          <Route path="/tools/header-footer" element={<HeaderFooter />} />
          <Route path="/tools/pdf-to-word" element={<PdfToWord />} />
          <Route path="/tools/pdf-to-text" element={<PdfToText />} />
          <Route path="/tools/pdf-to-image" element={<PdfToImage />} />
          <Route path="/tools/extract-images" element={<ExtractImages />} />
          <Route path="/tools/unlock-pdf" element={<UnlockPdf />} />
          <Route path="/tools/protect-pdf" element={<ProtectPdf />} />
          <Route path="/tools/:toolId" element={<ToolPlaceholder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
