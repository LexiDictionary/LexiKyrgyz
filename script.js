// ===========================
// Supabase Client
// ===========================
const supabaseUrl = 'https://jvizodlmiiisubatqykg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// ===========================
// DOM Elements
// ===========================
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const title = document.getElementById('title');
const randomBtn = document.getElementById('randomBtn');
const exerciseBtn = document.getElementById('exerciseBtn');
const filterModal = document.getElementById('filterModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');
const exerciseModal = document.getElementById('exerciseModal');
const closeExerciseModal = document.getElementById('closeExerciseModal');
const virtualKeyboard = document.getElementById('virtualKeyboard');
const keyboardToggleBtn = document.getElementById('keyboardToggleBtn');

// ===========================
// Caches
// ===========================
let allLemmasCache = null; // [{ lemma, senses: [...] }]
let allEntriesWithFormsCache = null; // [{ lemma, forms: [...] }]

// ===========================
// Utilities
// ===========================
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isKyrgyz(text) {
  return /[\u0400-\u4FF]/.test(text);
}

// ===========================
// Data Fetchers
// ===========================
async function fetchFullDictionary() {
  if (allLemmasCache) return allLemmasCache;

  try {
    // 1. Get all lemmas
    const { data: lemmas, error: lemmasErr } = await supabase
      .from('lemmas')
      .select('id, canonical, pronunciation, cefr');
    if (lemmasErr) throw lemmasErr;

    const lemmaIds = lemmas.map(l => l.id);

    // 2. Get all senses
    const { data: senses, error: sensesErr } = await supabase
      .from('senses')
      .select('id, lemma_id, pos, translation, topic, grammar')
      .in('lemma_id', lemmaIds);
    if (sensesErr) throw sensesErr;

    const senseIds = senses.map(s => s.id);

    // 3. Get examples & related
    const [examplesRes, relatedRes] = await Promise.all([
      supabase.from('examples').select('sense_id, kg, en').in('sense_id', senseIds),
      supabase.from('related').select('sense_id, word, translation').in('sense_id', senseIds)
    ]);

    const examplesMap = {};
    examplesRes.data?.forEach(ex => {
      if (!examplesMap[ex.sense_id]) examplesMap[ex.sense_id] = [];
      examplesMap[ex.sense_id].push({ kg: ex.kg, en: ex.en });
    });

    const relatedMap = {};
    relatedRes.data?.forEach(rel => {
      if (!relatedMap[rel.sense_id]) relatedMap[rel.sense_id] = [];
      relatedMap[rel.sense_id].push({ word: rel.word, translation: rel.translation });
    });

    // 4. Group senses by lemma_id
    const sensesByLemma = {};
    senses.forEach(s => {
      if (!sensesByLemma[s.lemma_id]) sensesByLemma[s.lemma_id] = [];
      sensesByLemma[s.lemma_id].push({
        pos: s.pos,
        translation: s.translation,
        topic: s.topic,
        grammar: s.grammar || {},
        examples: examplesMap[s.id] || [],
        related: relatedMap[s.id] || []
      });
    });

    // 5. Get forms
    const { data: forms, error: formsErr } = await supabase
      .from('forms')
      .select('lemma_id, form')
      .in('lemma_id', lemmaIds);
    if (formsErr) throw formsErr;

    const formsByLemma = {};
    forms.forEach(f => {
      if (!formsByLemma[f.lemma_id]) formsByLemma[f.lemma_id] = [];
      formsByLemma[f.lemma_id].push(f.form);
    });

    // 6. Build full entries
    const fullEntries = lemmas.map(lemma => ({
      lemma: lemma.canonical,
      canonical: lemma.canonical,
      pronunciation: lemma.pronunciation || '',
      cefr: lemma.cefr,
      forms: formsByLemma[lemma.id] || [],
      senses: sensesByLemma[lemma.id] || []
    })).filter(entry => entry.senses.length > 0);

    allLemmasCache = fullEntries;
    return fullEntries;
  } catch (err) {
    console.error('Failed to fetch full dictionary:', err);
    return [];
  }
}

async function fetchAllLemmas() {
  const entries = await fetchFullDictionary();
  return entries.map(e => e.lemma);
}

async function fetchAllEntriesWithForms() {
  const entries = await fetchFullDictionary();
  return entries.map(e => ({ lemma: e.lemma, forms: e.forms }));
}

