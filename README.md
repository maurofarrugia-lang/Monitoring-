# PDF Redactor OCR v3

A browser-based PDF redaction prototype for GitHub Pages.

## New in v3

- Built-in anonymisation regex preset for Passport No/Number, ID Number, Police Number, RefCom, Application Number, Case Number, Residence Permit, Date of Birth/D.O.B., Address, Mobile, Telephone, Email, Fingerprint, Photo, Guardian and Lawyer.
- OCR renders pages at 2x, 3x or 4x resolution.
- OCR performs two recognition passes: original high-resolution render and enhanced greyscale/contrast render; the higher-confidence result is retained.
- Low-confidence OCR noise is filtered.
- OCR coordinates are normalised for accurate redaction placement.
- OCR all-pages option, useful for poor hybrid PDFs.
- OCR word sequences are searched, so labels and values split across OCR words can match one pattern.

## Run

Serve the folder, do not open it with `file://`:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## GitHub Pages

Upload the folder contents to a repository, then use **Settings > Pages > Deploy from a branch**, selecting the main branch and root folder.

## Pattern use

Select **Load anonymisation patterns**, review the expressions, run OCR if appropriate, then select **Find matches**. Orange boxes are previews. Inspect every page, remove false positives, add missed areas manually, then apply and export.

The preset deliberately expects a field label followed by a value to reduce false positives. It should be treated as an assisted-review tool, not an automatic legal guarantee of anonymisation.

## Security

Export rasterises every page and burns applied black boxes into a new image-only PDF. Verify the exported document before disclosure. No telemetry or analytics are included. The lightweight edition downloads PDF.js, pdf-lib and Tesseract.js from jsDelivr. For a strict offline deployment, host approved copies of those libraries within the repository and change the script/import paths.

## OCR notes

Maximum OCR is slower and uses more browser memory. Additional Tesseract language data must be available for the selected language. Handwriting, damaged scans, unusual fonts and low-resolution images can still be missed.

## Licence

MIT.
