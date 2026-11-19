
// Image Converter — canvas re-encode, all local.
const input = document.getElementById('conv-input');
const fmtSel = document.getElementById('conv-fmt');
const qRange = document.getElementById('conv-q');
const qVal = document.getElementById('conv-q-val');
const listEl = document.getElementById('conv-list');
const statusEl = document.getElementById('conv-status');
let results = [];
qRange.addEventListener('input', () => { qVal.textContent = qRange.value + '%'; });
fmtSel.addEventListener('change', () => {
  document.getElementById('q-row').style.display = fmtSel.value === 'png' ? 'none' : 'block';
});
input.addEventListener('change', async () => {
  for (const f of input.files) {
    if (!/^image\//.test(f.type)) { statusEl.textContent = f.name + ' is not an image — skipped.'; continue; }
    try {
      const bmp = await createImageBitmap(f);
      const canvas = document.createElement('canvas');
      canvas.width = bmp.width; canvas.height = bmp.height;
      const ctx = canvas.getContext('2d');
      // JPG has no transparency: paint white behind.
      if (fmtSel.value === 'jpg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(bmp, 0, 0);
      const mime = fmtSel.value === 'png' ? 'image/png' : (fmtSel.value === 'webp' ? 'image/webp' : 'image/jpeg');
      const q = fmtSel.value === 'png' ? undefined : qRange.value / 100;
      const blob = await new Promise(res => canvas.toBlob(res, mime, q));
      const url = URL.createObjectURL(blob);
      const ext = fmtSel.value === 'jpg' ? 'jpg' : fmtSel.value;
      results.push({ name: f.name.replace(/\.[^.]+$/, '') + '.' + ext, blob, url, orig: f.size, size: blob.size });
      bmp.close();
    } catch (e) { statusEl.textContent = 'Could not convert ' + f.name + '.'; }
  }
  input.value = '';
  renderResults();
});
function renderResults() {
  listEl.innerHTML = '';
  results.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="fname">' + escapeHtml(r.name) + '</span>' +
      '<span>' + (r.orig / 1024).toFixed(0) + ' KB → <b>' + (r.size / 1024).toFixed(0) + ' KB</b></span>' +
      '<a class="btn small" href="' + r.url + '" download="' + escapeHtml(r.name) + '">Download</a>';
    listEl.appendChild(li);
  });
  statusEl.textContent = results.length ? results.length + ' image(s) converted.' : '';
}
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
