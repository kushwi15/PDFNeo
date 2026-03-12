import { useState, useRef, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { 
    Type, Link, FormInput, Image as ImageIcon, FileSignature, Eraser, 
    MessageSquare, Shapes, Undo, Download, ZoomOut, ZoomIn, RotateCw, 
    FilePlus, Bold, Italic, Type as TypeIcon, AlignLeft, Move, Copy, Trash2, 
    ChevronDown, AlignCenter, AlignRight, FileEdit
} from "lucide-react";
import FileDropzone from "@/components/FileDropzone";
import ToolLayout from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Use local worker
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type ToolMode = "text" | "erase" | "other" | null;

interface Erasure {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface TextItem {
    id: string;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
    isBold: boolean;
    isItalic: boolean;
    alignment: 'left' | 'center' | 'right';
    fontFamily?: string;
}

interface ExtractedText {
    id: string;
    str: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontFamily: string;
}

const EditPdf = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [processing, setProcessing] = useState(false);
    
    // Tools State
    const [mode, setMode] = useState<ToolMode>(null);
    const [erasures, setErasures] = useState<Record<number, Erasure[]>>({});
    const [texts, setTexts] = useState<Record<number, TextItem[]>>({});
    const [extractedTexts, setExtractedTexts] = useState<Record<number, ExtractedText[]>>({});
    
    // History State (Undo/Redo)
    type HistoryState = { erasures: Record<number, Erasure[]>; texts: Record<number, TextItem[]> };
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    
    // UI State
    const [scale, setScale] = useState(1.2); 
    const [activeTextId, setActiveTextId] = useState<string | null>(null);

    // Canvas & Interaction
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
    
    // Floating Toolbar State
    const [floatingPos, setFloatingPos] = useState({ x: 0, y: 0 });
    const floatingToolbarRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        const loadPdf = async () => {
            if (files.length === 0) {
                setPdf(null);
                setNumPages(0);
                setCurrentPage(1);
                setErasures({});
                setTexts({});
                setExtractedTexts({});
                setActiveTextId(null);
                return;
            }
            try {
                const file = files[0];
                const arrayBuffer = await file.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
                const loadedPdf = await loadingTask.promise;
                setPdf(loadedPdf);
                setNumPages(loadedPdf.numPages);
                setCurrentPage(1);
                setMode("text"); // Default mode
            } catch (error) {
                console.error("Failed to load PDF:", error);
                toast.error("Failed to load PDF. It might be protected.");
            }
        };
        loadPdf();
    }, [files]);

    // Render Page
    useEffect(() => {
        const renderPage = async () => {
            if (!pdf || !canvasRef.current || !containerRef.current) return;
            try {
                const page = await pdf.getPage(currentPage);
                const viewport = page.getViewport({ scale });
                
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                if (!context) return;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                await page.render(renderContext).promise;

                // Extract Text Layer for "Direct Editing" illusion
                const textContent = await page.getTextContent();
                const extracted: ExtractedText[] = [];
                
                for (const item of textContent.items) {
                    if ('str' in item && item.str.trim().length > 0) {
                        // The transform matrix provides X, Y coordinates and scaling
                        // viewport.transform handles the PDF coordinates to Canvas coordinates mapping
                        const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
                        
                        // tx[4] is X, tx[5] is Y (baseline)
                        // item.height is roughly the font height in PDF space, we need it in canvas space
                        // item.width is the width in PDF space
                        
                        const fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
                        
                        // We scale the width based on the viewport scale
                        const scaledWidth = item.width * scale;

                        extracted.push({
                            id: `ext-${Math.random().toString(36).substr(2, 9)}`,
                            str: item.str,
                            x: tx[4] / scale,
                            y: (tx[5] - fontHeight) / scale, // Adjust from baseline to top-left roughly
                            width: scaledWidth / scale,
                            height: fontHeight / scale,
                            fontSize: fontHeight / scale,
                            fontFamily: item.fontName
                        });
                    }
                }
                
                setExtractedTexts(prev => ({...prev, [currentPage]: extracted}));

            } catch (error) {
                console.error("Error rendering page:", error);
            }
        };
        renderPage();
    }, [pdf, currentPage, scale]);

    // Cleanup resources
    useEffect(() => {
        return () => {
            if (pdf) pdf.destroy();
        };
    }, [pdf]);

    // History Tracking
    // We only push to history when a distinct action is completed, 
    // not on every keystroke or intermediate drag state.
    const pushToHistory = useCallback((newErasures: Record<number, Erasure[]>, newTexts: Record<number, TextItem[]>) => {
        setHistory(prev => {
            const currentHistory = prev.slice(0, historyIndex + 1);
            return [...currentHistory, { erasures: newErasures, texts: newTexts }];
        });
        setHistoryIndex(prev => prev + 1);
    }, [historyIndex]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevState = history[historyIndex - 1];
            setErasures(prevState.erasures);
            setTexts(prevState.texts);
            setHistoryIndex(historyIndex - 1);
            setActiveTextId(null);
        } else if (historyIndex === 0) {
             // Reset to completely empty state
             setErasures({});
             setTexts({});
             setHistoryIndex(-1);
             setActiveTextId(null);
        }
    }, [history, historyIndex]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextState = history[historyIndex + 1];
            setErasures(nextState.erasures);
            setTexts(nextState.texts);
            setHistoryIndex(historyIndex + 1);
            setActiveTextId(null);
        }
    }, [history, historyIndex]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if user is typing in an input
            const activeTag = document.activeElement?.tagName.toLowerCase();
            if (activeTag === 'input' || activeTag === 'textarea') return;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                if (e.shiftKey) {
                    e.preventDefault();
                    handleRedo();
                } else {
                    e.preventDefault();
                    handleUndo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo]);

    // Handle Interactions
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!mode || !canvasRef.current) return;
        
        // Don't trigger if clicking inside the floating toolbar or an active input
        if ((e.target as HTMLElement).closest('.floating-toolbar') || 
            (e.target as HTMLElement).tagName === 'INPUT') {
            return;
        }

        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        if (mode === "erase") {
            setIsDrawing(true);
            setStartPos({ x, y });
            setCurrentPos({ x, y });
            setActiveTextId(null); // Deselect text
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
        } else if (mode === "text") {
            const newId = Math.random().toString(36).substr(2, 9);
            const newText: TextItem = {
                id: newId,
                x,
                y,
                text: "New Text",
                fontSize: 14,
                color: "#000000",
                fontFamily: 'Helvetica, Arial, sans-serif',
                isBold: false,
                isItalic: false,
                alignment: 'left'
            };
            
            const newTextsState = {
                ...texts,
                [currentPage]: [...(texts[currentPage] || []), newText]
            };
            setTexts(newTextsState);
            pushToHistory(erasures, newTextsState);
            
            setActiveTextId(newId);
            setFloatingPos({ x: e.clientX, y: e.clientY - 80 });
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDrawing || mode !== "erase" || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        setCurrentPos({ x, y });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDrawing || mode !== "erase") return;
        setIsDrawing(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);

        const width = Math.abs(currentPos.x - startPos.x);
        const height = Math.abs(currentPos.y - startPos.y);
        
        if (width < 5 || height < 5) return; 

        const newErasure: Erasure = {
            x: Math.min(startPos.x, currentPos.x),
            y: Math.min(startPos.y, currentPos.y),
            width,
            height
        };

        const newErasuresState = {
            ...erasures,
            [currentPage]: [...(erasures[currentPage] || []), newErasure]
        };
        
        setErasures(newErasuresState);
        pushToHistory(newErasuresState, texts);
    };

    const handleExtractedTextClick = (e: React.PointerEvent, ext: ExtractedText) => {
        if (mode !== "text") return;
        e.stopPropagation(); // Prevent canvas background click
        
        // 1. Create a Whiteout Erasure covering the exact original text
        const newErasure: Erasure = {
            x: ext.x - 2, // Slight padding
            y: ext.y - 2,
            width: ext.width + 4,
            height: ext.height + 4
        };
        
        // 2. Create an editable TextItem prefilled with the original text
        const newId = Math.random().toString(36).substr(2, 9);
        const newText: TextItem = {
            id: newId,
            x: ext.x,
            y: ext.y + ext.fontSize, // Align to baseline roughly
            text: ext.str,
            fontSize: ext.fontSize,
            fontFamily: ext.fontFamily,
            color: "#000000",
            isBold: false, // Could try to detect from textContent if needed
            isItalic: false,
            alignment: 'left'
        };

        const newErasuresState = {
            ...erasures,
            [currentPage]: [...(erasures[currentPage] || []), newErasure]
        };

        const newTextsState = {
            ...texts,
            [currentPage]: [...(texts[currentPage] || []), newText]
        };

        setErasures(newErasuresState);
        setTexts(newTextsState);
        pushToHistory(newErasuresState, newTextsState);
        
        // Hide the extracted text so it doesn't overlap the new editable input
        setExtractedTexts(prev => ({
            ...prev,
            [currentPage]: (prev[currentPage] || []).filter(t => t.id !== ext.id)
        }));

        setActiveTextId(newId);
        setFloatingPos({ x: e.clientX, y: e.clientY - 80 });
        setMode("text"); // Ensure we stay in text mode
    };

    const handleNotImplemented = (toolName: string) => {
        toast.info(`${toolName} tool is coming soon!`);
        setMode("other");
        setActiveTextId(null);
    };

    const updateActiveText = (updates: Partial<TextItem>, finalSave: boolean = false) => {
        if (!activeTextId) return;
        
        const newTextsState = {
            ...texts,
            [currentPage]: (texts[currentPage] || []).map(t => t.id === activeTextId ? { ...t, ...updates } : t)
        };
        
        setTexts(newTextsState);
        if (finalSave) {
            pushToHistory(erasures, newTextsState);
        }
    };

    const deleteActiveText = () => {
        if (!activeTextId) return;
        const newTextsState = {
            ...texts,
            [currentPage]: (texts[currentPage] || []).filter(t => t.id !== activeTextId)
        };
        setTexts(newTextsState);
        pushToHistory(erasures, newTextsState);
        setActiveTextId(null);
    };

    const duplicateActiveText = () => {
        if (!activeTextId) return;
        const currentArr = texts[currentPage] || [];
        const source = currentArr.find(t => t.id === activeTextId);
        if (!source) return;

        const newId = Math.random().toString(36).substr(2, 9);
        const newText: TextItem = {
            ...source,
            id: newId,
            y: source.y + 20 // Offset slightly
        };

        const newTextsState = {
            ...texts,
            [currentPage]: [...(texts[currentPage] || []), newText]
        };

        setTexts(newTextsState);
        pushToHistory(erasures, newTextsState);
        setActiveTextId(newId);
    };

    const handleSave = async () => {
        if (files.length === 0) return;
        setProcessing(true);

        try {
            const file = files[0];
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const helveticaObliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
            const helveticaBoldObliqueFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);


            const pages = pdfDoc.getPages();

            pages.forEach((page, index) => {
                const pageNum = index + 1;
                const { height } = page.getSize();
                
                const pageErasures = erasures[pageNum] || [];
                pageErasures.forEach(erasure => {
                    page.drawRectangle({
                        x: erasure.x,
                        y: height - (erasure.y + erasure.height),
                        width: erasure.width,
                        height: erasure.height,
                        color: rgb(1, 1, 1), 
                    });
                });

                const pageTexts = texts[pageNum] || [];
                pageTexts.forEach(item => {
                    // Very simple color parser for standard hex
                    const r = parseInt(item.color.slice(1, 3), 16) / 255 || 0;
                    const g = parseInt(item.color.slice(3, 5), 16) / 255 || 0;
                    const b = parseInt(item.color.slice(5, 7), 16) / 255 || 0;

                    let fontToUse = helveticaFont;
                    if (item.isBold && item.isItalic) fontToUse = helveticaBoldObliqueFont;
                    else if (item.isBold) fontToUse = helveticaBoldFont;
                    else if (item.isItalic) fontToUse = helveticaObliqueFont;

                    page.drawText(item.text, {
                        x: item.x,
                        y: height - item.y - item.fontSize, // Adjust for baseline
                        size: item.fontSize,
                        font: fontToUse,
                        color: rgb(r, g, b),
                    });
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `edited_${file.name}`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("PDF saved successfully!");
        } catch (error) {
            console.error("Save failed:", error);
            toast.error("Failed to save edited PDF.");
        } finally {
            setProcessing(false);
        }
    };

    const activeTextObj = texts[currentPage]?.find(t => t.id === activeTextId);

    if (files.length === 0) {
        return (
            <ToolLayout
                title="Edit PDF"
                description="Professional PDF editing with precise text controls."
                icon={FileEdit}
            >
                <FileDropzone
                    files={files}
                    onFilesChange={setFiles}
                    multiple={false}
                    label="Drop a PDF file here to edit"
                />
            </ToolLayout>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-[#f3f4f6]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {/* Top Global Toolbar (Light Blue Theme) */}
            <div className="flex items-center justify-center gap-1 p-2 bg-[#e0f2fe] border-b border-[#bae6fd] shrink-0 sticky top-0 z-50 shadow-sm">
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant={mode === "text" ? "default" : "outline"} 
                            className="h-8 px-3 rounded text-sm bg-white hover:bg-white text-blue-600 border-blue-200"
                            onClick={() => { setMode("text"); setActiveTextId(null); }}
                        >
                            <Type className="w-4 h-4 mr-1.5" /> Text <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setMode("text")}>Add Text Box</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                    variant="outline" 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={() => handleNotImplemented("Links")}
                >
                    <Link className="w-4 h-4 mr-1.5" /> Links
                </Button>

                <Button 
                    variant="outline" 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={() => handleNotImplemented("Forms")}
                >
                    <FormInput className="w-4 h-4 mr-1.5" /> Forms <ChevronDown className="w-3 h-3 ml-1" />
                </Button>

                <Button 
                    variant="outline" 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={() => handleNotImplemented("Images")}
                >
                    <ImageIcon className="w-4 h-4 mr-1.5" /> Images <ChevronDown className="w-3 h-3 ml-1" />
                </Button>

                <Button 
                    variant="outline" 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={() => handleNotImplemented("Sign")}
                >
                    <FileSignature className="w-4 h-4 mr-1.5" /> Sign <ChevronDown className="w-3 h-3 ml-1" />
                </Button>

                <Button 
                    variant={mode === "erase" ? "default" : "outline"} 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={() => { setMode("erase"); setActiveTextId(null); }}
                >
                    <Eraser className="w-4 h-4 mr-1.5" /> Whiteout
                </Button>

                <Button 
                    variant="outline" 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={() => handleNotImplemented("Annotate")}
                >
                    <MessageSquare className="w-4 h-4 mr-1.5" /> Annotate <ChevronDown className="w-3 h-3 ml-1" />
                </Button>

                <Button 
                    variant="outline" 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={() => handleNotImplemented("Shapes")}
                >
                    <Shapes className="w-4 h-4 mr-1.5" /> Shapes <ChevronDown className="w-3 h-3 ml-1" />
                </Button>

                <div className="w-px h-6 bg-blue-300 mx-1"></div>

                <Button 
                    variant="outline" 
                    className="h-8 px-3 rounded text-sm bg-white hover:bg-gray-50 border-blue-200 text-blue-600"
                    onClick={handleUndo}
                    disabled={historyIndex < 0}
                >
                    <Undo className="w-4 h-4 mr-1.5" /> Undo
                </Button>
            </div>

            {/* Secondary Page Toolbar */}
            <div className="flex items-center justify-center gap-4 p-2 bg-[#f8fafc] border-b border-gray-100 shrink-0">
                <span className="text-blue-500 font-bold text-[15px] mr-2">{currentPage}</span>
                
                <div className="flex bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden h-9">
                    <Button variant="ghost" size="icon" className="h-full w-9 rounded-none hover:bg-gray-50 text-blue-500">
                        <FilePlus className="w-4 h-4" />
                    </Button>
                    <div className="w-px bg-gray-200 mx-0"></div>
                    <Button variant="ghost" size="icon" className="h-full w-9 rounded-none hover:bg-gray-50 text-blue-500" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                    <div className="w-px bg-gray-200 mx-0"></div>
                    <Button variant="ghost" size="icon" className="h-full w-9 rounded-none hover:bg-gray-50 text-blue-500" onClick={() => setScale(s => Math.min(3, s + 0.1))}>
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                    <div className="w-px bg-gray-200 mx-0"></div>
                    <Button variant="ghost" size="icon" className="h-full w-9 rounded-none hover:bg-gray-50 text-blue-500" onClick={() => handleNotImplemented("Rotate")}>
                        <RotateCw className="w-4 h-4" />
                    </Button>
                    <div className="w-px bg-gray-200 mx-0"></div>
                    <Button variant="ghost" size="icon" className="h-full w-9 rounded-none hover:bg-gray-50 text-blue-500" onClick={() => handleNotImplemented("Undo")}>
                        <Undo className="w-4 h-4" />
                    </Button>
                </div>

                <Button variant="outline" className="h-9 px-4 rounded-md bg-[#e0f2fe]/60 border-blue-200 text-blue-600 hover:bg-[#e0f2fe] text-sm font-medium">
                    <FilePlus className="w-4 h-4 mr-2" /> Insert page here
                </Button>
            </div>

            {/* Main Canvas Area */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-auto flex flex-col items-center py-4 relative"
            >
                <div className="relative shadow-xl ring-1 ring-border/50 bg-white select-none inline-block">
                    <canvas ref={canvasRef} className="block pointer-events-none" />
                    
                    {/* Interactive Overlay */}
                    <div 
                        className={`absolute inset-0 z-10 ${mode === "text" ? "cursor-text" : mode === "erase" ? "cursor-crosshair" : "cursor-default"}`}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        style={{ touchAction: 'none' }}
                    >
                        {/* Erasures */}
                        {(erasures[currentPage] || []).map((erasure, idx) => (
                            <div
                                key={`erase-${idx}`}
                                className="absolute bg-white" // Removed border to look like true whiteout
                                style={{
                                    left: erasure.x * scale,
                                    top: erasure.y * scale,
                                    width: erasure.width * scale,
                                    height: erasure.height * scale,
                                }}
                            />
                        ))}

                        {/* Active Erasure Box */}
                        {isDrawing && mode === "erase" && (
                            <div
                                className="absolute bg-white/60 border border-blue-300 pointer-events-none"
                                style={{
                                    left: Math.min(startPos.x, currentPos.x) * scale,
                                    top: Math.min(startPos.y, currentPos.y) * scale,
                                    width: Math.abs(currentPos.x - startPos.x) * scale,
                                    height: Math.abs(currentPos.y - startPos.y) * scale,
                                }}
                            />
                        )}

                        {/* Extracted PDF Text (The Illusion Layer) */}
                        {mode === "text" && (extractedTexts[currentPage] || []).map((ext) => (
                            <div
                                key={ext.id}
                                className="absolute cursor-text hover:bg-blue-100/40 hover:ring-1 ring-blue-400 rounded-sm transition-colors"
                                style={{
                                    left: ext.x * scale,
                                    top: ext.y * scale,
                                    width: ext.width * scale,
                                    height: ext.height * scale,
                                    // Pointer events must be auto to intercept clicks before the canvas does
                                    pointerEvents: 'auto',
                                }}
                                onPointerDown={(e) => handleExtractedTextClick(e, ext)}
                                title="Click to edit this text"
                            />
                        ))}

                        {/* Texts */}
                        {(texts[currentPage] || []).map((item) => (
                            <div
                                key={item.id}
                                className={`absolute pointer-events-auto group ${activeTextId === item.id ? 'z-20' : 'z-10'}`}
                                style={{
                                    left: item.x * scale,
                                    top: (item.y * scale) - (item.fontSize * scale), // Adjust visual position up slightly to match baseline
                                    minWidth: '10px',
                                    minHeight: `${item.fontSize * scale}px`,
                                    padding: '0px', 
                                    lineHeight: 1,
                                    whiteSpace: 'nowrap',
                                }}
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    setActiveTextId(item.id);
                                    setFloatingPos({ x: e.clientX, y: e.clientY - 80 });
                                }}
                            >
                                {activeTextId === item.id ? (
                                    <input
                                        autoFocus
                                        value={item.text}
                                        onChange={(e) => updateActiveText({ text: e.target.value }, false)}
                                        onBlur={(e) => updateActiveText({ text: e.target.value }, true)}
                                        className="bg-transparent border-none outline-none p-0 m-0"
                                        style={{
                                            width: `${Math.max(1, item.text.length) + 2}ch`,
                                            minWidth: '10px',
                                            fontSize: `${item.fontSize * scale}px`,
                                            color: item.color,
                                            fontWeight: item.isBold ? 'bold' : 'normal',
                                            fontStyle: item.isItalic ? 'italic' : 'normal',
                                            textAlign: item.alignment,
                                            fontFamily: item.fontFamily || 'Helvetica, Arial, sans-serif',
                                            lineHeight: 1,
                                        }}
                                        placeholder="Type..."
                                    />
                                ) : (
                                    <div style={{
                                        fontSize: `${item.fontSize * scale}px`,
                                        color: item.color,
                                        fontWeight: item.isBold ? 'bold' : 'normal',
                                        fontStyle: item.isItalic ? 'italic' : 'normal',
                                        textAlign: item.alignment,
                                        fontFamily: item.fontFamily || 'Helvetica, Arial, sans-serif',
                                        lineHeight: 1,
                                        whiteSpace: 'pre'
                                    }}>
                                        {item.text || ' '} 
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Formatting Toolbar (Absolute to viewport, near cursor) */}
                {activeTextId && activeTextObj && (
                    <div 
                        ref={floatingToolbarRef}
                        className="floating-toolbar fixed z-50 flex items-center bg-white rounded shadow-lg border border-blue-200 p-1 select-none transition-transform"
                        style={{ 
                            left: Math.max(10, floatingPos.x), 
                            top: Math.max(10, floatingPos.y),
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                    >
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-7 w-7 rounded-sm ${activeTextObj.isBold ? 'bg-blue-100 text-blue-700' : 'text-blue-500 hover:bg-gray-100'}`}
                            onClick={() => updateActiveText({ isBold: !activeTextObj.isBold }, true)}
                        >
                            <span className="font-serif font-bold italic">B</span>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-7 w-7 rounded-sm ${activeTextObj.isItalic ? 'bg-blue-100 text-blue-700' : 'text-blue-500 hover:bg-gray-100'}`}
                            onClick={() => updateActiveText({ isItalic: !activeTextObj.isItalic }, true)}
                        >
                            <span className="font-serif italic font-bold">I</span>
                        </Button>
                        
                        <div className="w-px h-5 bg-blue-100 mx-1"></div>
                        
                        <div className="flex items-center px-1 text-blue-600 gap-1">
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateActiveText({fontSize: Math.max(8, activeTextObj.fontSize - 2)}, true)}><ZoomOut className="w-3 h-3"/></Button>
                             <span className="text-xs font-mono">{activeTextObj.fontSize}</span>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateActiveText({fontSize: Math.min(72, activeTextObj.fontSize + 2)}, true)}><ZoomIn className="w-3 h-3"/></Button>
                        </div>
                        
                        <div className="w-px h-5 bg-blue-100 mx-1"></div>

                        {/* Alignment */}
                        {['left', 'center', 'right'].map((align) => (
                             <Button 
                                key={align}
                                variant="ghost" 
                                size="icon" 
                                 className={`h-7 w-7 rounded-sm ${activeTextObj.alignment === align ? 'bg-blue-100 text-blue-700' : 'text-blue-500 hover:bg-gray-100'}`}
                                 onClick={() => updateActiveText({ alignment: align as 'left'|'center'|'right' }, true)}
                              >
                                 {align === 'left' && <AlignLeft className="w-3 h-3"/>}
                                 {align === 'center' && <AlignCenter className="w-3 h-3"/>}
                                 {align === 'right' && <AlignRight className="w-3 h-3"/>}
                             </Button>
                        ))}
                        
                        <div className="w-px h-5 bg-blue-100 mx-1"></div>

                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:bg-gray-100" onClick={() => handleNotImplemented("Link")}>
                            <Link className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 cursor-move" title="Drag to move text (Coming soon)">
                            <Move className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:bg-gray-100" onClick={duplicateActiveText}>
                            <Copy className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={deleteActiveText}>
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar */}
            <div className="p-4 bg-white border-t flex justify-center sticky bottom-0 z-40 transform translate-y-0 transition-transform shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button 
                    size="lg" 
                    className="bg-[#0fbc92] hover:bg-[#0da480] text-white font-medium px-8 h-12 rounded opacity-100 flex items-center gap-2"
                    onClick={handleSave}
                    disabled={processing}
                >
                    {processing ? "Applying Changes..." : "Apply changes"}
                    {!processing && <span className="text-xl leading-none">›</span>}
                </Button>
            </div>
        </div>
    );
};

export default EditPdf;
