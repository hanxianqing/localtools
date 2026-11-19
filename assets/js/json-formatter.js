
// JSON Formatter / Validator — JSON.parse, all local.
const input = document.getElementById('json-input');
const output = document.getElementById('json-output');
const statusEl = document.getElementById('json-status');
function parseOrShowError() {
  const text = input.value.trim();
  if (!text) { statusEl.textContent = ''; output.textContent = ''; return null; }
  try {
    const obj = JSON.parse(text);
    return obj;
  } catch (e) {
    output.textContent = '';
    statusEl.innerHTML = '<strong>Invalid JSON:</strong> ' + escapeHtml(e.message) + '. Tip: check for trailing commas, single quotes, or unquoted keys.';
    return null;
  }
}
document.getElementById('json-format').addEventListener('click', () => {
  const obj = parseOrShowError();
  if (obj === null) return;
  output.textContent = JSON.stringify(obj, null, 2);
  statusEl.textContent = 'Valid JSON — pretty-printed with 2-space indent.';
});
document.getElementById('json-minify').addEventListener('click', () => {
  const obj = parseOrShowError();
  if (obj === null) return;
  output.textContent = JSON.stringify(obj);
  statusEl.textContent = 'Valid JSON — minified to one line.';
});
document.getElementById('json-sample').addEventListener('click', () => {
  input.value = '{\n  "name": "LocalTools",\n  "free": true,\n  "tools": ["pdf", "images", "qr"],\n  "limits": null\n}';
  document.getElementById('json-format').click();
});
document.getElementById('json-copy').addEventListener('click', async () => {
  if (!output.textContent) return;
  try { await navigator.clipboard.writeText(output.textContent); statusEl.textContent = 'Copied to clipboard.'; }
  catch (e) { statusEl.textContent = 'Copy failed — select the output and copy it manually.'; }
});
document.getElementById('json-clear').addEventListener('click', () => { input.value = ''; output.textContent = ''; statusEl.textContent = ''; });
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
