import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "fs";

async function run() {
    try {
        const testPdf = fs.readFileSync('./test.pdf');
        // Let's assume test.pdf is encrypted with password '123'
        // First we need to generate an encrypted PDF to test.
        const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
        const encryptedBytes = await encryptPDF(new Uint8Array(testPdf), '123');
        
        fs.writeFileSync('./encrypted_test.pdf', encryptedBytes);

        const loadingTask = pdfjsLib.getDocument({
            data: encryptedBytes,
            password: '123',
            standardFontDataUrl: "node_modules/pdfjs-dist/standard_fonts/"
        });
        const pdf = await loadingTask.promise;
        console.log("PDF loaded with pdfjs!");
        
        // try to get data
        let savedBytes;
        if (typeof pdf.saveDocument === 'function') {
            savedBytes = await pdf.saveDocument();
            console.log("Used saveDocument()");
        } else {
            savedBytes = await pdf.getData();
            console.log("Used getData()");
        }
        
        fs.writeFileSync('./decrypted_test.pdf', savedBytes);
        console.log("Saved decrypted_test.pdf");

        // Now test if it's still encrypted
        const { PDFDocument } = await import("pdf-lib");
        try {
            await PDFDocument.load(savedBytes, { ignoreEncryption: false });
            console.log("Success! The exported PDF from pdfjs is NO LONGER encrypted!");
        } catch (e) {
            console.log("Failure! The exported PDF is STILL encrypted or corrupted:", e.message);
        }
        
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
