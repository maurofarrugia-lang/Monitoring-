# IPA Redaction Tool V2

## Purpose
V2 scans PDF, DOCX and TXT files for personal identifiers. For PDFs, it presents suggested redaction boxes, allows manual boxes and exports a flattened redacted PDF.

## IPA-specific rules
- RefCom and Police ID numbers, including numeric-only values
- Surname, name and date-of-birth fields beneath or beside IPA labels
- Address and contact-number regions
- Passport/document serial and visa numbers
- Signature regions near standard signature labels
- Generic e-mail, telephone, identifier and name matching

## Run locally
The application uses browser modules and must be served over HTTP:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Workflow
1. Choose one document.
2. Keep **IPA form mode** enabled for IPA application forms.
3. Enable **OCR every PDF page** for scanned or poor-quality PDFs.
4. Select **Scan**.
5. Review every page. Red boxes are selected; blue boxes are excluded.
6. Click a suggested box to toggle it. Drag on the preview to add a manual box.
7. Download the findings CSV for an audit trail.
8. Download the flattened redacted PDF.

## Security and accuracy
- The exported redacted PDF is rebuilt from rasterised page images. Covered source text is not retained as selectable PDF text.
- OCR and automated field detection can miss handwriting, faint scans, stamps, overlapping text and unusual layouts.
- The user must visually review every page before release.
- JavaScript libraries are loaded from public CDNs. For an offline deployment, download and host approved versions internally and update the script/import paths.
- Keep the original document in the controlled case-management environment and save the redacted copy as a separate file.

## Legacy DOC
Binary `.doc` files are not supported directly. Save them as `.docx` in Word before scanning.
