
// Homepage search + category filter — filters the tool grid as you type, all local.
const searchInput = document.getElementById('tool-search');
const chips = document.querySelectorAll('#cat-chips .chip');
const cards = document.querySelectorAll('#tool-grid .card');
const countEl = document.getElementById('tool-count');
const emptyEl = document.getElementById('no-results');
let activeCat = 'all';
function applyFilter() {
  const q = searchInput.value.trim().toLowerCase();
  let shown = 0;
  cards.forEach(c => {
    const matchCat = activeCat === 'all' || c.dataset.cat === activeCat;
    const hay = (c.dataset.name + ' ' + c.dataset.desc).toLowerCase();
    const matchQ = !q || hay.includes(q);
    const show = matchCat && matchQ;
    c.style.display = show ? '' : 'none';
    if (show) shown++;
  });
  countEl.textContent = 'Showing ' + shown + ' of ' + cards.length + ' tools';
  emptyEl.style.display = shown ? 'none' : 'block';
}
searchInput.addEventListener('input', applyFilter);
chips.forEach(ch => ch.addEventListener('click', () => {
  activeCat = ch.dataset.filter;
  chips.forEach(x => {
    const on = x === ch;
    x.classList.toggle('active', on);
    x.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  applyFilter();
}));
