
// PDF Merge — pdf-lib runs entirely in the browser.
const { PDFDocument } = PDFLib;
let pdfFiles = []; // {name, bytes, pages}
const input = document.getElementById('pdf-input');
const listEl = document.getElementById('pdf-list');
const mergeBtn = document.getElementById('merge-btn');
const outEl = document.getElementById('pdf-out');
const statusEl = document.getElementById('pdf-status');

input.addEventListener('change', async () => {
  for (const f of input.files) {
    if (!/\.pdf$/i.test(f.name)) { statusEl.textContent = f.name + ' is not a PDF — skipped.'; continue; }
    const bytes = new Uint8Array(await f.arrayBuffer());
    try {
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      pdfFiles.push({ name: f.name, bytes, pages: doc.getPageCount() });
    } catch (e) { statusEl.textContent = 'Could not read ' + f.name + ' (damaged or encrypted PDF).'; }
  }
  input.value = '';
  renderList();
});
function renderList() {
  listEl.innerHTML = '';
  pdfFiles.forEach((f, i) => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="fname">' + (i + 1) + '. ' + escapeHtml(f.name) + '</span>' +
      '<span class="muted">' + f.pages + ' page' + (f.pages === 1 ? '' : 's') + '</span>' +
      '<button type="button" data-act="up" data-i="' + i + '" ' + (i === 0 ? 'disabled' : '') + '>↑</button>' +
      '<button type="button" data-act="down" data-i="' + i + '" ' + (i === pdfFiles.length - 1 ? 'disabled' : '') + '>↓</button>' +
      '<button type="button" data-act="del" data-i="' + i + '">Remove</button>';
    listEl.appendChild(li);
  });
  mergeBtn.disabled = pdfFiles.length < 1;
  statusEl.textContent = pdfFiles.length ? pdfFiles.length + ' file(s) ready — ' +
    pdfFiles.reduce((a, f) => a + f.pages, 0) + ' pages total.' : '';
}
listEl.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  const i = +b.dataset.i, act = b.dataset.act;
  if (act === 'up' && i > 0) { [pdfFiles[i - 1], pdfFiles[i]] = [pdfFiles[i], pdfFiles[i - 1]]; }
  if (act === 'down' && i < pdfFiles.length - 1) { [pdfFiles[i + 1], pdfFiles[i]] = [pdfFiles[i], pdfFiles[i + 1]]; }
  if (act === 'del') { pdfFiles.splice(i, 1); }
  renderList();
});
mergeBtn.addEventListener('click', async () => {
  mergeBtn.disabled = true;
  statusEl.textContent = 'Merging…';
  try {
    const out = await PDFDocument.create();
    for (const f of pdfFiles) {
      const src = await PDFDocument.load(f.bytes, { ignoreEncryption: true });
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach(p => out.addPage(p));
    }
    const bytes = await out.save();
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    outEl.innerHTML = '<p><strong>Done!</strong> Merged PDF: ' + out.getPageCount() + ' pages, ' +
      (blob.size / 1024).toFixed(0) + ' KB.</p>' +
      '<p><a class="btn" id="dl-merged" href="' + url + '" download="merged.pdf">Download merged.pdf</a></p>';
    statusEl.textContent = '';
  } catch (e) { statusEl.textContent = 'Merge failed: ' + e.message; }
  mergeBtn.disabled = false;
});
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
