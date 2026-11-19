
// QR Code Generator — qrcode-generator (vendored) draws to canvas, all local.
const textEl = document.getElementById('qr-text');
const sizeEl = document.getElementById('qr-size');
const ecEl = document.getElementById('qr-ec');
const canvas = document.getElementById('qr-canvas');
const dlBtn = document.getElementById('qr-dl');
const statusEl = document.getElementById('qr-status');
function draw() {
  const text = textEl.value.trim();
  if (!text) { statusEl.textContent = 'Type a link or text above to make a QR code.'; dlBtn.style.display = 'none'; return; }
  try {
    const qr = qrcode(0, ecEl.value);
    qr.addData(text);
    qr.make();
    const modules = qr.getModuleCount();
    const size = parseInt(sizeEl.value, 10);
    const scale = Math.max(1, Math.floor(size / modules));
    const px = modules * scale;
    canvas.width = px; canvas.height = px;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = '#000';
    for (let r = 0; r < modules; r++)
      for (let c = 0; c < modules; c++)
        if (qr.isDark(r, c)) ctx.fillRect(c * scale, r * scale, scale, scale);
    dlBtn.style.display = 'inline-block';
    dlBtn.href = canvas.toDataURL('image/png');
    statusEl.textContent = modules + '×' + modules + ' modules — scan it with any phone camera.';
  } catch (e) { statusEl.textContent = 'That text is too long for a QR code at this error level — shorten it or lower the error correction.'; dlBtn.style.display = 'none'; }
}
[textEl, sizeEl, ecEl].forEach(el => el.addEventListener('input', draw));
textEl.value = 'https://example.com';
draw();
