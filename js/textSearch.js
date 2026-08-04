import { state } from "./pdfViewer.js";

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const fold = (value, matchAccents) => matchAccents ? value : value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function makeRegex(term, options) {
  const source = options.regex ? term : escapeRegex(term);
  const expression = options.whole ? `\\b(?:${source})\\b` : source;
  return new RegExp(expression, options.caseSensitive ? "g" : "gi");
}

function matchingRanges(text, terms, options) {
  const ranges = [];
  const searchable = fold(text, options.matchAccents);
  for (const rawTerm of terms) {
    const term = fold(rawTerm, options.matchAccents);
    let regex;
    try { regex = makeRegex(term, options); } catch { continue; }
    let match;
    while ((match = regex.exec(searchable))) {
      ranges.push({ index: match.index, length: Math.max(1, match[0].length) });
      if (!options.matchAll) return ranges;
      if (!match[0].length) regex.lastIndex += 1;
    }
  }
  return ranges;
}

export function findTextMatches(terms, options) {
  const results = [];
  let stop = false;
  for (const [pageNumber, items] of state.textItems) {
    const pageData = state.pages.get(pageNumber);
    for (const item of items) {
      const text = item.str || "";
      for (const range of matchingRanges(text, terms, options)) {
        const transform = globalThis.pdfjsLib?.Util?.transform;
        let left, top, width, height;
        if (transform) {
          const tx = transform(pageData.viewport.transform, item.transform);
          const itemWidth = item.width * state.scale;
          height = Math.max(4, Math.abs(tx[3])) / pageData.viewport.height;
          left = (tx[4] + itemWidth * (range.index / Math.max(1, text.length))) / pageData.viewport.width;
          width = Math.max(5, itemWidth * (range.length / Math.max(1, text.length))) / pageData.viewport.width;
          top = (pageData.viewport.height - tx[5] - Math.abs(tx[3])) / pageData.viewport.height;
        } else {
          const tx = item.transform;
          const baseWidth = item.width;
          const pageHeight = pageData.page.view[3] - pageData.page.view[1];
          const pageWidth = pageData.page.view[2] - pageData.page.view[0];
          left = (tx[4] + baseWidth * range.index / Math.max(1, text.length)) / pageWidth;
          width = Math.max(2, baseWidth * range.length / Math.max(1, text.length)) / pageWidth;
          height = Math.max(3, Math.abs(tx[3])) / pageHeight;
          top = 1 - (tx[5] + Math.abs(tx[3])) / pageHeight;
        }
        results.push({ id: crypto.randomUUID(), page: pageNumber, x: Math.max(0,left), y: Math.max(0,top), width: Math.min(1-left,width), height: Math.min(1-top,height), source: "auto", applied: false });
        if (!options.matchAll) { stop = true; break; }
      }
      if (stop) break;
    }
    if (stop) break;
  }

  if (!stop) {
    for (const [pageNumber, words] of state.ocrWords) {
      for (const word of words) {
        if (matchingRanges(word.text, terms, options).length) {
          results.push({ id: crypto.randomUUID(), page: pageNumber, x: word.x, y: word.y, width: word.width, height: word.height, source: "auto", applied: false });
          if (!options.matchAll) return results;
        }
      }
    }
  }
  return results;
}
