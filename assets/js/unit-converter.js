
// Unit Converter — pure arithmetic, all local.
const UNITS = {
  length: { base: 'm', units: { mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344 } },
  weight: { base: 'kg', units: { mg: 0.000001, g: 0.001, kg: 1, oz: 0.028349523125, lb: 0.45359237, t: 1000 } },
  volume: { base: 'L', units: { mL: 0.001, L: 1, tsp: 0.00492892159375, tbsp: 0.01478676478125, cup: 0.2365882365, pt: 0.473176473, qt: 0.946352946, gal: 3.785411784 } },
  area: { base: 'm²', units: { 'cm²': 0.0001, 'm²': 1, ha: 10000, 'km²': 1000000, 'in²': 0.00064516, 'ft²': 0.09290304, acre: 4046.8564224 } },
  speed: { base: 'm/s', units: { 'm/s': 1, 'km/h': 0.2777777778, mph: 0.44704, kn: 0.5144444444 } },
  data: { base: 'B', units: { B: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 } },
};
const TEMP = { C: 'C', F: 'F', K: 'K' };
const catSel = document.getElementById('uc-cat');
const fromSel = document.getElementById('uc-from');
const toSel = document.getElementById('uc-to');
const valInput = document.getElementById('uc-value');
const outEl = document.getElementById('uc-out');
function fillUnits() {
  const cat = catSel.value;
  const names = cat === 'temperature' ? Object.keys(TEMP) : Object.keys(UNITS[cat].units);
  fromSel.innerHTML = ''; toSel.innerHTML = '';
  names.forEach(n => {
    fromSel.add(new Option(n, n));
    toSel.add(new Option(n, n));
  });
  if (cat === 'temperature') { fromSel.value = 'C'; toSel.value = 'F'; }
  else { toSel.selectedIndex = Math.min(1, names.length - 1); }
}
function toC(v, u) { return u === 'C' ? v : u === 'F' ? (v - 32) * 5 / 9 : v - 273.15; }
function fromC(v, u) { return u === 'C' ? v : u === 'F' ? v * 9 / 5 + 32 : v + 273.15; }
function convert() {
  const v = parseFloat(valInput.value);
  const cat = catSel.value, from = fromSel.value, to = toSel.value;
  if (isNaN(v)) { outEl.textContent = 'Enter a number.'; return; }
  let result;
  if (cat === 'temperature') {
    result = fromC(toC(v, from), to);
  } else {
    const u = UNITS[cat].units;
    result = v * u[from] / u[to];
  }
  const shown = Math.abs(result) >= 1e9 || (Math.abs(result) < 1e-4 && result !== 0)
    ? result.toExponential(6) : (+result.toPrecision(10)).toString();
  outEl.innerHTML = '<strong>' + v + ' ' + from + ' = ' + shown + ' ' + to + '</strong>';
}
document.getElementById('uc-swap').addEventListener('click', () => {
  const f = fromSel.value; fromSel.value = toSel.value; toSel.value = f; convert();
});
[catSel, fromSel, toSel, valInput].forEach(el => el.addEventListener('input', convert));
catSel.addEventListener('change', () => { fillUnits(); convert(); });
fillUnits();
convert();
