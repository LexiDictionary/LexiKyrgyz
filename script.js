function isKyrgyz(text) {
  return /[\u0400-\u04FF]/.test(text);
}

const dictionary = {
  kg: {
    "алма": {
      canonical: "алма",
      pronunciation: "/alma/",
      topic: "food",
      cefr: "A1",
      forms: ["алма", "алманы", "алмалар"],
      senses: [
        {
          pos: "noun",
          definition: "round fruit with red or green skin",
          translation: "apple",
          examples: [
            { en: "I ate an apple.", kg: "Мен алма жедим." },
            { en: "Apples are sweet.", kg: "Алма таттуу." }
          ],
          derivatives: [
            { word: "алма шырыбы", translation: "apple juice" },
            { word: "алма дарагы", translation: "apple tree" }
          ],
          grammar: {
            accusative: "алманы",
            plural: "алмалар"
          }
        }
      ]
    },
    "от": {
      canonical: "от",
      pronunciation: "/ot/",
      topic: "nature",
      cefr: "A1",
      forms: ["от", "отту", "оттор"],
      senses: [
        {
          pos: "noun",
          definition: "burning material",
          translation: "fire",
          examples: [
            { en: "The fire is warm.", kg: "От жылы." },
            { en: "Don't touch the fire.", kg: "Отту тийбейли." }
          ],
          derivatives: [
            { word: "от дөлө", translation: "flame" },
            { word: "от коргоочу", translation: "firefighter" }
          ],
          grammar: {
            accusative: "отту",
            plural: "оттор"
          }
        }
      ]
    },
    "кол": {
      canonical: "кол",
      pronunciation: "/kol/",
      topic: "body",
      cefr: "A1",
      forms: ["кол", "колду", "колдор"],
      senses: [
        {
          pos: "noun",
          definition: "part of the body at the end of the arm",
          translation: "hand",
          examples: [
            { en: "Wash your hands.", kg: "Колуңузду жууңуз." },
            { en: "He shook my hand.", kg: "Ал менин колумду кысты." }
          ],
          derivatives: [
            { word: "кол саат", translation: "wristwatch" },
            { word: "кол кап", translation: "glove" }
          ],
          grammar: {
            accusative: "колду",
            plural: "колдор"
          }
        },
        {
          pos: "noun",
          definition: "large natural stream of water",
          translation: "river",
          examples: [
            { en: "The river is wide.", kg: "Дарыя кенен." },
            { en: "We swam in the river.", kg: "Биз дарыяда сүзүп жүрөбүз." }
          ],
          derivatives: [
            { word: "дарыя жээги", translation: "riverbank" }
          ],
          grammar: {
            accusative: "колду",
            plural: "колдор"
          }
        }
      ]
    },
    "суу": {
      canonical: "суу",
      pronunciation: "/suu/",
      topic: "nature",
      cefr: "A1",
      forms: ["суу", "сууну", "сулар"],
      senses: [
        {
          pos: "noun",
          definition: "clear liquid",
          translation: "water",
          examples: [
            { en: "Water is essential.", kg: "Суу зарыл." },
            { en: "I drink water daily.", kg: "Мен күн сайын суу ичем." }
          ],
          derivatives: [
            { word: "суу сактагыч", translation: "water container" },
            { word: "суулуу", translation: "watery" }
          ],
          grammar: {
            accusative: "сууну",
            plural: "сулар"
          }
        }
      ]
    }
  }
};

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const title = document.getElementById('title');
const randomBtn = document.getElementById('randomBtn');
const exerciseBtn = document.getElementById('exerciseBtn');
const filterModal = document.getElementById('filterModal');
const closeModal = document.getElementById('closeModal');
const exerciseModal = document.getElementById('exerciseModal');
const closeExerciseModal = document.getElementById('closeExerciseModal');
const virtualKeyboard = document.getElementById('virtualKeyboard');
const keyboardToggleBtn = document.getElementById('keyboardToggleBtn');

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRandomWord() {
  const words = Object.keys(dictionary.kg);
  return words[Math.floor(Math.random() * words.length)];
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
      if (sense.pos) tags += `<button class="pos" onclick="showFilterList('pos', '${sense.pos}')">${sense.pos}</button>`;
      if (sense.topic) tags += `<button class="topic-tag" onclick="showFilterList('topic', '${sense.topic}')">${sense.topic}</button>`;

      const examples = sense.examples.map(ex => `
        <li class="example-item">
          <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
          <span class="example-translation">${escapeHtml(ex.en)}</span>
        </li>
      `).join('');

      let grammar = '';
      if (sense.grammar) {
        grammar = `<ul class="grammar-list">`;
        for (let key in sense.grammar) {
          grammar += `<li class="grammar-item"><span class="grammar-label">${key}:</span> ${escapeHtml(sense.grammar[key])}</li>`;
        }
        grammar += `</ul>`;
      }

      const derivatives = sense.derivatives.map(der => {
        const has = hasLemma(der.word);
        const wordClass = has ? 'derivative-word linkable' : 'derivative-word';
        return `<div class="derivative-item">
          <span class="${wordClass}" ${has ? `data-word="${der.word}"` : ''}>${escapeHtml(der.word)}</span>
          <div class="derivative-translation">${escapeHtml(der.translation)}</div>
        </div>`;
      }).join('');

      return `
        <div class="sense-item">
          <div class="tags-container">${tags}</div>
          <span class="sense-number">${index + 1}.</span>
          <div class="translation ${transClass}">${escapeHtml(sense.translation)}</div>
          <span class="sense-definition">${escapeHtml(sense.definition)}</span>
          <div class="section-title">Examples</div>
          <ul class="examples-list">${examples}</ul>
          <div class="section-title">Grammar</div>
          ${grammar}
          <div class="section-title">Derivatives</div>
          <div class="derivatives-list">${derivatives}</div>
        </div>
      `;
    }).join('');
  } else {
    const sense = entry.senses ? entry.senses[0] : entry;
    const transClass = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
    let tags = '';
    if (sense.pos) tags += `<button class="pos" onclick="showFilterList('pos', '${sense.pos}')">${sense.pos}</button>`;
    if (sense.topic) tags += `<button class="topic-tag" onclick="showFilterList('topic', '${sense.topic}')">${sense.topic}</button>`;

    const examples = sense.examples.map(ex => `
      <li class="example-item">
        <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
        <span class="example-translation">${escapeHtml(ex.en)}</span>
      </li>
    `).join('');

    let grammar = '';
    if (sense.grammar) {
      grammar = `<ul class="grammar-list">`;
      for (let key in sense.grammar) {
        grammar += `<li class="grammar-item"><span class="grammar-label">${key}:</span> ${escapeHtml(sense.grammar[key])}</li>`;
      }
      grammar += `</ul>`;
    }

    const derivatives = sense.derivatives.map(der => {
      const has = hasLemma(der.word);
      const wordClass = has ? 'derivative-word linkable' : 'derivative-word';
      return `<div class="derivative-item">
        <span class="${wordClass}" ${has ? `data-word="${der.word}"` : ''}>${escapeHtml(der.word)}</span>
        <div class="derivative-translation">${escapeHtml(der.translation)}</div>
      </div>`;
    }).join('');

    sensesHtml = `
      <div class="sense-item">
        <div class="tags-container">${tags}</div>
        <div class="translation ${transClass}">${escapeHtml(sense.translation)}</div>
        <span class="sense-definition">${escapeHtml(sense.definition)}</span>
        <div class="section-title">Examples</div>
        <ul class="examples-list">${examples}</ul>
        <div class="section-title">Grammar</div>
        ${grammar}
        <div class="section-title">Derivatives</div>
        <div class="derivatives-list">${derivatives}</div>
      </div>
    `;
  }

  let cefr = '';
  if (entry.cefr) {
    cefr = `<div class="tags-container" style="position:absolute; right:0; top:0;">
      <button class="level-tag" onclick="showFilterList('cefr', '${entry.cefr}')">${entry.cefr.toUpperCase()}</button>
    </div>`;
  }

  return `
    <div class="entry" style="position:relative;">
      ${cefr}
      <div class="headword ${isHeadwordKyrgyz ? 'kyrgyz' : ''}">${escapeHtml(entry.canonical)}</div>
      <div class="pronunciation">${escapeHtml(entry.pronunciation)}</div>
      <div class="frequency-placeholder">Frequency: top 1000</div>
      ${sensesHtml}
    </div>
  `;
}

function showResult(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    return;
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

function generateExercise() {
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

  // "Close" button closes modal
  body.querySelector('.close-btn').onclick = () => {
    exerciseModal.style.display = 'none';
  };

  // "X" also closes
  closeExerciseModal.onclick = () => {
    exerciseModal.style.display = 'none';
  };
}

function attachEventListeners() {
  document.querySelectorAll('.derivative-word.linkable').forEach(el => {
    el.onclick = () => {
      searchInput.value = el.dataset.word;
      showResult(el.dataset.word);
    };
  });
  document.querySelectorAll('.goto-lemma-btn, .filter-word-item').forEach(el => {
    el.onclick = () => {
      searchInput.value = el.dataset.word;
      showResult(el.dataset.word);
    };
  });
}

searchInput.addEventListener('input', () => showResult(searchInput.value));
title.onclick = () => { searchInput.value = ''; showResult(''); };
randomBtn.onclick = () => { const w = getRandomWord(); searchInput.value = w; showResult(w); };
exerciseBtn.onclick = generateExercise;
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