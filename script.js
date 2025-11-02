// ------------------------------------------------------------
// SUPABASE + CACHE
// ------------------------------------------------------------
const SUPABASE_URL = 'https://jvizodlmiiisubatqykg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let lemmaCache = new Map();
let lemmaList = [];
let filterCache = { cefr: new Map(), pos: new Map(), topic: new Map() };
let isCacheLoading = false;

// ------------------------------------------------------------
// DOM READY
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // HIDE MODALS
  const filterModal = document.querySelector('#filterModal');
  const exerciseModal = document.querySelector('#exerciseModal');
  if (filterModal) filterModal.style.display = 'none';
  if (exerciseModal) exerciseModal.style.display = 'none';

  await preloadCache();

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

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

  // ------------------------------------------------------------ 
  // HELPERS
  // ------------------------------------------------------------
  const escapeHtml = (unsafe) => unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const isKyrgyz = text => /[\u0400-\u04FF]/.test(text);

  const safeParseGrammar = (raw) => {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw.replace(/\\"/g, '"')); }
    catch { return {}; }
  };

  // ------------------------------------------------------------ 
  // CACHE
  // ------------------------------------------------------------
  async function preloadCache() {
    if (isCacheLoading || lemmaList.length > 0) return;
    isCacheLoading = true;

    const { data } = await supabase.from('lemmas').select('id, canonical, pronunciation, cefr').limit(1000);
    if (data) lemmaList = data;

    await preloadFilters();
    isCacheLoading = false;
  }

  async function preloadFilters() {
    const types = [
      { type: 'cefr', table: 'lemmas', column: 'cefr' },
      { type: 'pos', table: 'senses', column: 'pos' },
      { type: 'topic', table: 'senses', column: 'topic' }
    ];

    for (const { type, table, column } of types) {
      const { data } = await supabase.from(table).select(column).not(column, 'is', null);
      if (!data) continue;

      const counts = {};
      data.forEach(row => {
        const val = row[column];
        if (val) counts[val] = (counts[val] || 0) + 1;
      });

      filterCache[type] = new Map(Object.entries(counts).sort((a, b) => b[1] - a[1]));
    }
  }

  // ------------------------------------------------------------ 
  // FETCH LEMMA
  // ------------------------------------------------------------
  async function fetchFullLemma(canonical) {
    if (lemmaCache.has(canonical)) return lemmaCache.get(canonical);

    const { data: lemma } = await supabase.from('lemmas').select('*').eq('canonical', canonical).single();
    if (!lemma) return null;

    const { data: senses } = await supabase.from('senses').select('*').eq('lemma_id', lemma.id).order('id');
    if (!senses) senses = [];

    for (const sense of senses) {
      const { data: examples } = await supabase.from('examples').select('*').eq('sense_id', sense.id);
      sense.examples = examples || [];

      const { data: related } = await supabase.from('related').select('word,translation').eq('sense_id', sense.id);
      sense.related = related || [];

      sense.grammar = safeParseGrammar(sense.grammar);
    }

    const entry = { canonical: lemma.canonical, pronunciation: lemma.pronunciation || '', cefr: lemma.cefr || '', senses };
    lemmaCache.set(canonical, entry);
    return entry;
  }

  async function fetchLemmaByForm(form) {
    const { data: row } = await supabase.from('forms').select('lemma_id').eq('form', form).single();
    if (!row) return null;

    const { data: lemma } = await supabase.from('lemmas').select('canonical').eq('id', row.lemma_id).single();
    if (!lemma) return null;

    return await fetchFullLemma(lemma.canonical);
  }

  // ------------------------------------------------------------ 
  // RENDER
  // ------------------------------------------------------------
  function renderEntry(headword, entry) {
    const kyrgyzHead = isKyrgyz(headword) ? 'kyrgyz' : '';

    const senseHtml = entry.senses.map((sense, i) => {
      const transCls = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
      let tags = '';
      if (sense.pos) tags += `<button class="pos tag-btn" data-type="pos" data-value="${escapeHtml(sense.pos)}">${escapeHtml(sense.pos)}</button>`;
      if (sense.topic) tags += `<button class="topic-tag tag-btn" data-type="topic" data-value="${escapeHtml(sense.topic)}">${escapeHtml(sense.topic)}</button>`;

      const examples = (sense.examples || []).map(ex => `
        <li class="example-item">
          <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
          <span class="example-translation">${escapeHtml(ex.en)}</span>
        </li>`).join('');

      let grammarHtml = '';
      if (Object.keys(sense.grammar).length) {
        grammarHtml = `<ul class="grammar-list">`;
        for (const [k, v] of Object.entries(sense.grammar)) {
          grammarHtml += `<li class="grammar-item"><span class="grammar-label">${escapeHtml(k)}:</span> ${escapeHtml(v)}</li>`;
        }
        grammarHtml += `</ul>`;
      }

      const related = (sense.related || []).map(r => `
        <div class="related-item">
          <span class="related-word">${escapeHtml(r.word)}</span>
          <div class="related-translation">${escapeHtml(r.translation)}</div>
        </div>`).join('');

      return `
        <div class="sense-item">
          <div class="tags-container">${tags}</div>
          <span class="sense-number">${i + 1}.</span>
          <div class="translation ${transCls}">${escapeHtml(sense.translation)}</div>
          <span class="sense-definition">${escapeHtml(sense.definition || '')}</span>
          <div class="section-title">Examples</div>
          <ul class="examples-list">${examples}</ul>
          ${grammarHtml ? `<div class="section-title">Grammar</div>${grammarHtml}` : ''}
          <div class="section-title">Related</div>
          <div class="related-words-list">${related}</div>
        </div>`;
    }).join('');

    let cefrTag = '';
    if (entry.cefr) {
      cefrTag = `<div class="tags-container" style="position:absolute;right:0;top:0;">
        <button class="level-tag tag-btn" data-type="cefr" data-value="${escapeHtml(entry.cefr)}">${escapeHtml(entry.cefr.toUpperCase())}</button>
      </div>`;
    }

    return `
      <div class="entry" style="position:relative;">
        ${cefrTag}
        <div class="headword ${kyrgyzHead}">${escapeHtml(headword)}</div>
        <div class="pronunciation">${escapeHtml(entry.pronunciation)}</div>
        <div class="frequency-placeholder">Frequency: top 1000</div>
        ${senseHtml}
      </div>`;
  }

  // ------------------------------------------------------------ 
  // FILTER MODAL
  // ------------------------------------------------------------
  function showFilterModal(type) {
    const titles = { cefr: 'CEFR Levels', pos: 'Parts of Speech', topic: 'Topics' };
    modalTitle.textContent = titles[type];

    const items = filterCache[type];
    if (!items || items.size === 0) {
      modalBody.innerHTML = `<p style="text-align:center;color:var(--text-muted);">No data.</p>`;
    } else {
      const list = Array.from(items.entries())
        .map(([v, c]) => `<li class="filter-item" data-filter-value="${escapeHtml(v)}"><span>${escapeHtml(v)}</span><span class="filter-count">${c}</span></li>`)
        .join('');
      modalBody.innerHTML = `<ul class="filter-list">${list}</ul>`;
    }

    filterModal.style.display = 'flex';

    modalBody.querySelectorAll('.filter-item').forEach(item => {
      item.onclick = () => {
        filterAndShow(type, item.dataset.filterValue);
        filterModal.style.display = 'none';
      };
    });
  }

  // ------------------------------------------------------------ 
  // FILTER
  // ------------------------------------------------------------
  async function filterAndShow(type, value) {
    let lemmas = [];

    if (type === 'cefr') {
      const { data } = await supabase.from('lemmas').select('canonical').eq('cefr', value);
      lemmas = data || [];
    } else if (type === 'pos') {
      const { data: senses } = await supabase.from('senses').select('lemma_id').eq('pos', value);
      if (senses) {
        const ids = [...new Set(senses.map(s => s.lemma_id))];
        const { data } = await supabase.from('lemmas').select('canonical').in('id', ids);
        lemmas = data || [];
      }
    } else if (type === 'topic') {
      const { data: senses } = await supabase.from('senses').select('lemma_id').eq('topic', value);
      if (senses) {
        const ids = [...new Set(senses.map(s => s.lemma_id))];
        const { data } = await supabase.from('lemmas').select('canonical').in('id', ids);
        lemmas = data || [];
      }
    }

    if (lemmas.length === 0) {
      resultsContainer.innerHTML = `<div class="no-result">No results for ${escapeHtml(value)}</div>`;
      return;
    }

    const entries = await Promise.all(lemmas.map(l => fetchFullLemma(l.canonical)));
    resultsContainer.innerHTML = entries.filter(e => e).map(e => renderEntry(e.canonical, e)).join('');
    attachTagFilters();
  }

  // ------------------------------------------------------------ 
  // TAG CLICK
  // ------------------------------------------------------------
  function attachTagFilters() {
    $$('.tag-btn').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        showFilterModal(btn.dataset.type);
      };
    });
  }

  // ------------------------------------------------------------ 
  // SEARCH
  // ------------------------------------------------------------
  async function showResult(query = '') {
    const q = query.trim();
    if (!q) {
      resultsContainer.innerHTML = aboutSection.outerHTML;
      return;
    }

    let html = `<div class="no-result">Not found: "${escapeHtml(q)}"</div>`;
    const kg = isKyrgyz(q);

    try {
      if (kg) {
        let entry = await fetchFullLemma(q);
        if (!entry) entry = await fetchLemmaByForm(q);
        if (entry) html = renderEntry(entry.canonical || q, entry);
      } else {
        const { data: senses } = await supabase.from('senses').select('lemma_id, translation').ilike('translation', q);
        if (senses?.length === 1) {
          const { data: lemma } = await supabase.from('lemmas').select('canonical').eq('id', senses[0].lemma_id).single();
          if (lemma) {
            const full = await fetchFullLemma(lemma.canonical);
            if (full) html = renderEntry(lemma.canonical, full);
          }
        }
      }
    } catch (e) { console.error(e); }

    resultsContainer.innerHTML = html;
    attachTagFilters();
  }

  // ------------------------------------------------------------ 
  // BUTTONS
  // ------------------------------------------------------------
  randomBtn.onclick = async () => {
    if (!lemmaList.length) await preloadCache();
    if (!lemmaList.length) return;
    const rand = lemmaList[Math.floor(Math.random() * lemmaList.length)];
    const entry = await fetchFullLemma(rand.canonical);
    if (entry) {
      searchInput.value = entry.canonical;
      resultsContainer.innerHTML = renderEntry(entry.canonical, entry);
      attachTagFilters();
    }
  };

  exerciseBtn.onclick = generateExercise;

  // ------------------------------------------------------------ 
  // EXERCISE
  // ------------------------------------------------------------
  async function generateExercise() {
    if (!lemmaList.length) await preloadCache();
    if (!lemmaList.length) return;

    const correct = lemmaList[Math.floor(Math.random() * lemmaList.length)];
    const entry = await fetchFullLemma(correct.canonical);
    if (!entry?.senses?.[0]) return;
    const answer = entry.senses[0].translation;

    const distractors = lemmaList.filter(l => l.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3).map(l => l.canonical);
    const wrong = await Promise.all(distractors.map(c => fetchFullLemma(c)));
    const wrongAnswers = wrong.filter(e => e?.senses?.[0]).map(e => e.senses[0].translation);

    const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    const optsHtml = options.map(o => `<div class="answer-option" data-answer="${escapeHtml(o)}">${escapeHtml(o)}</div>`).join('');

    const body = exerciseModal.querySelector('#exerciseModalBody');
    body.innerHTML = `
      <div class="exercise-question">English for <span class="kyrgyz">${escapeHtml(correct.canonical)}</span>?</div>
      <div class="answer-options">${optsHtml}</div>
      <div class="exercise-feedback" style="display:none;"></div>
      <div class="exercise-buttons">
        <button class="exercise-btn-modal next-btn">Next</button>
        <button class="exercise-btn-modal close-btn">Close</button>
      </div>
    `;

    exerciseModal.style.display = 'block';

    body.querySelectorAll('.answer-option').forEach(opt => {
      opt.onclick = () => {
        const correctAns = opt.dataset.answer === answer;
        $$('.answer-option').forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
        opt.classList.add('selected', correctAns ? 'correct' : 'incorrect');
        if (!correctAns) body.querySelector(`[data-answer="${answer}"]`).classList.add('correct');

        const fb = body.querySelector('.exercise-feedback');
        fb.style.display = 'block';
        fb.innerHTML = correctAns
          ? `<h4>Correct!</h4><p>Good job!</p>`
          : `<h4>Wrong</h4><p>Answer: <strong>${escapeHtml(answer)}</strong></p>`;

        body.querySelector('.next-btn').onclick = generateExercise;
      };
    });

    body.querySelector('.close-btn').onclick = () => exerciseModal.style.display = 'none';
  }

  closeExerciseModal.onclick = () => exerciseModal.style.display = 'none';

  // ------------------------------------------------------------ 
  // UI
  // ------------------------------------------------------------
  title.onclick = () => { searchInput.value = ''; showResult(''); };

  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => showResult(searchInput.value), 300);
  });

  keyboardToggleBtn.onclick = () => {
    const hidden = virtualKeyboard.style.display === 'none';
    virtualKeyboard.style.display = hidden ? 'block' : 'none';
    keyboardToggleBtn.textContent = hidden ? 'Hide Keyboard' : 'Show Keyboard';
  };

  document.addEventListener('click', e => {
    if (!e.target.matches('.key')) return;
    const action = e.target.dataset.action;
    if (action === 'backspace') searchInput.value = searchInput.value.slice(0, -1);
    else if (action === 'space') searchInput.value += ' ';
    else searchInput.value += e.target.textContent;
    searchInput.focus();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => showResult(searchInput.value), 100);
  });

  closeModal.onclick = () => filterModal.style.display = 'none';

  window.addEventListener('click', e => {
    if (e.target === filterModal) filterModal.style.display = 'none';
    if (e.target === exerciseModal) exerciseModal.style.display = 'none';
  });

  // START
  showResult('');
});
