import { state, loadPdf, renderAllPages } from "./pdfViewer.js";
import { redactions, replaceRedactions, bindOverlay, setManualMode, applyAutomaticRedactions, undo, redo, clearRedactions, deleteSelected, copySelected, renderRedactions } from "./redactionManager.js";
import { ocrPagesWithoutText } from "./ocr.js";
import { findTextMatches } from "./textSearch.js";
import { exportRedactedPdf } from "./exportPdf.js";

const $ = selector => document.querySelector(selector);
let toastTimer;
function notify(message) { const toast = $("#toast"); toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2400); }
function terms() { return $("#searchInput").value.split(/\n|;/).map(value => value.trim()).filter(Boolean); }
function options() { return { caseSensitive: $("#caseOption").checked, whole: $("#wholeOption").checked, regex: $("#regexOption").checked, matchAccents: $("#accentOption").checked, matchAll: $("#allOption").checked }; }

async function openFile(file) {
  if (!file || (file.type && file.type !== "application/pdf") || !/\.pdf$/i.test(file.name)) { notify("Select a PDF file"); return; }
  try {
    $("#pageStatus").textContent = "Loading PDF";
    await loadPdf(file);
    replaceRedactions([], false);
    $("#pageInput").max = String(state.pdf.numPages);
    $("#matchStatus").textContent = "0 matches";
    await ocrPagesWithoutText(message => { $("#ocrStatus").textContent = message; });
    notify("PDF loaded");
  } catch (error) { console.error(error); $("#pageStatus").textContent = "Load failed"; notify(error.message || "Unable to load PDF"); }
}

$("#pdfInput").addEventListener("change", event => openFile(event.target.files[0]));
const dropZone = $("#dropZone");
["dragenter", "dragover"].forEach(type => dropZone.addEventListener(type, event => { event.preventDefault(); dropZone.classList.add("dragging"); }));
["dragleave", "drop"].forEach(type => dropZone.addEventListener(type, event => { event.preventDefault(); dropZone.classList.remove("dragging"); }));
dropZone.addEventListener("drop", event => openFile(event.dataTransfer.files[0]));
document.addEventListener("redactor:page-ready", event => bindOverlay(event.detail.pageNumber, event.detail.overlay));

$("#findButton").addEventListener("click", () => {
  if (!state.pdf) { notify("Upload a PDF first"); return; }
  const searchTerms = terms();
  if (!searchTerms.length) { notify("Enter text to find"); return; }
  const matches = findTextMatches(searchTerms, options());
  replaceRedactions(redactions.filter(item => item.source !== "auto").concat(matches));
  $("#matchStatus").textContent = `${matches.length} match${matches.length === 1 ? "" : "es"}`;
  const history = JSON.parse(localStorage.getItem("pdf-redactor-search-history") || "[]");
  localStorage.setItem("pdf-redactor-search-history", JSON.stringify([...new Set([...history, ...searchTerms])].slice(-20)));
  notify(`${matches.length} match${matches.length === 1 ? "" : "es"} found`);
});

$("#applyButton").addEventListener("click", () => { applyAutomaticRedactions(); notify("Matches applied"); });
$("#manualButton").addEventListener("click", event => { const enabled = event.currentTarget.getAttribute("aria-pressed") !== "true"; event.currentTarget.setAttribute("aria-pressed", String(enabled)); setManualMode(enabled); });
$("#undoButton").addEventListener("click", undo);
$("#redoButton").addEventListener("click", redo);
$("#clearButton").addEventListener("click", () => { clearRedactions(); $("#matchStatus").textContent = "0 matches"; notify("Redactions cleared"); });
$("#exportButton").addEventListener("click", async () => { if (!state.pdf) { notify("Upload a PDF first"); return; } try { await exportRedactedPdf(message => { $("#exportStatus").textContent = message; }); notify("Redacted PDF downloaded"); } catch (error) { console.error(error); notify(error.message || "Export failed"); } });

async function changeZoom(delta) { if (!state.pdf) return; state.scale = Math.max(0.5, Math.min(2.5, state.scale + delta)); await renderAllPages(); renderRedactions(); }
$("#zoomInButton").addEventListener("click", () => changeZoom(0.15));
$("#zoomOutButton").addEventListener("click", () => changeZoom(-0.15));
$("#goButton").addEventListener("click", () => document.querySelector(`.pdf-page[data-page="${$("#pageInput").value}"]`)?.scrollIntoView({ behavior: "smooth" }));
$("#themeButton").addEventListener("click", () => { document.body.classList.toggle("dark"); localStorage.setItem("pdf-redactor-theme", document.body.classList.contains("dark") ? "dark" : "light"); });

if (localStorage.getItem("pdf-redactor-theme") === "dark") document.body.classList.add("dark");
document.addEventListener("keydown", event => {
  const modifier = event.ctrlKey || event.metaKey;
  if (modifier && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); }
  if (modifier && event.key.toLowerCase() === "d") { event.preventDefault(); copySelected(); }
  if (event.key === "Delete") deleteSelected();
  if (event.key === "Escape") { $("#manualButton").setAttribute("aria-pressed", "false"); setManualMode(false); }
});
