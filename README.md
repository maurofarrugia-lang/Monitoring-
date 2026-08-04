# IPA Redaction Tool V2.2
V2.2 adds DOCX preview and DOCX-to-redacted-PDF export. PDF export re-renders every source page during download to avoid blank cached canvases.

Run with `python -m http.server 8080`, then open `http://localhost:8080`.

Review every output page before disclosure. Libraries are loaded from pinned public CDNs; an IPA production deployment should host approved copies internally.
