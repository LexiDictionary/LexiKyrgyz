// Supabase client
const supabaseUrl = 'https://jvizodlmiiisubatqykg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// DOM Elements
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

// Cache
let allLemmasCache = null;
let allEntriesWithFormsCache = null;

// Utility: Escape HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Utility: Detect Kyrgyz (Cyrillic)
function isKyrgyz(text) {
  return /[\u0400-\u04FF]/.test(text);
}

// Fetch all lemmas with senses, examples, related, and forms
async function fetchEntryByLemma(lemma) {
  // Step 1: Get lemma
  const { data: lemmaData, error: lemmaError } = await supabase
    .from('lemmas')
    .select('id, canonical, pronunciation, cefr')
    .eq('canonical', lemma)
    .single();

  if (lemmaError || !lemmaData) return null;

  // Step 2: Get all senses for this lemma
  const { data: sensesData, error: sensesError } = await supabase
    .from('senses')
    .select('id, pos, translation, topic, grammar')
    .eq('lemma_id', lemmaData.id);

  if (sensesError || !sensesData || sensesData.length === 0) return null;

  // Step 3: Get all examples for these senses
  const senseIds = sensesData.map(s => s.id);
  const { data: examplesData } = await supabase
    .from('examples')
    .select('sense_id, kg, en')
    .in('sense_id', senseIds);

  // Step 4: Get all related for these senses
  const { data: relatedData } = await supabase
    .from('related')
    .select('sense_id, word, translation')
    .in('sense_id', senseIds);

  // Step 5: Get all forms for this lemma
  const { data: formData } = await supabase
    .from('forms')
    .select('form')
    .eq('lemma_id', lemmaData.id);

  const forms = formData ? formData.map(f => f.form) : [];

  // Group examples and related by sense_id
  const examplesMap = {};
  examplesData?.forEach(ex => {
    if (!examplesMap[ex.sense_id]) examplesMap[ex.sense_id] = [];
    examplesMap[ex.sense_id].push({ kg: ex.kg, en: ex.en });
  });

  const relatedMap = {};
  relatedData?.forEach(rel => {
    if (!relatedMap[rel.sense_id]) relatedMap[rel.sense_id] = [];
    relatedMap[rel.sense_id].push({ word: rel.word, translation: rel.translation });
  });

  // Build senses with examples and related
  const senses = sensesData.map(sense => ({
    pos: sense.pos,
    translation: sense.translation,
    topic: sense.topic,
    grammar: sense.grammar || {},
    examples: examplesMap[sense.id] || [],
    related: relatedMap[sense.id] || []
  }));

  return {
    canonical: lemmaData.canonical,
    pronunciation: lemmaData.pronunciation || '',
    cefr: lemmaData.cefr,
    forms: forms,
    senses: senses
  };
}

// Fetch minimal lemma list (for random/exercise)
async function fetchAllLemmas() {
  if (allLemmasCache) return allLemmasCache;

  const { data, error } = await supabase
    .from('lemmas')
    .select('canonical')
    .order('canonical', { ascending: true });

  if (error) {
    console.error('Failed to fetch lemmas:', error);
    return [];
  }

  allLemmasCache = data.map(r => r.canonical);
  return allLemmasCache;
}

// Fetch lemmas with forms (for inflected form lookup)
async function fetchAllEntriesWithForms() {
  if (allEntriesWithFormsCache) return allEntriesWithFormsCache;

  const { data: lemmas, error: lemmasError } = await supabase
    .from('lemmas')
    .select('id, canonical');

  if (lemmasError || !lemmas) return [];

  const lemmaIds = lemmas.map(l => l.id);
  const { data: forms, error: formsError } = await supabase
    .from('forms')
    .select('lemma_id, form')
    .in('lemma_id', lemmaIds);

  if (formsError) return [];

  // Map forms by lemma_id
  const formsByLemmaId = {};
  forms.forEach(f => {
    if (!formsByLemmaId[f.lemma_id]) formsByLemmaId[f.lemma_id] = [];
    formsByLemmaId[f.lemma_id].push(f.form);
  });

  const result = lemmas.map(l => ({
    lemma: l.canonical,
    forms: formsByLemmaId[l.id] || []
  }));

  allEntriesWithFormsCache = result;
  return result;
}

