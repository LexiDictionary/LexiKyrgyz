const SUPABASE_URL = 'https://jvizodlmiiisubatqykg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function isKyrgyz(text) {
  return /[\u0400-\u04FF]/.test(text);
}

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
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getRandomWord() {
  const {  data, error } = await supabase
    .from('lemmas')
    .select('canonical')
    .limit(1)
    .offset(Math.floor(Math.random() * 1000));
  if (error) return null;
  return data.length ? data[0].canonical : null;
}

async function fetchAllCanonicals() {
  const {  data, error } = await supabase.from('lemmas').select('canonical');
  if (error) return [];
  return data.map(d => d.canonical);
}

async function fetchLemmaByCanonical(canonical) {
  const {  lemma, error } = await supabase
    .from('lemmas')
    .select('*')
    .eq('canonical', canonical)
    .single();
  if (error) return null;

  const {  senses, error: sensesError } = await supabase
    .from('senses')
    .select('*')
    .eq('lemma_id', lemma.id)
    .order('id', { ascending: true });
  if (sensesError) return null;

  for (const sense of senses) {
    const {  examples, error: exError } = await supabase
      .from('examples')
      .select('*')
      .eq('sense_id', sense.id);
    sense.examples = exError ? [] : examples.map(e => ({ kg: e.kg, en: e.en }));

    const {  related, error: relError } = await supabase
      .from('related')
      .select('*')
      .eq('sense_id', sense.id);
    sense.derivatives = relError ? [] : related.map(r => ({ word: r.word, translation: r.translation }));
  }

  return {
    canonical: lemma.canonical,
    pronunciation: lemma.pronunciation || '',
    topic: senses[0]?.topic || '',
    cefr: lemma.cefr || '',
    forms: [],
    senses: senses
  };
}

async function fetchLemmaByForm(form) {
  const {  formMatch, error } = await supabase
    .from('forms')
    .select('lemma_id')
    .eq('form', form)
    .single();
  if (error) return null;

  const {  lemma, error: leError } = await supabase
    .from('lemmas')
    .select('canonical')
    .eq('id', formMatch.lemma_id)
    .single();
  if (leError) return null;

  return await fetchLemmaByCanonical(lemma.canonical);
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
        const wordClass = 'derivative-word';
        return `<div class="derivative-item">
          <span class="${wordClass}">${escapeHtml(der.word)}</span>
          <div class="derivative-translation">${escapeHtml(der.translation)}</div>
        </div>`;
      }).join('');

      return `
        <div class="sense-item">
          <div class="tags-container">${tags}</div>
          <span class="sense-number">${index + 1}.</span>
          <div class="translation ${transClass}">${escapeHtml(sense.translation)}</div>
          <span class="sense-definition">${escapeHtml(sense.definition || '')}</span>
          <div class="section-title">Examples</div>
          <ul class="examples-list">${examples}</ul>
          <div class="section-title">Grammar</div>
          ${grammar}
          <div class="section-title">Related Words</div>
          <div class="related-words-list">${derivatives}</div>
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
      const wordClass = 'derivative-word';
      return `<div class="derivative-item">
        <span class="${wordClass}">${escapeHtml(der.word)}</span>
        <div class="derivative-translation">${escapeHtml(der.translation)}</div>
      </div>`;
    }).join('');

    sensesHtml = `
      <div class="sense-item">
        <div class="tags-container">${tags}</div>
        <div class="translation ${transClass}">${escapeHtml(sense.translation)}</div>
        <span class="sense-definition">${escapeHtml(sense.definition || '')}</span>
        <div class="section-title">Examples</div>
        <ul class="examples-list">${examples}</ul>
        <div class="section-title">Grammar</div>
        ${grammar}
        <div class="section-title">Related Words</div>
        <div class="related-words-list">${derivatives}</div>
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

async function showResult(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    return;
  }

  let entry = null;
  let lemma = null;

  if (isKyrgyz(q)) {
    entry = await fetchLemmaByCanonical(q);
    if (entry) {
      lemma = q;
    } else {
      entry = await fetchLemmaByForm(q);
      if (entry) {
        lemma = entry.canonical;
      }
    }
  } else {
    const {  matches, error } = await supabase
      .from('senses')
      .select('lemma_id, translation')
      .eq('translation', q);
    if (!error && matches.length > 0) {
      const lemmaIds = [...new Set(matches.map(m => m.lemma_id))];
      if (lemmaIds.length === 1) {
        const {  lemmaData, error: leErr } = await supabase
          .from('lemmas')
          .select('canonical')
          .eq('id', lemmaIds[0])
          .single();
        if (!leErr) {
          entry = await fetchLemmaByCanonical(lemmaData.canonical);
          lemma = lemmaData.canonical;
        }
      } else if (lemmaIds.length > 1) {
        const {  lemmas, error: lErr } = await supabase
          .from('lemmas')
          .select('canonical')
          .in('id', lemmaIds);
        if (!lErr) {
          let html = `<div class="no-result"><p>Multiple words for "${escapeHtml(query)}":</p><ul class="filter-word-list">`;
          lemmas.forEach(l => html += `<li class="filter-word-item kyrgyz" data-word="${l.canonical}">${l.canonical}</li>`);
          html += `</ul></div>`;
          resultsContainer.innerHTML = html;
          attachEventListeners();
          return;
        }
      }
    }
  }

  if (entry && lemma) {
    resultsContainer.innerHTML = renderEntry(lemma, entry);
  } else {
    resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(query)}"</div>`;
  }

  attachEventListeners();
}

async function generateExercise() {
  const {  data, error } = await supabase
    .from('lemmas')
    .select('canonical')
    .limit(1000);
  if (error || data.length === 0) return;

  const randomLemma = data[Math.floor(Math.random() * data.length)];
  const entry = await fetchLemmaByCanonical(randomLemma.canonical);
  if (!entry || !entry.senses?.[0]) return;

  const sense = entry.senses[0];
  const answer = sense.translation;

  const {  allTranslations, err } = await supabase
    .from('senses')
    .select('translation')
    .neq('lemma_id', entry.id)
    .limit(100);
  if (err || allTranslations.length < 3) return;

  const distractors = [];
  const shuffled = allTranslations.sort(() => 0.5 - Math.random());
  for (let t of shuffled) {
    if (t.translation !== answer) {
      distractors.push(t.translation);
      if (distractors.length === 3) break;
    }
  }

  const options = [answer, ...distractors].sort(() => Math.random() - 0.5);
  const optsHtml = options.map(o => `<div class="answer-option" data-answer="${o}">${escapeHtml(o)}</div>`).join('');

  const body = exerciseModal.querySelector('.modal-body');
  body.innerHTML = `
    <div class="exercise-question">What's the English word for <span class="kyrgyz">${randomLemma.canonical}</span>?</div>
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
  document.querySelectorAll('.filter-word-item').forEach(el => {
    el.onclick = () => {
      searchInput.value = el.dataset.word;
      showResult(el.dataset.word);
    };
  });
}

searchInput.addEventListener('input', (e) => showResult(e.target.value));
title.onclick = () => { searchInput.value = ''; showResult(''); };
randomBtn.onclick = async () => {
  const w = await getRandomWord();
  if (w) {
    searchInput.value = w;
    showResult(w);
  }
};
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

function showFilterList(type, value) {
  console.log('Filter:', type, value);
}
