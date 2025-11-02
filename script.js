// SUPABASE CONFIG
const supabase = supabase.createClient(
  'https://jvizodlmiiisubatqykg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I'
);

// DUMMY showFilterList to prevent errors
window.showFilterList = () => {};

// DOM ELEMENTS
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const randomBtn = document.getElementById('randomBtn');
const exerciseBtn = document.getElementById('exerciseBtn');
const keyboardToggleBtn = document.getElementById('keyboardToggleBtn');
const virtualKeyboard = document.getElementById('virtualKeyboard');

// UTILITY
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '<', '>': '>', '"': '&quot;', "'": '&#039;' }[m]));
}

// RENDER ENTRY (SIMPLIFIED)
function renderEntry(lemma, entry) {
  const sensesHtml = entry.senses.map((s, i) => `
    <div class="sense-item">
      <div class="translation">${escapeHtml(s.translation)}</div>
      <div class="section-title">Examples</div>
      <ul class="examples-list">
        ${s.examples.map(ex => `<li class="example-item"><span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span><span class="example-translation">${escapeHtml(ex.en)}</span></li>`).join('')}
      </ul>
      <div class="section-title">Related Words</div>
      <div class="related-words-list">
        ${s.relatedWords.map(rw => `<div class="derivative-item"><span class="derivative-word">${escapeHtml(rw.word)}</span><div class="derivative-translation">${escapeHtml(rw.translation)}</div></div>`).join('')}
      </div>
    </div>
  `).join('');

  return `
    <div class="entry">
      <div class="headword kyrgyz">${escapeHtml(entry.canonical)}</div>
      <div class="pronunciation">${escapeHtml(entry.pronunciation || '')}</div>
      ${sensesHtml}
    </div>
  `;
}

// FETCH LEMMA
async function fetchLemma(query) {
  // Try canonical first
  let {  data } = await supabase.from('lemmas').select('*').eq('canonical', query);
  if (data && data.length) {
    const lemma = data[0];
    const {  senses } = await supabase.from('senses').select('*').eq('lemma_id', lemma.id);
    for (const s of senses) {
      const {  examples } = await supabase.from('examples').select('*').eq('sense_id', s.id);
      const {  related } = await supabase.from('related').select('*').eq('sense_id', s.id);
      s.examples = examples || [];
      s.relatedWords = related || [];
    }
    return { ...lemma, senses };
  }

  // Try inflected form
  const {  formMatch } = await supabase.from('forms').select('lemma_id').eq('form', query).single();
  if (formMatch) {
    const {  lemma } = await supabase.from('lemmas').select('*').eq('id', formMatch.lemma_id).single();
    if (lemma) {
      const {  senses } = await supabase.from('senses').select('*').eq('lemma_id', lemma.id);
      for (const s of senses) {
        const {  examples } = await supabase.from('examples').select('*').eq('sense_id', s.id);
        const {  related } = await supabase.from('related').select('*').eq('sense_id', s.id);
        s.examples = examples || [];
        s.relatedWords = related || [];
      }
      return { ...lemma, senses };
    }
  }
  return null;
}

// SHOW RESULT
async function showResult(query) {
  if (!query.trim()) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    return;
  }

  const entry = await fetchLemma(query.trim());
  if (entry) {
    resultsContainer.innerHTML = renderEntry(entry.canonical, entry);
  } else {
    resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(query)}"</div>`;
  }
}

// RANDOM WORD
async function getRandomWord() {
  const {  data } = await supabase.from('lemmas').select('canonical').limit(1).offset(Math.floor(Math.random() * 100));
  return data?.[0]?.canonical || 'алма';
}

// EVENT LISTENERS
searchInput.addEventListener('input', e => showResult(e.target.value));
randomBtn?.addEventListener('click', async () => {
  const w = await getRandomWord();
  searchInput.value = w;
  showResult(w);
});
exerciseBtn?.addEventListener('click', () => alert('Exercise feature coming soon.'));
keyboardToggleBtn?.addEventListener('click', () => {
  virtualKeyboard.style.display = virtualKeyboard.style.display === 'none' ? 'block' : 'none';
  keyboardToggleBtn.textContent = virtualKeyboard.style.display === 'none' ? 'Show Keyboard' : 'Hide Keyboard';
});

// KEYBOARD KEYS
document.querySelectorAll('.key').forEach(k => {
  k.addEventListener('click', () => {
    const action = k.dataset.action;
    if (action === 'backspace') searchInput.value = searchInput.value.slice(0, -1);
    else if (action === 'space') searchInput.value += ' ';
    else searchInput.value += k.textContent;
    showResult(searchInput.value);
  });
});
