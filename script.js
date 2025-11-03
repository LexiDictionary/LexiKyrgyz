const supabaseUrl = 'https://jvizodlmiiisubatqykg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

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

let dictionary = { kg: {} };
let dictionaryLoaded = false;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isKyrgyz(text) {
  return /[\u0400-\u04FF]/.test(text);
}

async function loadDictionary() {
  if (dictionaryLoaded) return;
  const { data: lemmas, error: lemmasError } = await supabase.from('lemmas').select('id, canonical, pronunciation, cefr');
  if (lemmasError || !lemmas) return;

  const lemmaById = {};
  const canonicalToEntry = {};
  lemmas.forEach(l => {
    const entry = {
      canonical: l.canonical,
      pronunciation: l.pronunciation || '',
      cefr: l.cefr,
      forms: [],
      senses: []
    };
    lemmaById[l.id] = entry;
    canonicalToEntry[l.canonical] = entry;
  });

  const lemmaIds = lemmas.map(l => l.id);
  const { data: forms } = await supabase.from('forms').select('lemma_id, form').in('lemma_id', lemmaIds);
  if (forms) {
    forms.forEach(f => {
      if (lemmaById[f.lemma_id]) {
        lemmaById[f.lemma_id].forms.push(f.form);
      }
    });
  }

  const { data: senses, error: sensesError } = await supabase.from('senses').select('id, lemma_id, pos, translation, topic, grammar');
  if (sensesError || !senses) return;

  const senseById = {};
  senses.forEach(s => {
    if (lemmaById[s.lemma_id]) {
      const sense = {
        pos: s.pos,
        translation: s.translation,
        topic: s.topic,
        grammar: s.grammar || {},
        examples: [],
        related: []
      };
      senseById[s.id] = sense;
      lemmaById[s.lemma_id].senses.push(sense);
    }
  });

  const senseIds = senses.map(s => s.id);
  const { data: examples } = await supabase.from('examples').select('sense_id, kg, en').in('sense_id', senseIds);
  if (examples) {
    examples.forEach(ex => {
      if (senseById[ex.sense_id]) {
        senseById[ex.sense_id].examples.push({ kg: ex.kg, en: ex.en });
      }
    });
  }

  const { data: related } = await supabase.from('related').select('sense_id, word, translation').in('sense_id', senseIds);
  if (related) {
    related.forEach(r => {
      if (senseById[r.sense_id]) {
        senseById[r.sense_id].related.push({ word: r.word, translation: r.translation });
      }
    });
  }

  dictionary = { kg: canonicalToEntry };
  dictionaryLoaded = true;
}

function hasLemma(word) {
  return !!dictionary.kg[word];
}

