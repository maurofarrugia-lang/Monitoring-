# IPA Redaction Tool V2.1

GitHub-ready browser application for IPA-specific document examination and PDF redaction.

## Quick start

Serve the repository through HTTP:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

Full operating, testing and security notes are in [`docs/README.md`](docs/README.md).

## Repository structure

```text
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── docReader.js
│   ├── geometry.js
│   ├── ocr.js
│   └── pdfViewer.js
├── patterns/
│   └── index.js
├── assets/
│   ├── icons/
│   └── images/
├── docs/
│   ├── README.md
│   ├── CHANGELOG.md
│   └── TESTING.md
└── .github/workflows/validate.yml
```
