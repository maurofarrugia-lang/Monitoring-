import { state } from "./pdfViewer.js";
import { redactions } from "./redactionManager.js";

export async function exportRedactedPdf(onStatus) {
  if (!globalThis.PDFLib) throw new Error("pdf-lib did not load.");
  onStatus("Preparing export");
  const output = await globalThis.PDFLib.PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= state.pdf.numPages; pageNumber += 1) {
    onStatus(`Exporting page ${pageNumber}/${state.pdf.numPages}`);
    const sourcePage = await state.pdf.getPage(pageNumber);
    const viewport = sourcePage.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const context = canvas.getContext("2d", { alpha: false });
    await sourcePage.render({ canvasContext: context, viewport }).promise;
    context.fillStyle = "#000";
    redactions.filter(item => item.page === pageNumber && item.applied).forEach(item => {
      context.fillRect(item.x * canvas.width, item.y * canvas.height, item.width * canvas.width, item.height * canvas.height);
    });
    const imageBytes = await fetch(canvas.toDataURL("image/jpeg", 0.98)).then(response => response.arrayBuffer());
    const image = await output.embedJpg(imageBytes);
    const page = output.addPage([viewport.width / 2, viewport.height / 2]);
    page.drawImage(image, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
  }

  const bytes = await output.save();
  const blobUrl = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = state.fileName.replace(/\.pdf$/i, "") + "_redacted.pdf";
  link.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  onStatus("Export complete");
}
