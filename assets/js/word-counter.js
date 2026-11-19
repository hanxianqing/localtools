
// Word Counter — live counts, all local.
const ta = document.getElementById('wc-text');
const out = {
  words: document.getElementById('wc-words'),
  chars: document.getElementById('wc-chars'),
  charsNoSpace: document.getElementById('wc-chars-nospace'),
  sentences: document.getElementById('wc-sentences'),
  paragraphs: document.getElementById('wc-paragraphs'),
  reading: document.getElementById('wc-reading'),
};
function count() {
  const text = ta.value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+["')\]]*\s*/g) || [text]).length : 0;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n|\n+/).filter(p => p.trim()).length : 0;
  const mins = words / 200;
  out.words.textContent = words.toLocaleString();
  out.chars.textContent = chars.toLocaleString();
  out.charsNoSpace.textContent = charsNoSpace.toLocaleString();
  out.sentences.textContent = sentences.toLocaleString();
  out.paragraphs.textContent = paragraphs.toLocaleString();
  out.reading.textContent = words === 0 ? '—' : (mins < 1 ? 'under a minute' : '~' + (mins < 60 ? Math.round(mins) + ' min' : (mins / 60).toFixed(1) + ' hr'));
}
ta.addEventListener('input', count);
document.getElementById('wc-clear').addEventListener('click', () => { ta.value = ''; count(); ta.focus(); });
count();
