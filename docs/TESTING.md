# Testing

## Local validation

Run these commands from the repository root:

```bash
node --check js/app.js
node --check js/docReader.js
node --check js/geometry.js
node --check js/ocr.js
node --check js/pdfViewer.js
node --check patterns/index.js
python -m http.server 8080
```

## Functional checks

1. Upload a text-based PDF and confirm findings and visual boxes appear.
2. Upload a scanned PDF with **OCR every PDF page** enabled.
3. Confirm RefCom, Police ID, name, date of birth and signature-label areas are suggested.
4. Draw a manual redaction box and confirm it remains selected.
5. Toggle a suggested box by clicking it.
6. Download and inspect the findings CSV.
7. Download the redacted PDF and confirm the covered content is neither visible nor selectable.
8. Review every exported page before disclosure.
