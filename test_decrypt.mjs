import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function run() {
    try {
        const testPdf = fs.readFileSync('./test.pdf');
        const pdfDoc = await PDFDocument.load(testPdf, { ignoreEncryption: true });
        const bytes = await pdfDoc.save();
        fs.writeFileSync('./test_out.pdf', bytes);
        console.log("Success! Saved as test_out.pdf");
    } catch (e) {
        console.error("Error:", e);
    }
}

run();
