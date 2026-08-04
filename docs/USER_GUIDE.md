# IPA Redaction Tool V2.3: User Instructions

## 1. Start the application
Do not open `index.html` by double-clicking it. Serve the folder through HTTP:

```bash
python -m http.server 8080
```

Open `http://localhost:8080` in a supported browser.

## 2. Upload and scan
1. Select **Choose document**, or drag a PDF, DOCX or TXT file into the upload area.
2. For scanned PDFs, select **OCR every PDF page**.
3. Keep **Detect names** selected unless only identifier numbers are required.
4. Select **Scan**.

## 3. Review continuously
- Scroll down in the viewer to move naturally from one PDF page to the next.
- The page indicator at the top shows the page currently in view.
- Red boxes are selected redactions. Blue boxes are detected but not selected.
- Select a finding in the left panel to jump directly to its page.
- Use **Next finding** and **Previous finding**, or the `N` and `P` keys.
- Use each checkbox to include or exclude a finding.

## 4. DOCX review
DOCX content is displayed as a continuous browser preview. Selected values appear blacked out. Formatting may differ slightly from Microsoft Word, so compare the preview with the source document.

## 5. Export
1. Complete the review of every page.
2. Download the findings CSV if an audit record is required.
3. Select **Download redacted PDF**.
4. Open the exported PDF separately.
5. Confirm every page is present, non-blank and correctly redacted.
6. Confirm covered text cannot be selected or copied.

## 6. Mandatory final checks
Check names in narrative text, RefCom and Police ID numbers, dates of birth, addresses, contact details, document numbers, signatures, handwriting, stamps, annotations and embedded images.

## 7. Limitations
The application assists review but does not authorise disclosure. OCR can miss faint, skewed or handwritten content. DOCX preview is produced by browser conversion and may not reproduce Word pagination exactly. The supplied build loads pinned libraries from public CDNs; an organisational deployment should host approved copies internally.
