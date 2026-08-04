export async function extractDocxText(file) {
  if (!window.mammoth) throw new Error('Mammoth DOCX library did not load. Check your internet connection.');
  const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value || '';
}

export async function extractSimpleFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'docx') return extractDocxText(file);
  if (extension === 'txt') return file.text();
  if (extension === 'doc') throw new Error('Legacy .doc files must first be saved as .docx.');
  throw new Error(`Unsupported file type: .${extension}`);
}
