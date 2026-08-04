# Minimal PDF Redactor

A browser-based PDF redaction application for GitHub Pages. It supports automatic text matching, OCR for pages without a PDF text layer, manual redaction rectangles, undo/redo, zoom, page navigation and image-only PDF export.

## Start locally

Do not open `index.html` with a `file://` address. From the project folder run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser.

## GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of this folder, keeping the `css`, `js` and `assets` folders unchanged.
3. Open **Settings > Pages**.
4. Select **Deploy from a branch**.
5. Select the main branch and `/ (root)` folder.
6. Save and open the published GitHub Pages address.

## File names

Keep these paths exactly as supplied:

- `index.html`
- `css/styles.css`
- `js/app.js`
- `js/pdfViewer.js`
- `js/textSearch.js`
- `js/redactionManager.js`
- `js/ocr.js`
- `js/exportPdf.js`

Do not rename them to `app.js.1` or `styles.css.1`.

## Privacy and dependencies

The PDF itself is processed in the browser and this application contains no analytics or telemetry. The default lightweight build downloads PDF.js, pdf-lib and Tesseract.js from jsDelivr when the page opens. For a controlled offline deployment, download approved copies of these libraries into your own repository and replace the CDN paths with local relative paths.

OCR language is set to English (`eng`) in `js/ocr.js`.

## Redaction security

Export creates a new image-only PDF. Each original page is rendered to an image and applied black rectangles are painted into that image before the new PDF is generated. This avoids retaining the original selectable text layer in the exported document. Always inspect the exported PDF before disclosure.

## Search limitation

PDF.js commonly stores text in separate items. A phrase split across several PDF text items may not be detected as one phrase. Search the component words separately or add a manual rectangle.

## Keyboard shortcuts

- Ctrl/Cmd+Z: Undo
- Ctrl/Cmd+Shift+Z: Redo
- Ctrl/Cmd+D: Copy selected redaction
- Delete: Delete selected redaction
- Escape: Exit manual mode

## Licence

MIT. Third-party libraries remain subject to their own licences.
