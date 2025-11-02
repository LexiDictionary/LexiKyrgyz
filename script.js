// GLOBAL $ — MUST BE FIRST
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// SUPABASE
const SUPABASE_URL = 'https://jvizodlmiiisubatqykg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let lemmaCache = new Map();
let lemmaList = [];
let filterCache = { cefr: new Map(), pos: new Map(), topic: new Map() };
let isCacheLoading = false;

// DOM READY
document.addEventListener('DOMContentLoaded', async () => {
  // HIDE MODALS
  const filterModal = $('#filterModal');
  const exerciseModal = $('#exerciseModal');
  if (filterModal) filterModal.style.display = 'none';
  if (exerciseModal) exerciseModal.style.display = 'none';

  await preloadCache();

  const searchInput = $('#searchInput');
  const resultsContainer = $('#resultsContainer');
  const title = $('#title');
  const randomBtn = $('#randomBtn');
  const exerciseBtn = $('#exerciseBtn');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  const closeModal = $('#closeModal');
  const closeExerciseModal = $('#closeExerciseModal');
  const virtualKeyboard = $('#virtualKeyboard');
  const keyboardToggleBtn = $('#keyboardToggleBtn');
  const aboutSection = $('#aboutSection');

  // HELPERS
  const escapeHtml = (u) => u.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  const isKyrgyz = t => /[\u0400-\u04FF]/.test(t);
  const safeParseGrammar = r => {
    if (!r) return {};
    try { return JSON.parse(r.replace(/\\"/g, '"')); } catch { return {}; }
  };

  // CACHE
  async function preloadCache() {
    if (isCacheLoading || lemmaList.length) return;
    isCacheLoading = true;
    const { data } = await supabase.from('lemmas').select('id, canonical, pronunciation, cefr').limit(1000);
    if (data) lemmaList = data;
    await preloadFilters();
    isCacheLoading = false;
  }

  async function preloadFilters() {
    const types = ['cefr', 'pos', 'topic'];
    for (const type of types) {
      const col = type === 'cefr' ? 'cefr' : type;
      const tbl = type === 'cefr' ? 'lemmas' : 'senses';
      const { data } = await supabase.from(tbl).select(col).not(col, 'is', null);
      if (!data) continue;
      const counts = {};
      data.forEach(r => { if (r[col]) counts[r[col]] = (counts[r[col]] || 0) + 1; });
      filterCache[type] = new Map(Object.entries(counts).sort((a,b) => b[1]-a[1]));
    }
  }

  // FETCH
  async function fetchFullLemma(c) {
    if (lemmaCache.has(c)) return lemmaCache.get(c);
    const { data: l } = await supabase.from('lemmas').select('*').eq('canonical', c).single();
    if (!l) return null;
    const { data: s } = await supabase.from('senses').select('*').eq('lemma_id', l.id).order('id');
    for (const sense of (s || [])) {
      sense.examples = (await supabase.from('examples').select('*').eq('sense_id', sense.id)).data || [];
      sense.related = (await supabase.from('related').select('word,translation').eq('sense_id', sense.id)).data || [];
      sense.grammar = safeParseGrammar(sense.grammar);
    }
    const e = { canonical: l.canonical, pronunciation: l.pronunciation || '', cefr: l.cefr || '', senses: s || [] };
    lemmaCache.set(c, e);
    return e;
  }

  async function fetchLemmaByForm(f) {
    const { data: r } = await supabase.from('forms').select('lemma_id').eq('form', f).single();
    if (!r) return null;
    const { data: l } = await supabase.from('lemmas').select('canonical').eq('id', r.lemma_id).single();
    return l ? await fetchFullLemma(l.canonical) : null;
  }

  // RENDER
  function renderEntry(h, e) {
    const k = isKyrgyz(h) ? 'kyrgyz' : '';
    const senses = e.senses.map((s, i) => {
      let tags = '';
      if (s.pos) tags += `<button class="pos tag-btn" data-type="pos" data-value="${escapeHtml(s.pos)}">${escapeHtml(s.pos)}</button>`;
      if (s.topic) tags += `<button class="topic-tag tag-btn" data-type="topic" data-value="${escapeHtml(s.topic)}">${escapeHtml(s.topic)}</button>`;
      const ex = (s.examples || []).map(ex => `<li class="example-item"><span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span><span class="example-translation">${escapeHtml(ex.en)}</span></li>`).join('');
      let g = '';
      if (Object.keys(s.grammar).length) {
        g = `<ul class="grammar-list">`;
        for (const [k,v] of Object.entries(s.grammar)) g += `<li class="grammar-item"><span class="grammar-label">${escapeHtml(k)}:</span> ${escapeHtml(v)}</li>`;
        g += `</ul>`;
      }
      const rel = (s.related || []).map(r => `<div class="related-item"><span class="related-word">${escapeHtml(r.word)}</span><div class="related-translation">${escapeHtml(r.translation)}</div></div>`).join('');
      return `<div class="sense-item"><div class="tags-container">${tags}</div><span class="sense-number">${i+1}.</span><div class="translation ${isKyrgyz(s.translation)?'kyrgyz':''}">${escapeHtml(s.translation)}</div><span class="sense-definition">${escapeHtml(s.definition||'')}</span><div class="section-title">Examples</div><ul class="examples-list">${ex}</ul>${g?`<div class="section-title">Grammar</div>${g}`:''}<div class="section-title">Related</div><div class="related-words-list">${rel}</div></div>`;
    }).join('');
    let cefr = '';
    if (e.cefr) cefr = `<div class="tags-container" style="position:absolute;right:0;top:0;"><button class="level-tag tag-btn" data-type="cefr" data-value="${escapeHtml(e.cefr)}">${escapeHtml(e.cefr.toUpperCase())}</button></div>`;
    return `<div class="entry" style="position:relative;">${cefr}<div class="headword ${k}">${escapeHtml(h)}</div><div class="pronunciation">${escapeHtml(e.pronunciation)}</div><div class="frequency-placeholder">Frequency: top 1000</div>${senses}</div>`;
  }

  // FILTER MODAL
  function showFilterModal(type) {
    modalTitle.textContent = {cefr:'CEFR Levels',pos:'Parts of Speech',topic:'Topics'}[type];
    const items = filterCache[type];
    modalBody.innerHTML = items.size ? `<ul class="filter-list">${Array.from(items.entries()).map(([v,c])=>`<li class="filter-item" data-filter-value="${escapeHtml(v)}"><span>${escapeHtml(v)}</span><span class="filter-count">${c}</span></li>`).join('')}</ul>` : `<p style="text-align:center;color:var(--text-muted);">No data.</p>`;
    filterModal.style.display = 'flex';
    modalBody.querySelectorAll('.filter-item').forEach(i => i.onclick = () => { filterAndShow(type, i.dataset.filterValue); filterModal.style.display = 'none'; });
  }

  async function filterAndShow(type, val) {
    let lemmas = [];
    if (type === 'cefr') { const {data} = await supabase.from('lemmas').select('canonical').eq('cefr', val); lemmas = data || []; }
    else if (type === 'pos') { const {data: s} = await supabase.from('senses').select('lemma_id').eq('pos', val); if (s) { const ids = [...new Set(s.map(x=>x.lemma_id))]; const {data} = await supabase.from('lemmas').select('canonical').in('id', ids); lemmas = data || []; } }
    else if (type === 'topic') { const {data: s} = await supabase.from('senses').select('lemma_id').eq('topic', val); if (s) { const ids = [...new Set(s.map(x=>x.lemma_id))]; const {data} = await supabase.from('lemmas').select('canonical').in('id', ids); lemmas = data || []; } }
    if (!lemmas.length) { resultsContainer.innerHTML = `<div class="no-result">No results for ${escapeHtml(val)}</div>`; return; }
    const entries = await Promise.all(lemmas.map(l => fetchFullLemma(l.canonical)));
    resultsContainer.innerHTML = entries.filter(e=>e).map(e=>renderEntry(e.canonical,e)).join('');
    attachTagFilters();
  }

  function attachTagFilters() {
    $$('.tag-btn').forEach(b => b.onclick = e => { e.stopPropagation(); showFilterModal(b.dataset.type); });
  }

  // SEARCH
  async function showResult(q = '') {
    const trim = q.trim();
    if (!trim) { resultsContainer.innerHTML = aboutSection.outerHTML; return; }
    let html = `<div class="no-result">Not found: "${escapeHtml(trim)}"</div>`;
    try {
      if (isKyrgyz(trim)) {
        let e = await fetchFullLemma(trim);
        if (!e) e = await fetchLemmaByForm(trim);
        if (e) html = renderEntry(e.canonical || trim, e);
      } else {
        const {data: s} = await supabase.from('senses').select('lemma_id, translation').ilike('translation', trim);
        if (s?.length === 1) {
          const {data: l} = await supabase.from('lemmas').select('canonical').eq('id', s[0].lemma_id).single();
          if (l) { const f = await fetchFullLemma(l.canonical); if (f) html = renderEntry(l.canonical, f); }
        }
      }
    } catch (e) { console.error(e); }
    resultsContainer.innerHTML = html;
    attachTagFilters();
  }

  // BUTTONS
  randomBtn.onclick = async () => {
    if (!lemmaList.length) await preloadCache();
    if (!lemmaList.length) return;
    const r = lemmaList[Math.floor(Math.random()*lemmaList.length)];
    const e = await fetchFullLemma(r.canonical);
    if (e) { searchInput.value = e.canonical; resultsContainer.innerHTML = renderEntry(e.canonical, e); attachTagFilters(); }
  };

  exerciseBtn.onclick = generateExercise;

  // EXERCISE
  async function generateExercise() {
    if (!lemmaList.length) await preloadCache();
    const c = lemmaList[Math.floor(Math.random()*lemmaList.length)];
    const e = await fetchFullLemma(c.canonical);
    if (!e?.senses?.[0]) return;
    const ans = e.senses[0].translation;
    const wrong = (await Promise.all(lemmaList.filter(l=>l.id!==c.id).sort(()=>Math.random()-0.5).slice(0,3).map(l=>fetchFullLemma(l.canonical))))
      .filter(x=>x?.senses?.[0]).map(x=>x.senses[0].translation);
    const opts = [ans, ...wrong].sort(()=>Math.random()-0.5);
    const body = exerciseModal.querySelector('#exerciseModalBody');
    body.innerHTML = `<div class="exercise-question">English for <span class="kyrgyz">${escapeHtml(c.canonical)}</span>?</div><div class="answer-options">${opts.map(o=>`<div class="answer-option" data-answer="${escapeHtml(o)}">${escapeHtml(o)}</div>`).join('')}</div><div class="exercise-feedback" style="display:none;"></div><div class="exercise-buttons"><button class="exercise-btn-modal next-btn">Next</button><button class="exercise-btn-modal close-btn">Close</button></div>`;
    exerciseModal.style.display = 'block';
    body.querySelectorAll('.answer-option').forEach(o => o.onclick = () => {
      const correct = o.dataset.answer === ans;
      $$('.answer-option').forEach(x=>x.classList.remove('selected','correct','incorrect'));
      o.classList.add('selected', correct?'correct':'incorrect');
      if (!correct) body.querySelector(`[data-answer="${ans}"]`).classList.add('correct');
      const fb = body.querySelector('.exercise-feedback');
      fb.style.display = 'block';
      fb.innerHTML = correct ? `<h4>Correct!</h4><p>Good!</p>` : `<h4>Wrong</h4><p>Answer: <strong>${escapeHtml(ans)}</strong></p>`;
      body.querySelector('.next-btn').onclick = generateExercise;
    });
    body.querySelector('.close-btn').onclick = () => exerciseModal.style.display = 'none';
  }

  closeExerciseModal.onclick = () => exerciseModal.style.display = 'none';

  // UI
  title.onclick = () => { searchInput.value = ''; showResult(''); };
  let to;
  searchInput.addEventListener('input', () => { clearTimeout(to); to = setTimeout(() => showResult(searchInput.value), 300); });
  keyboardToggleBtn.onclick = () => {
    const h = virtualKeyboard.style.display === 'none';
    virtualKeyboard.style.display = h ? 'block' : 'none';
    keyboardToggleBtn.textContent = h ? 'Hide Keyboard' : 'Show Keyboard';
  };
  document.addEventListener('click', e => {
    if (!e.target.matches('.key')) return;
    const a = e.target.dataset.action;
    if (a === 'backspace') searchInput.value = searchInput.value.slice(0,-1);
    else if (a === 'space') searchInput.value += ' ';
    else searchInput.value += e.target.textContent;
    searchInput.focus();
    clearTimeout(to); to = setTimeout(() => showResult(searchInput.value), 100);
  });
  closeModal.onclick = () => filterModal.style.display = 'none';
  window.addEventListener('click', e => {
    if (e.target === filterModal) filterModal.style.display = 'none';
    if (e.target === exerciseModal) exerciseModal.style.display = 'none';
  });

  showResult('');
});
