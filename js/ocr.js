import { state } from "./pdfViewer.js";

export async function ocrPagesWithoutText(onProgress) {
  const pages = [];
  for (const [pageNumber, items] of state.textItems) {
    if (!items.some(item => (item.str || "").trim())) pages.push(pageNumber);
  }
  if (!pages.length) { onProgress("OCR not required"); return; }
  if (!globalThis.Tesseract) throw new Error("Tesseract.js did not load.");

  for (let index = 0; index < pages.length; index += 1) {
    const pageNumber = pages[index];
    const canvas = state.pages.get(pageNumber).canvas;
    onProgress(`OCR page ${pageNumber}`);
    const result = await globalThis.Tesseract.recognize(canvas, "eng", {
      logger: message => {
        if (message.status === "recognizing text") onProgress(`OCR page ${pageNumber}: ${Math.round(message.progress * 100)}%`);
      }
    });
    const words = (result.data.words || []).map(word => ({
      text: word.text || "",
      x: word.bbox.x0 / canvas.width,
      y: word.bbox.y0 / canvas.height,
      width: (word.bbox.x1 - word.bbox.x0) / canvas.width,
      height: (word.bbox.y1 - word.bbox.y0) / canvas.height
    }));
    state.ocrWords.set(pageNumber, words);
  }
  onProgress("OCR ready");
}
