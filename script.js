const SUPABASE_URL = 'https://jvizodlmiiisubatqykg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let lemmaCache = new Map();
let lemmaList = [];
let isCacheLoading = false;

const preloadCache = async () => {
  if (isCacheLoading || lemmaList.length > 0) return;
  isCacheLoading = true;
  const { data, error } = await supabase.from('lemmas').select('id, canonical, pronunciation, cefr').limit(1000);
  if (error || !data) { console.error('Cache preload failed:', error); isCacheLoading = false; return; }
  lemmaList = data;
  isCacheLoading = false;
};

document.addEventListener('DOMContentLoaded', async () => {
  await preloadCache();

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const searchInput = $('#searchInput');
  const resultsContainer = $('#resultsContainer');
  const title = $('#title');
  const randomBtn = $('#randomBtn');
  const exerciseBtn = $('#exerciseBtn');
  const filterModal = $('#filterModal');
  const closeModal = $('#closeModal');
  const exerciseModal = $('#exerciseModal');
  const closeExerciseModal = $('#closeExerciseModal');
  const virtualKeyboard = $('#virtualKeyboard');
  const keyboardToggleBtn = $('#keyboardToggleBtn');
  const aboutSection = $('#aboutSection');
  const autocompleteDropdown = $('#autocompleteDropdown');

  const escapeHtml = unsafe => unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  const isKyrgyz = text => /[\u0400-\u04FF]/.test(text);
  const safeParseGrammar = raw => {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    if (typeof raw !== 'string') return {};
    try { return JSON.parse(raw.replace(/\\"/g, '"')); } catch (e) { console.warn('Failed to parse grammar JSON:', raw); return {}; }
  };

  const fetchFullLemma = async canonical => {
    if (lemmaCache.has(canonical)) return lemmaCache.get(canonical);
    const { data: lemma, error: e1 } = await supabase.from('lemmas').select('*').eq('canonical', canonical).single();
    if (e1 || !lemma) return null;
    const { data: senses, error: e2 } = await supabase.from('senses').select('*').eq('lemma_id', lemma.id).order('id');
    if (e2) senses = [];
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
  };

  const fetchLemmaByForm = async form => {
    const { data: row, error } = await supabase.from('forms').select('lemma_id').eq('form', form).single();
    if (error || !row) return null;
    const { data: lemma } = await supabase.from('lemmas').select('canonical').eq('id', row.lemma_id).single();
    if (!lemma) return null;
    return await fetchFullLemma(lemma.canonical);
  };

  const renderEntry = async (headword, entry) => {
    const kyrgyzHead = isKyrgyz(headword) ? 'kyrgyz' : '';
    const senseHtml = entry.senses.map((sense, i) => {
      const transCls = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
      const cleanTranslation = sense.translation ? sense.translation.charAt(0).toLowerCase() + sense.translation.slice(1) : '';
      let tags = '';
      if (sense.pos) tags += `<button type="button" class="pos" data-filter="pos" data-value="${sense.pos}">${sense.pos}</button>`;
      if (sense.topic) tags += `<button type="button" class="topic-tag" data-filter="topic" data-value="${sense.topic}">${sense.topic}</button>`;
      const examples = (sense.examples || []).map(ex => `<li class="example-item"><span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span><span class="example-translation">${escapeHtml(ex.en)}</span></li>`).join('');
      let grammarHtml = '';
      if (Object.keys(sense.grammar).length > 0) {
        grammarHtml = `<ul class="grammar-list">`;
        for (const [key, value] of Object.entries(sense.grammar)) {
          grammarHtml += `<li class="grammar-item"><span class="grammar-label">${escapeHtml(key)}:</span> ${escapeHtml(value)}</li>`;
        }
        grammarHtml += `</ul>`;
      }
      const relatedPromises = (sense.related || []).map(async r => {
        const { data } = await supabase.from('lemmas').select('id').eq('canonical', r.word).single();
        if (data) return `<div class="related-item"><span class="related-word linkable" data-lemma="${escapeHtml(r.word)}">${escapeHtml(r.word)}</span><div class="related-translation">${escapeHtml(r.translation)}</div></div>`;
        return `<div class="related-item"><span class="related-word">${escapeHtml(r.word)}</span><div class="related-translation">${escapeHtml(r.translation)}</div></div>`;
      });
      const related = (await Promise.all(relatedPromises)).join('');
      return `<div class="sense-item"><div class="tags-container">${tags}</div><span class="sense-number">${i + 1}.</span><div class="translation ${transCls}">${escapeHtml(cleanTranslation)}</div><span class="sense-definition">${escapeHtml(sense.definition || '')}</span><div class="section-title">Examples</div><ul class="examples-list">${examples}</ul>${grammarHtml ? `<div class="section-title">Grammar</div>${grammarHtml}` : ''}<div class="section-title">Related</div><div class="related-words-list">${related}</div></div>`;
    });
    const finalSenseHtml = (await Promise.all(senseHtml)).join('');
    let cefrTag = '';
    if (entry.cefr) cefrTag = `<div class="tags-container" style="position:absolute;right:0;top:0;"><button type="button" class="level-tag" data-filter="cefr" data-value="${entry.cefr}">${entry.cefr.toUpperCase()}</button></div>`;
    return `<div class="entry" style="position:relative;">${cefrTag}<div class="headword ${kyrgyzHead}">${escapeHtml(headword)}</div><div class="pronunciation">${escapeHtml(entry.pronunciation)}</div><div class="frequency-placeholder">Frequency: top 1000</div>${finalSenseHtml}</div>`;
  };

  let autocompleteTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(autocompleteTimeout);
    const q = searchInput.value.trim();
    if (q.length < 4) { autocompleteDropdown.style.display = 'none'; return; }
    autocompleteTimeout = setTimeout(async () => {
      const { data } = await supabase.from('lemmas').select('canonical').ilike('canonical', `${q}%`).order('canonical').limit(8);
      if (!data || data.length === 0) { autocompleteDropdown.style.display = 'none'; return; }
      const items = data.map(l => `<div class="autocomplete-item" data-lemma="${escapeHtml(l.canonical)}"><span class="kyrgyz">${escapeHtml(l.canonical)}</span></div>`).join('');
      autocompleteDropdown.innerHTML = items;
      autocompleteDropdown.style.display = 'block';
      autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.onclick = () => { searchInput.value = item.dataset.lemma; autocompleteDropdown.style.display = 'none'; showResult(item.dataset.lemma); };
      });
    }, 300);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.autocomplete-wrapper')) autocompleteDropdown.style.display = 'none';
  });

  const checkExampleMatch = async query => {
    const { data: examples } = await supabase.from('examples').select('kg, sense_id').ilike('kg', `%${query}%`).limit(3);
    if (!examples || examples.length === 0) return [];
    const suggestions = [];
    for (const ex of examples) {
      const { data: sense } = await supabase.from('senses').select('lemma_id').eq('id', ex.sense_id).single();
      if (!sense) continue;
      const { data: lemma } = await supabase.from('lemmas').select('canonical').eq('id', sense.lemma_id).single();
      if (lemma) suggestions.push({ word: lemma.canonical, example: ex.kg });
    }
    return suggestions;
  };

  const showResult = async (query = '') => {
    const q = query.trim();
    if (!q) { resultsContainer.innerHTML = aboutSection.outerHTML; return; }
    let html = '';
    let entry = null;
    const kg = isKyrgyz(q);
    if (kg) { entry = await fetchFullLemma(q); if (!entry) entry = await fetchLemmaByForm(q); } else {
      const { data: senses } = await supabase.from('senses').select('lemma_id, translation').ilike('translation', q);
      if (senses?.length === 1) {
        const { data: lemma } = await supabase.from('lemmas').select('canonical').eq('id', senses[0].lemma_id).single();
        if (lemma) entry = await fetchFullLemma(lemma.canonical);
      }
    }
    if (entry) html = await renderEntry(entry.canonical, entry);
    else {
      html = `<div class="no-result">No entry found for "${escapeHtml(q)}"</div>`;
      const suggestions = await checkExampleMatch(q);
      if (suggestions.length > 0) {
        const links = suggestions.map(s => `<a href="#" data-lemma="${escapeHtml(s.word)}">${escapeHtml(s.word)}</a>`).join(', ');
        html += `<div class="appears-in">This word appears in: ${links}<br><small>e.g., "${escapeHtml(suggestions[0].example)}"</small></div>`;
      }
    }
    resultsContainer.innerHTML = html;
    attachTagFilters();
    $$('.related-word.linkable').forEach(el => { el.onclick = e => { e.stopPropagation(); searchInput.value = el.dataset.lemma; showResult(el.dataset.lemma); }; });
    $$('.appears-in a').forEach(link => { link.onclick = e => { e.preventDefault(); searchInput.value = link.dataset.lemma; showResult(link.dataset.lemma); }; });
  };

  randomBtn.onclick = async () => {
    if (!lemmaList.length) await preloadCache();
    if (!lemmaList.length) return;
    const rand = lemmaList[Math.floor(Math.random() * lemmaList.length)];
    const entry = await fetchFullLemma(rand.canonical);
    if (entry) { searchInput.value = entry.canonical; resultsContainer.innerHTML = await renderEntry(entry.canonical, entry); attachTagFilters(); }
  };

  const generateExercise = async () => {
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
    body.innerHTML = `<div class="exercise-question">What's the English for <span class="kyrgyz">${escapeHtml(correct.canonical)}</span>?</div><div class="answer-options">${optsHtml}</div><div class="exercise-feedback" style="display:none;"></div><div class="exercise-buttons"><button type="button" class="exercise-btn-modal next-btn">Next Question</button><button type="button" class="exercise-btn-modal close-btn">Close</button></div>`;
    exerciseModal.style.display = 'block';
    body.querySelectorAll('.answer-option').forEach(opt => {
      opt.onclick = () => {
        const selected = opt.dataset.answer;
        const correct = selected === answer;
        $$('.answer-option').forEach(o => o.classList.remove('selected','correct','incorrect'));
        opt.classList.add('selected', correct ? 'correct' : 'incorrect');
        if (!correct) body.querySelector(`[data-answer="${answer}"]`)?.classList.add('correct');
        const fb = body.querySelector('.exercise-feedback');
        fb.style.display = 'block';
        fb.innerHTML = correct ? `<h4>Correct!</h4><p>Well done!</p>` : `<h4>Incorrect</h4><p>The right answer is <strong>${escapeHtml(answer)}</strong></p>`;
        body.querySelector('.next-btn').onclick = generateExercise;
      };
    });
    body.querySelector('.close-btn').onclick = () => exerciseModal.style.display = 'none';
  };

  exerciseBtn.onclick = generateExercise;
  closeExerciseModal.onclick = () => exerciseModal.style.display = 'none';

  title.onclick = () => { searchInput.value = ''; showResult(''); autocompleteDropdown.style.display = 'none'; };

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
    const key = e.target;
    const action = key.dataset.action;
    if (action === 'backspace') searchInput.value = searchInput.value.slice(0, -1);
    else if (action === 'space') searchInput.value += ' ';
    else searchInput.value += key.textContent;
    searchInput.focus();
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => showResult(searchInput.value), 100);
  });

  closeModal.onclick = () => filterModal.style.display = 'none';
  window.addEventListener('click', e => {
    if (e.target === filterModal || e.target === exerciseModal) {
      filterModal.style.display = exerciseModal.style.display = 'none';
    }
  });

  const attachTagFilters = () => {
    $$('[data-filter]').forEach(btn => {
      btn.onclick = () => alert(`Filter: ${btn.dataset.filter} = ${btn.dataset.value}`);
    });
  };

  showResult('');
});
