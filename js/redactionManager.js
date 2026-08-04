import { state } from "./pdfViewer.js";

export let redactions = [];
let history = [[]];
let historyIndex = 0;
let manualMode = false;
let selectedId = null;
const copy = value => JSON.parse(JSON.stringify(value));

function persist() {
  localStorage.setItem("pdf-redactor-redactions", JSON.stringify(redactions));
}

function commit() {
  history = history.slice(0, historyIndex + 1);
  history.push(copy(redactions));
  historyIndex += 1;
  persist();
  renderRedactions();
}

export function replaceRedactions(items, record = true) {
  redactions = copy(items);
  if (record) commit();
  else { history = [copy(redactions)]; historyIndex = 0; persist(); renderRedactions(); }
}

export function addRedaction(item) {
  redactions.push({ id: crypto.randomUUID(), applied: true, ...item });
  commit();
}

export function deleteRedaction(id) {
  redactions = redactions.filter(item => item.id !== id);
  if (selectedId === id) selectedId = null;
  commit();
}

export function clearRedactions() { redactions = []; selectedId = null; commit(); }
export function applyAutomaticRedactions() { redactions.forEach(item => { if (item.source === "auto") item.applied = true; }); commit(); }
export function setManualMode(enabled) { manualMode = enabled; document.querySelectorAll(".overlay").forEach(layer => layer.classList.toggle("manual-active", enabled)); }
export function undo() { if (historyIndex > 0) { historyIndex -= 1; redactions = copy(history[historyIndex]); persist(); renderRedactions(); } }
export function redo() { if (historyIndex < history.length - 1) { historyIndex += 1; redactions = copy(history[historyIndex]); persist(); renderRedactions(); } }
export function deleteSelected() { if (selectedId) deleteRedaction(selectedId); }
export function copySelected() { const item = redactions.find(entry => entry.id === selectedId); if (item) addRedaction({ ...item, id: undefined, x: Math.min(1 - item.width, item.x + 0.012), y: Math.min(1 - item.height, item.y + 0.012) }); }

function point(event, overlay) {
  const rect = overlay.getBoundingClientRect();
  return { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
}

export function bindOverlay(pageNumber, overlay) {
  let start = null;
  let draft = null;
  setManualMode(manualMode);

  overlay.addEventListener("pointerdown", event => {
    if (!manualMode || event.target !== overlay) return;
    start = point(event, overlay);
    draft = document.createElement("div");
    draft.className = "redaction";
    overlay.append(draft);
    overlay.setPointerCapture(event.pointerId);
  });

  overlay.addEventListener("pointermove", event => {
    if (!draft || !start) return;
    const end = point(event, overlay);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    Object.assign(draft.style, { left: `${x * 100}%`, top: `${y * 100}%`, width: `${width * 100}%`, height: `${height * 100}%` });
  });

  overlay.addEventListener("pointerup", event => {
    if (!draft || !start) return;
    const end = point(event, overlay);
    const item = { page: pageNumber, x: Math.min(start.x, end.x), y: Math.min(start.y, end.y), width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y), source: "manual", applied: true };
    draft.remove(); draft = null; start = null;
    if (item.width > 0.004 && item.height > 0.004) addRedaction(item);
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) { selectedId = null; renderRedactions(); }
  });
}

export function renderRedactions() {
  document.querySelectorAll(".overlay").forEach(layer => { layer.innerHTML = ""; layer.classList.toggle("manual-active", manualMode); });

  for (const item of redactions) {
    const pageData = state.pages.get(item.page);
    if (!pageData) continue;
    const box = document.createElement("div");
    box.className = `redaction${item.applied ? "" : " preview"}${item.id === selectedId ? " selected" : ""}`;
    box.dataset.id = item.id;
    Object.assign(box.style, { left: `${item.x * 100}%`, top: `${item.y * 100}%`, width: `${item.width * 100}%`, height: `${item.height * 100}%` });
    box.innerHTML = '<button class="delete-button" type="button" title="Delete">×</button><span class="resize-handle" title="Resize"></span>';

    box.addEventListener("click", event => { event.stopPropagation(); selectedId = item.id; renderRedactions(); });
    box.querySelector(".delete-button").addEventListener("click", event => { event.stopPropagation(); deleteRedaction(item.id); });

    let action = null;
    let start = null;
    let original = null;
    box.addEventListener("pointerdown", event => {
      if (event.target.classList.contains("delete-button")) return;
      event.stopPropagation();
      selectedId = item.id;
      action = event.target.classList.contains("resize-handle") ? "resize" : "move";
      start = point(event, pageData.overlay);
      original = copy(item);
      box.setPointerCapture(event.pointerId);
    });
    box.addEventListener("pointermove", event => {
      if (!action) return;
      const current = point(event, pageData.overlay);
      const dx = current.x - start.x;
      const dy = current.y - start.y;
      if (action === "move") {
        item.x = Math.max(0, Math.min(1 - item.width, original.x + dx));
        item.y = Math.max(0, Math.min(1 - item.height, original.y + dy));
      } else {
        item.width = Math.max(0.004, Math.min(1 - item.x, original.width + dx));
        item.height = Math.max(0.004, Math.min(1 - item.y, original.height + dy));
      }
      Object.assign(box.style, { left: `${item.x * 100}%`, top: `${item.y * 100}%`, width: `${item.width * 100}%`, height: `${item.height * 100}%` });
    });
    box.addEventListener("pointerup", () => { if (action) { action = null; commit(); } });
    pageData.overlay.append(box);
  }
}
