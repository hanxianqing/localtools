
// Image Compressor — canvas resize + quality, all local.
const input = document.getElementById('img-input');
const qRange = document.getElementById('quality');
const qVal = document.getElementById('quality-val');
const maxDim = document.getElementById('max-dim');
const fmtSel = document.getElementById('out-fmt');
const listEl = document.getElementById('img-list');
const statusEl = document.getElementById('img-status');
let results = []; // {name, blob, url, orig, size, w, h}
qRange.addEventListener('input', () => { qVal.textContent = qRange.value + '%'; });
input.addEventListener('change', async () => {
  for (const f of input.files) {
    if (!/^image\//.test(f.type)) { statusEl.textContent = f.name + ' is not an image — skipped.'; continue; }
    try {
      const bmp = await createImageBitmap(f);
      const max = parseInt(maxDim.value, 10) || 0;
      let w = bmp.width, h = bmp.height;
      if (max > 0 && Math.max(w, h) > max) {
        const s = max / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s);
      }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bmp, 0, 0, w, h);
      const fmt = fmtSel.value;
      const mime = fmt === 'png' ? 'image/png' : (fmt === 'webp' ? 'image/webp' : 'image/jpeg');
      const q = fmt === 'png' ? undefined : qRange.value / 100;
      const blob = await new Promise(res => canvas.toBlob(res, mime, q));
      const url = URL.createObjectURL(blob);
      results.push({ name: f.name.replace(/\.[^.]+$/, '') + '-compressed.' + fmt, blob, url, orig: f.size, size: blob.size, w, h });
      bmp.close();
    } catch (e) { statusEl.textContent = 'Could not process ' + f.name + '.'; }
  }
  input.value = '';
  renderResults();
});
function renderResults() {
  listEl.innerHTML = '';
  results.forEach(r => {
    const pct = Math.round((1 - r.size / r.orig) * 100);
    const li = document.createElement('li');
    li.innerHTML = '<span class="fname">' + escapeHtml(r.name) + ' (' + r.w + '×' + r.h + ')</span>' +
      '<span>' + (r.orig / 1024).toFixed(0) + ' KB → <b>' + (r.size / 1024).toFixed(0) + ' KB</b> ' +
      (pct >= 0 ? '(−' + pct + '%)' : '(+' + Math.abs(pct) + '%)') + '</span>' +
      '<a class="btn small" href="' + r.url + '" download="' + escapeHtml(r.name) + '">Download</a>';
    listEl.appendChild(li);
  });
  statusEl.textContent = results.length ? results.length + ' image(s) compressed.' : '';
}
document.getElementById('dl-all').addEventListener('click', () => {
  results.forEach((r, i) => setTimeout(() => {
    const a = document.createElement('a'); a.href = r.url; a.download = r.name; a.click();
  }, i * 400));
});
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