function renderEntry(lemma, entry) {
  const isHeadwordKyrgyz = isKyrgyz(lemma);
  let sensesHtml = '';

  if (entry.senses && entry.senses.length > 1) {
    sensesHtml = entry.senses.map((sense, index) => {
      const transClass = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
      let tags = '';
      if (sense.pos) tags += `<button class="pos" onclick="showFilterList('pos', '${escapeHtml(sense.pos)}')">${escapeHtml(sense.pos)}</button>`;
      const topic = sense.topic || entry.topic;
      if (topic) tags += `<button class="topic-tag" onclick="showFilterList('topic', '${escapeHtml(topic)}')">${escapeHtml(topic)}</button>`;

      const examples = sense.examples.map(ex => `
        <li class="example-item">
          <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
          <span class="example-translation">${escapeHtml(ex.en)}</span>
        </li>
      `).join('');

      let grammar = '';
      if (sense.grammar && Object.keys(sense.grammar).length > 0) {
        grammar = `<ul class="grammar-list">`;
        for (let key in sense.grammar) {
          grammar += `<li class="grammar-item"><span class="grammar-label">${escapeHtml(key)}:</span> ${escapeHtml(sense.grammar[key])}</li>`;
        }
        grammar += `</ul>`;
      }

      const related = (sense.related || []).map(item => {
        const has = hasLemma(item.word);
        const wordClass = has ? 'related-word linkable' : 'related-word';
        return `<div class="related-item">
          <span class="${wordClass}" ${has ? `data-word="${escapeHtml(item.word)}"` : ''}>${escapeHtml(item.word)}</span>
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
    const sense = entry.senses ? entry.senses[0] : entry;
    const transClass = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
    let tags = '';
    if (sense.pos) tags += `<button class="pos" onclick="showFilterList('pos', '${escapeHtml(sense.pos)}')">${escapeHtml(sense.pos)}</button>`;
    const topic = sense.topic || entry.topic;
    if (topic) tags += `<button class="topic-tag" onclick="showFilterList('topic', '${escapeHtml(topic)}')">${escapeHtml(topic)}</button>`;

    const examples = sense.examples.map(ex => `
      <li class="example-item">
        <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
        <span class="example-translation">${escapeHtml(ex.en)}</span>
      </li>
    `).join('');

    let grammar = '';
    if (sense.grammar && Object.keys(sense.grammar).length > 0) {
      grammar = `<ul class="grammar-list">`;
      for (let key in sense.grammar) {
        grammar += `<li class="grammar-item"><span class="grammar-label">${escapeHtml(key)}:</span> ${escapeHtml(sense.grammar[key])}</li>`;
      }
      grammar += `</ul>`;
    }

    const related = (sense.related || []).map(item => {
      const has = hasLemma(item.word);
      const wordClass = has ? 'related-word linkable' : 'related-word';
      return `<div class="related-item">
        <span class="${wordClass}" ${has ? `data-word="${escapeHtml(item.word)}"` : ''}>${escapeHtml(item.word)}</span>
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

async function showResult(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    attachEventListeners();
    return;
  }

  if (!dictionaryLoaded) {
    resultsContainer.innerHTML = '<div class="no-result">Loading dictionary…</div>';
    await loadDictionary();
  }

  const isKg = isKyrgyz(q);
  let found = false;

  if (isKg) {
    if (dictionary.kg[q]) {
      resultsContainer.innerHTML = renderEntry(q, dictionary.kg[q]);
      found = true;
    } else {
      for (let w in dictionary.kg) {
        if (dictionary.kg[w].forms && dictionary.kg[w].forms.map(f => f.toLowerCase()).includes(q)) {
          resultsContainer.innerHTML = renderEntry(w, dictionary.kg[w]);
          found = true;
          break;
        }
      }
    }
  } else {
    const matches = [];
    for (let w in dictionary.kg) {
      (dictionary.kg[w].senses || [dictionary.kg[w]]).forEach(s => {
        if (s.translation.toLowerCase() === q) matches.push(w);
      });
    }
    if (matches.length === 1) {
      resultsContainer.innerHTML = renderEntry(matches[0], dictionary.kg[matches[0]]);
      found = true;
    } else if (matches.length > 1) {
      let html = `<div class="no-result"><p>Multiple words for "${escapeHtml(query)}":</p><ul class="filter-word-list">`;
      matches.forEach(w => html += `<li class="filter-word-item kyrgyz" data-word="${w}">${w}</li>`);
      html += `</ul></div>`;
      resultsContainer.innerHTML = html;
      found = true;
    }
  }

  if (!found) {
    resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(query)}"</div>`;
  }

  attachEventListeners();
}

function showFilterList(filterType, value) {
  let titleText = '';
  if (filterType === 'pos') titleText = `${value.charAt(0).toUpperCase() + value.slice(1)}s`;
  else if (filterType === 'cefr') titleText = `CEFR Level ${value.toUpperCase()}`;
  else if (filterType === 'topic') titleText = `${value.charAt(0).toUpperCase() + value.slice(1)} Words`;
  else titleText = 'Filtered Results';

  modalTitle.textContent = titleText;

  const filteredWords = [];
  for (const [lemma, entry] of Object.entries(dictionary.kg)) {
    const senses = entry.senses || [entry];
    for (const sense of senses) {
      let match = false;
      if (filterType === 'pos' && sense.pos === value) match = true;
      else if (filterType === 'cefr' && entry.cefr === value) match = true;
      else if (filterType === 'topic') {
        const topic = sense.topic || entry.topic;
        if (topic === value) match = true;
      }
      if (match) {
        filteredWords.push(lemma);
        break;
      }
    }
  }

  if (filteredWords.length === 0) {
    modalBody.innerHTML = `<p>No words found for this filter.</p>`;
  } else {
    let html = `<ul class="filter-word-list">`;
    filteredWords.forEach(w => {
      html += `<li class="filter-word-item kyrgyz" data-word="${w}">${w}</li>`;
    });
    html += `</ul>`;
    modalBody.innerHTML = html;
  }

  filterModal.style.display = 'block';
  attachEventListeners();
}

function getRandomWord() {
  const words = Object.keys(dictionary.kg);
  return words[Math.floor(Math.random() * words.length)];
}

function generateExercise() {
  if (Object.keys(dictionary.kg).length === 0) return;
  const words = Object.keys(dictionary.kg);
  const correct = words[Math.floor(Math.random() * words.length)];
  const sense = dictionary.kg[correct].senses ? dictionary.kg[correct].senses[0] : dictionary.kg[correct];
  const answer = sense.translation;

  const distractors = [];
  while (distractors.length < 3) {
    const r = words[Math.floor(Math.random() * words.length)];
    if (r === correct) continue;
    const rs = dictionary.kg[r].senses ? dictionary.kg[r].senses[0] : dictionary.kg[r];
    if (!distractors.includes(rs.translation)) distractors.push(rs.translation);
  }

  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
  const optsHtml = options.map(o => `<div class="answer-option" data-answer="${o}">${escapeHtml(o)}</div>`).join('');

  const body = exerciseModal.querySelector('.modal-body');
  body.innerHTML = `
    <div class="exercise-question">What's the English word for <span class="kyrgyz">${correct}</span>?</div>
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

  closeExerciseModal.onclick = () => {
    exerciseModal.style.display = 'none';
  };
}

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

searchInput.addEventListener('input', () => showResult(searchInput.value));
title.onclick = () => { searchInput.value = ''; showResult(''); };
randomBtn.onclick = () => { if (dictionaryLoaded) { const w = getRandomWord(); searchInput.value = w; showResult(w); } };
exerciseBtn.onclick = () => { if (dictionaryLoaded) generateExercise(); else loadDictionary().then(generateExercise); };
closeModal.onclick = () => filterModal.style.display = 'none';

keyboardToggleBtn.onclick = () => {
  const hidden = virtualKeyboard.style.display === 'none';
  virtualKeyboard.style.display = hidden ? 'block' : 'none';
  keyboardToggleBtn.textContent = hidden ? 'Hide Keyboard' : 'Show Keyboard';
};

document.querySelectorAll('.key').forEach(k => {
  k.onclick = () => {
    const act = k.dataset.action;
    if (act === 'backspace') searchInput.value = searchInput.value.slice(0, -1);
    else if (act === 'space') searchInput.value += ' ';
    else searchInput.value += k.textContent;
    searchInput.focus();
    showResult(searchInput.value);
  };
});

window.onclick = (e) => {
  if (e.target === filterModal) filterModal.style.display = 'none';
  if (e.target === exerciseModal) exerciseModal.style.display = 'none';
};

loadDictionary();