// ===========================
// Rendering
// ===========================
function renderEntry(lemma, entry) {
  const isHeadwordKyrgyz = isKyrgyz(lemma);
  let sensesHtml = '';

  const renderSense = (sense, index = null) => {
    const transClass = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
    let tags = '';
    if (sense.pos) tags += `<button class="pos" onclick="showFilterList('pos', '${escapeHtml(sense.pos)}')">${escapeHtml(sense.pos)}</button>`;
    if (sense.topic) tags += `<button class="topic-tag" onclick="showFilterList('topic', '${escapeHtml(sense.topic)}')">${escapeHtml(sense.topic)}</button>`;

    const examples = sense.examples.map(ex => `
      <li class="example-item">
        <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
        <span class="example-translation">${escapeHtml(ex.en)}</span>
      </li>
    `).join('');

    let grammar = '';
    if (Object.keys(sense.grammar).length > 0) {
      grammar = `<ul class="grammar-list">`;
      for (let key in sense.grammar) {
        grammar += `<li class="grammar-item"><span class="grammar-label">${escapeHtml(key)}:</span> ${escapeHtml(sense.grammar[key])}</li>`;
      }
      grammar += `</ul>`;
    }

    const related = (sense.related || []).map(item => `
      <div class="related-item">
        <span class="related-word linkable" data-word="${escapeHtml(item.word)}">${escapeHtml(item.word)}</span>
        <div class="related-translation">${escapeHtml(item.translation)}</div>
      </div>
    `).join('');

    return `
      <div class="sense-item">
        ${index !== null ? `<span class="sense-number">${index + 1}.</span>` : ''}
        <div class="tags-container">${tags}</div>
        <div class="translation ${transClass}">${escapeHtml(sense.translation)}</div>
        <div class="section-title">Examples</div>
        <ul class="examples-list">${examples}</ul>
        <div class="section-title">Grammar</div>
        ${grammar}
        <div class="section-title">Related</div>
        <div class="related-list">${related}</div>
      </div>
    `;
  };

  if (entry.senses.length > 1) {
    sensesHtml = entry.senses.map((s, i) => renderSense(s, i)).join('');
  } else {
    sensesHtml = renderSense(entry.senses[0]);
  }

  let cefrTag = '';
  if (entry.cefr) {
    cefrTag = `<div class="tags-container" style="position:absolute; right:0; top:0;">
      <button class="level-tag" onclick="showFilterList('cefr', '${escapeHtml(entry.cefr)}')">${escapeHtml(entry.cefr).toUpperCase()}</button>
    </div>`;
  }

  return `
    <div class="entry" style="position:relative;">
      ${cefrTag}
      <div class="headword ${isHeadwordKyrgyz ? 'kyrgyz' : ''}">${escapeHtml(entry.canonical)}</div>
      <div class="pronunciation">${escapeHtml(entry.pronunciation)}</div>
      ${sensesHtml}
    </div>
  `;
}

// ===========================
// Filtering (FULLY RESTORED)
// ===========================
async function showFilterList(filterType, value) {
  const entries = await fetchFullDictionary();

  let titleText = '';
  if (filterType === 'pos') titleText = `${value.charAt(0).toUpperCase() + value.slice(1)}s`;
  else if (filterType === 'cefr') titleText = `CEFR Level ${value.toUpperCase()}`;
  else if (filterType === 'topic') titleText = `${value.charAt(0).toUpperCase() + value.slice(1)} Words`;
  else titleText = 'Filtered Results';

  modalTitle.textContent = titleText;

  const filteredLemmas = [];
  entries.forEach(entry => {
    entry.senses.forEach(sense => {
      let match = false;
      if (filterType === 'pos' && sense.pos === value) match = true;
      else if (filterType === 'cefr' && entry.cefr === value) match = true;
      else if (filterType === 'topic' && sense.topic === value) match = true;
      if (match && !filteredLemmas.includes(entry.lemma)) {
        filteredLemmas.push(entry.lemma);
      }
    });
  });

  if (filteredLemmas.length === 0) {
    modalBody.innerHTML = `<p>No words found for this filter.</p>`;
  } else {
    let html = `<ul class="filter-word-list">`;
    filteredLemmas.forEach(w => {
      html += `<li class="filter-word-item kyrgyz" data-word="${w}">${w}</li>`;
    });
    html += `</ul>`;
    modalBody.innerHTML = html;
  }

  filterModal.style.display = 'block';
  attachEventListeners();
}

// ===========================
// Search & UI
// ===========================
function attachEventListeners() {
  document.querySelectorAll('.related-word.linkable').forEach(el => {
    el.onclick = () => {
      searchInput.value = el.dataset.word;
      showResult(el.dataset.word);
    };
  });
  document.querySelectorAll('.filter-word-item').forEach(el => {
    el.onclick = () => {
      searchInput.value = el.dataset.word;
      showResult(el.dataset.word);
      filterModal.style.display = 'none';
    };
  });
}