// Render entry (same as before, but now uses live data structure)
function renderEntry(lemma, entry) {
  const isHeadwordKyrgyz = isKyrgyz(lemma);
  let sensesHtml = '';

  if (entry.senses && entry.senses.length > 1) {
    sensesHtml = entry.senses.map((sense, index) => {
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

      const related = (sense.related || []).map(item => {
        // We can't easily check if related word exists without extra fetch, so assume linkable via search
        return `<div class="related-item">
          <span class="related-word linkable" data-word="${escapeHtml(item.word)}">${escapeHtml(item.word)}</span>
          <div class="related-translation">${escapeHtml(item.translation)}</div>
        </div>`;
      }).join('');

      return `
        <div class="sense-item">
          <div class="tags-container">${tags}</div>
          <span class="sense-number">${index + 1}.</span>
          <div class="translation ${transClass}">${escapeHtml(sense.translation)}</div>
          <div class="section-title">Examples</div>
          <ul class="examples-list">${examples}</ul>
          <div class="section-title">Grammar</div>
          ${grammar}
          <div class="section-title">Related</div>
          <div class="related-list">${related}</div>
        </div>
      `;
    }).join('');
  } else {
    const sense = entry.senses[0];
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

    const related = (sense.related || []).map(item => {
      return `<div class="related-item">
        <span class="related-word linkable" data-word="${escapeHtml(item.word)}">${escapeHtml(item.word)}</span>
        <div class="related-translation">${escapeHtml(item.translation)}</div>
      </div>`;
    }).join('');

    sensesHtml = `
      <div class="sense-item">
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
  }

  let cefr = '';
  if (entry.cefr) {
    cefr = `<div class="tags-container" style="position:absolute; right:0; top:0;">
      <button class="level-tag" onclick="showFilterList('cefr', '${escapeHtml(entry.cefr)}')">${escapeHtml(entry.cefr).toUpperCase()}</button>
    </div>`;
  }

  return `
    <div class="entry" style="position:relative;">
      ${cefr}
      <div class="headword ${isHeadwordKyrgyz ? 'kyrgyz' : ''}">${escapeHtml(entry.canonical)}</div>
      <div class="pronunciation">${escapeHtml(entry.pronunciation)}</div>
      ${sensesHtml}
    </div>
  `;
}

// Attach event listeners after rendering
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

// Main search function (now async)
async function showResult(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    return;
  }

  const isKg = isKyrgyz(q);
  resultsContainer.innerHTML = '<div class="no-result">Searching…</div>';

  if (isKg) {
    // 1. Try exact lemma match
    let entry = await fetchEntryByLemma(q);
    if (entry) {
      resultsContainer.innerHTML = renderEntry(q, entry);
      attachEventListeners();
      return;
    }

    // 2. Try matching inflected forms
    const allEntries = await fetchAllEntriesWithForms();
    const match = allEntries.find(e =>
      e.forms.some(form => form.toLowerCase() === q)
    );
    if (match) {
      entry = await fetchEntryByLemma(match.lemma);
      if (entry) {
        resultsContainer.innerHTML = renderEntry(match.lemma, entry);
        attachEventListeners();
        return;
      }
    }

    resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(query)}"</div>`;
  } else {
    // Search by English translation in senses
    const { data, error } = await supabase
      .from('senses')
      .select('lemma_id, translation')
      .eq('translation', query);

    if (error || !data || data.length === 0) {
      resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(query)}"</div>`;
      return;
    }

    // Get unique lemma_ids
    const lemmaIds = [...new Set(data.map(d => d.lemma_id))];
    const { data: lemmaData } = await supabase
      .from('lemmas')
      .select('canonical')
      .in('id', lemmaIds);

    const lemmas = lemmaData.map(l => l.canonical);
    if (lemmas.length === 1) {
      const entry = await fetchEntryByLemma(lemmas[0]);
      resultsContainer.innerHTML = entry ? renderEntry(lemmas[0], entry) : `<div class="no-result">Entry not found.</div>`;
    } else {
      let html = `<div class="no-result"><p>Multiple words for "${escapeHtml(query)}":</p><ul class="filter-word-list">`;
      lemmas.forEach(w => html += `<li class="filter-word-item kyrgyz" data-word="${w}">${w}</li>`);
      html += `</ul></div>`;
      resultsContainer.innerHTML = html;
    }
    attachEventListeners();
  }
}

// Filter modal (simplified — would need full re-implementation for live filters)
// For now, we disable filtering or implement later. Let’s keep it minimal.
function showFilterList(filterType, value) {
  alert(`Filter by ${filterType} = ${value} is not yet implemented with live data.`);
}

// Exercise generator
async function generateExercise() {
  const lemmas = await fetchAllLemmas();
  if (lemmas.length < 4) {
    alert('Not enough words for exercise.');
    return;
  }

  const correctLemma = lemmas[Math.floor(Math.random() * lemmas.length)];
  const entry = await fetchEntryByLemma(correctLemma);
  if (!entry || !entry.senses || entry.senses.length === 0) return;

  const correctSense = entry.senses[0];
  const answer = correctSense.translation;

  // Get 3 random wrong translations
  const otherLemmas = lemmas.filter(l => l !== correctLemma).slice(0, 50); // limit for perf
  const distractors = [];
  while (distractors.length < 3 && otherLemmas.length > 0) {
    const randLemma = otherLemmas.splice(Math.floor(Math.random() * otherLemmas.length), 1)[0];
    const e = await fetchEntryByLemma(randLemma);
    if (e?.senses?.[0]?.translation) {
      const tr = e.senses[0].translation;
      if (tr !== answer && !distractors.includes(tr)) {
        distractors.push(tr);
      }
    }
  }

  if (distractors.length < 3) {
    // Fallback: use static distractors if needed
    const fallback = ['book', 'house', 'car', 'tree', 'river', 'sky'];
    while (distractors.length < 3) {
      const f = fallback[Math.floor(Math.random() * fallback.length)];
      if (f !== answer && !distractors.includes(f)) distractors.push(f);
    }
  }

  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
  const optsHtml = options.map(o => `<div class="answer-option" data-answer="${o}">${escapeHtml(o)}</div>`).join('');

  const body = exerciseModal.querySelector('.modal-body');
  body.innerHTML = `
    <div class="exercise-question">What's the English word for <span class="kyrgyz">${escapeHtml(correctLemma)}</span>?</div>
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

  body.querySelector('.close-btn').onclick = () => {
    exerciseModal.style.display = 'none';
  };
}

// Event Listeners
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
