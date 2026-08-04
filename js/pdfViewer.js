import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

export const state = {
  pdf: null,
  bytes: null,
  fileName: "document.pdf",
  scale: 1,
  pages: new Map(),
  textItems: new Map(),
  ocrWords: new Map()
};

export async function loadPdf(file) {
  state.bytes = new Uint8Array(await file.arrayBuffer());
  state.fileName = file.name || "document.pdf";
  state.pdf = await pdfjsLib.getDocument({ data: state.bytes.slice() }).promise;
  await renderAllPages();
}

export async function renderAllPages() {
  if (!state.pdf) return;
  const viewer = document.querySelector("#viewer");
  viewer.innerHTML = "";
  state.pages.clear();
  state.textItems.clear();

  for (let pageNumber = 1; pageNumber <= state.pdf.numPages; pageNumber += 1) {
    const page = await state.pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: state.scale });
    const wrapper = document.createElement("article");
    wrapper.className = "pdf-page";
    wrapper.dataset.page = String(pageNumber);
    wrapper.setAttribute("aria-label", `PDF page ${pageNumber}`);

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.dataset.page = String(pageNumber);

    wrapper.append(canvas, overlay);
    viewer.append(wrapper);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    const textContent = await page.getTextContent();
    state.pages.set(pageNumber, { page, viewport, wrapper, canvas, overlay });
    state.textItems.set(pageNumber, textContent.items || []);
    document.dispatchEvent(new CustomEvent("redactor:page-ready", { detail: { pageNumber, overlay } }));
  }

  document.querySelector("#emptyState").hidden = true;
  document.querySelector("#zoomOutput").textContent = `${Math.round(state.scale * 100)}%`;
  document.querySelector("#pageStatus").textContent = `${state.pdf.numPages} page${state.pdf.numPages === 1 ? "" : "s"}`;
}