async function showResult(query) {
  const q = query.trim();
  if (!q) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    return;
  }

  const lowerQ = q.toLowerCase();
  const isKg = isKyrgyz(q);
  resultsContainer.innerHTML = '<div class="no-result">Searching…</div>';

  const entries = await fetchFullDictionary();

  if (isKg) {
    // Exact lemma
    let match = entries.find(e => e.lemma === q);
    if (match) {
      resultsContainer.innerHTML = renderEntry(q, match);
      attachEventListeners();
      return;
    }

    // By form
    match = entries.find(e => e.forms.some(f => f.toLowerCase() === lowerQ));
    if (match) {
      resultsContainer.innerHTML = renderEntry(match.lemma, match);
      attachEventListeners();
      return;
    }

    resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(q)}"</div>`;
  } else {
    // Search by translation
    const matches = [];
    entries.forEach(e => {
      e.senses.forEach(s => {
        if (s.translation.toLowerCase() === lowerQ) {
          if (!matches.includes(e.lemma)) matches.push(e.lemma);
        }
      });
    });

    if (matches.length === 1) {
      const entry = entries.find(e => e.lemma === matches[0]);
      resultsContainer.innerHTML = entry ? renderEntry(matches[0], entry) : `<div class="no-result">Entry missing.</div>`;
    } else if (matches.length > 1) {
      let html = `<div class="no-result"><p>Multiple words for "${escapeHtml(q)}":</p><ul class="filter-word-list">`;
      matches.forEach(w => html += `<li class="filter-word-item kyrgyz" data-word="${w}">${w}</li>`);
      html += `</ul></div>`;
      resultsContainer.innerHTML = html;
    } else {
      resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(q)}"</div>`;
    }
    attachEventListeners();
  }
}

// ===========================
// Exercise
// ===========================
async function generateExercise() {
  const entries = await fetchFullDictionary();
  if (entries.length < 4) return;

  const correct = entries[Math.floor(Math.random() * entries.length)];
  const sense = correct.senses[0];
  const answer = sense.translation;

  const others = entries.filter(e => e.lemma !== correct.lemma);
  const distractors = [];
  while (distractors.length < 3 && others.length > 0) {
    const r = others.splice(Math.floor(Math.random() * others.length), 1)[0];
    const t = r.senses[0]?.translation;
    if (t && t !== answer && !distractors.includes(t)) {
      distractors.push(t);
    }
  }

  if (distractors.length < 3) return; // skip if not enough

  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
  const optsHtml = options.map(o => `<div class="answer-option" data-answer="${o}">${escapeHtml(o)}</div>`).join('');

  const body = exerciseModal.querySelector('.modal-body');
  body.innerHTML = `
    <div class="exercise-question">What's the English word for <span class="kyrgyz">${escapeHtml(correct.lemma)}</span>?</div>
    <div class="answer-options">${optsHtml}</div>
    <div class="exercise-feedback" style="display:none;"></div>
    <div class="exercise-buttons">
      <button class="exercise-btn-modal next-btn">Next Question</button>
      <button class="exercise-btn-modal close-btn">Close</button>
    </div>
  `;

  exerciseModal.style.display = 'block';

  body.querySelectorAll('.answer-option').forEach(opt => {
    opt.onclick = () => {
      body.querySelectorAll('.answer-option').forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
      opt.classList.add('selected');
      const isCorrect = opt.textContent.trim() === answer;
      if (isCorrect) {
        opt.classList.add('correct');
      } else {
        opt.classList.add('incorrect');
        body.querySelectorAll('.answer-option').forEach(o => {
          if (o.textContent.trim() === answer) o.classList.add('correct');
        });
      }
      const fb = body.querySelector('.exercise-feedback');
      fb.style.display = 'block';
      fb.innerHTML = isCorrect
        ? `<h4>Correct!</h4><p>Well done!</p>`
        : `<h4>Incorrect</h4><p>The correct answer is: <strong>${escapeHtml(answer)}</strong></p>`;

      body.querySelector('.next-btn').onclick = generateExercise;
    };
  });

  body.querySelector('.close-btn').onclick = () => exerciseModal.style.display = 'none';
}

// ===========================
// Event Listeners
// ===========================
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => showResult(e.target.value), 300);
});

title.onclick = () => { searchInput.value = ''; showResult(''); };
randomBtn.onclick = async () => {
  const lemmas = await fetchAllLemmas();
  if (lemmas.length === 0) return;
  const w = lemmas[Math.floor(Math.random() * lemmas.length)];
  searchInput.value = w;
  showResult(w);
};
exerciseBtn.onclick = generateExercise;
closeModal.onclick = () => filterModal.style.display = 'none';
closeExerciseModal.onclick = () => exerciseModal.style.display = 'none';

keyboardToggleBtn.onclick = () => {
  const hidden = virtualKeyboard.style.display === 'none';
  virtualKeyboard.style.display = hidden ? 'block' : 'none';
  keyboardToggleBtn.textContent = hidden ? 'Hide Keyboard' : 'Show Keyboard';
};

document.querySelectorAll('.key').forEach(k => {
  k.onclick = () => {
    const act = k.dataset.action;
    if (act === 'backspace') {
      searchInput.value = searchInput.value.slice(0, -1);
    } else if (act === 'space') {
      searchInput.value += ' ';
    } else {
      searchInput.value += k.textContent;
    }
    searchInput.focus();
    showResult(searchInput.value);
  };
});

window.onclick = (e) => {
  if (e.target === filterModal) filterModal.style.display = 'none';
  if (e.target === exerciseModal) exerciseModal.style.display = 'none';
};

// Optional: Preload on startup for faster interaction
document.addEventListener('DOMContentLoaded', () => {
  fetchFullDictionary(); // warm cache
});
