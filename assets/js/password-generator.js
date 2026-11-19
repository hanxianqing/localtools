
// Password Generator — crypto.getRandomValues, all local.
const lenRange = document.getElementById('pw-len');
const lenVal = document.getElementById('pw-len-val');
const outEl = document.getElementById('pw-out');
const meterEl = document.getElementById('pw-meter');
const meterTxt = document.getElementById('pw-strength');
const copyBtn = document.getElementById('pw-copy');
function charset() {
  let s = '';
  if (document.getElementById('pw-lower').checked) s += 'abcdefghijklmnopqrstuvwxyz';
  if (document.getElementById('pw-upper').checked) s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (document.getElementById('pw-digits').checked) s += '0123456789';
  if (document.getElementById('pw-symbols').checked) s += '!@#$%^&*()-_=+[]{};:,.<>?';
  if (document.getElementById('pw-noamb').checked) s = s.replace(/[Il1O0]/g, '');
  return s;
}
function generate() {
  const chars = charset();
  const n = parseInt(lenRange.value, 10);
  lenVal.textContent = n;
  if (!chars) { outEl.textContent = 'Pick at least one character set.'; meterEl.style.width = '0%'; meterTxt.textContent = ''; return; }
  const rnd = new Uint32Array(n);
  crypto.getRandomValues(rnd);
  let pw = '';
  for (let i = 0; i < n; i++) pw += chars[rnd[i] % chars.length];
  outEl.textContent = pw;
  // strength = bits of entropy
  const bits = Math.round(n * Math.log2(chars.length));
  const pct = Math.min(100, Math.round(bits / 128 * 100));
  meterEl.style.width = pct + '%';
  meterEl.className = bits >= 80 ? 'good' : (bits >= 50 ? 'ok' : '');
  meterTxt.textContent = bits + ' bits of entropy — ' + (bits >= 80 ? 'very strong' : bits >= 50 ? 'strong' : bits >= 30 ? 'okay' : 'weak, make it longer');
}
document.getElementById('pw-gen').addEventListener('click', generate);
['pw-lower', 'pw-upper', 'pw-digits', 'pw-symbols', 'pw-noamb'].forEach(id =>
  document.getElementById(id).addEventListener('change', generate));
lenRange.addEventListener('input', generate);
copyBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(outEl.textContent); copyBtn.textContent = 'Copied!'; setTimeout(() => copyBtn.textContent = 'Copy password', 1500); }
  catch (e) { copyBtn.textContent = 'Select the text and copy it manually'; }
});
generate();
