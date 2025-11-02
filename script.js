const SUPABASE_URL = 'https://jvizodlmiiisubatqykg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const $  = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const searchInput        = $('#searchInput');
  const resultsContainer   = $('#resultsContainer');
  const title              = $('#title');
  const randomBtn          = $('#randomBtn');
  const exerciseBtn        = $('#exerciseBtn');
  const filterModal        = $('#filterModal');
  const closeModal         = $('#closeModal');
  const exerciseModal      = $('#exerciseModal');
  const closeExerciseModal = $('#closeExerciseModal');
  const virtualKeyboard    = $('#virtualKeyboard');
  const keyboardToggleBtn  = $('#keyboardToggleBtn');
  const aboutSection       = $('#aboutSection');

  const escapeHtml = unsafe => unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const isKyrgyz = text => /[\u0400-\u04FF]/.test(text);

  const getRandomWord = async () => {
    const { data, error } = await supabase
      .from('lemmas')
      .select('canonical')
      .limit(1)
      .offset(Math.floor(Math.random() * 1000));
    if (error) { console.error(error); return null; }
    return data?.[0]?.canonical ?? null;
  };

  const fetchLemmaByCanonical = async canonical => {
    const { data: lemma, error: e1 } = await supabase
      .from('lemmas')
      .select('*')
      .eq('canonical', canonical)
      .single();
    if (e1 || !lemma) return null;

    const { data: senses, error: e2 } = await supabase
      .from('senses')
      .select('*')
      .eq('lemma_id', lemma.id)
      .order('id');
    if (e2) senses = [];

    for (const sense of senses) {
      const { data: examples } = await supabase
        .from('examples')
        .select('*')
        .eq('sense_id', sense.id);
      sense.examples = examples || [];

      const { data: related } = await supabase
        .from('related')
        .select('word,translation')
        .eq('sense_id', sense.id);
      sense.related = related || [];
    }

    return {
      canonical: lemma.canonical,
      pronunciation: lemma.pronunciation || '',
      topic: senses[0]?.topic || '',
      cefr: lemma.cefr || '',
      senses
    };
  };

  const fetchLemmaByForm = async form => {
    const { data: row, error } = await supabase
      .from('forms')
      .select('lemma_id')
      .eq('form', form)
      .single();
    if (error || !row) return null;

    const { data: lemma } = await supabase
      .from('lemmas')
      .select('canonical')
      .eq('id', row.lemma_id)
      .single();
    if (!lemma) return null;

    return await fetchLemmaByCanonical(lemma.canonical);
  };

  const renderEntry = (headword, entry) => {
    const kyrgyzHead = isKyrgyz(headword) ? 'kyrgyz' : '';

    const senseHtml = entry.senses.map((sense, i) => {
      const transCls = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
      let tags = '';
      if (sense.pos)   tags += `<button type="button" class="pos" data-filter="pos" data-value="${sense.pos}">${sense.pos}</button>`;
      if (sense.topic) tags += `<button type="button" class="topic-tag" data-filter="topic" data-value="${sense.topic}">${sense.topic}</button>`;

      const examples = (sense.examples || []).map(ex => `
        <li class="example-item">
          <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
          <span class="example-translation">${escapeHtml(ex.en)}</span>
        </li>`).join('');

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
          <div class="section-title">Related</div>
          <div class="related-words-list">${related}</div>
        </div>`;
    }).join('');

    let cefrTag = '';
    if (entry.cefr) {
      cefrTag = `<div class="tags-container" style="position:absolute;right:0;top:0;">
        <button type="button" class="level-tag" data-filter="cefr" data-value="${entry.cefr}">${entry.cefr.toUpperCase()}</button>
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
  };

  const showResult = async (query = '') => {
    const q = query.trim().toLowerCase();

    if (!q) {
      resultsContainer.innerHTML = aboutSection.outerHTML;
      return;
    }

    let html = `<div class="no-result">No entry found for "${escapeHtml(query)}"</div>`;
    const kg = isKyrgyz(q);

    try {
      if (kg) {
        let entry = await fetchLemmaByCanonical(q);
        if (!entry) entry = await fetchLemmaByForm(q);
        if (entry) html = renderEntry(entry.canonical || q, entry);
      } else {
        const { data: senses } = await supabase
          .from('senses')
          .select('lemma_id, translation')
          .ilike('translation', q);
        if (senses?.length === 1) {
          const { data: lemma } = await supabase
            .from('lemmas')
            .select('canonical')
            .eq('id', senses[0].lemma_id)
            .single();
          if (lemma) {
            const full = await fetchLemmaByCanonical(lemma.canonical);
            if (full) html = renderEntry(lemma.canonical, full);
          }
        }
      }
    } catch (e) { console.error(e); }

    resultsContainer.innerHTML = html;
    attachTagFilters();
  };

  const attachTagFilters = () => {
    $$('[data-filter]').forEach(btn => {
      btn.onclick = () => {
        const type = btn.dataset.filter;
        const val  = btn.dataset.value;
        alert(`Filter by ${type}: ${val}`);   // replace with real modal logic
      };
    });
  };

  randomBtn.onclick = async () => {
    const word = await getRandomWord();
    if (word) {
      searchInput.value = word;
      await showResult(word);
    }
  };

  const generateExercise = async () => {
    const { data: pool, error } = await supabase
      .from('lemmas')
      .select('canonical')
      .limit(500);
    if (error || !pool?.length) return;

    const correctLemma = pool[Math.floor(Math.random() * pool.length)].canonical;
    const entry = await fetchLemmaByCanonical(correctLemma);
    if (!entry?.senses?.[0]) return;
    const correctAnswer = entry.senses[0].translation;

    const { data: others } = await supabase
      .from('senses')
      .select('translation')
      .limit(200);
    const distractors = (others || [])
      .filter(s => s.translation !== correctAnswer)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(s => s.translation);

    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
    const optsHtml = options.map(o => `<div class="answer-option" data-answer="${escapeHtml(o)}">${escapeHtml(o)}</div>`).join('');

    const body = exerciseModal.querySelector('#exerciseModalBody');
    body.innerHTML = `
      <div class="exercise-question">What's the English for <span class="kyrgyz">${escapeHtml(correctLemma)}</span>?</div>
      <div class="answer-options">${optsHtml}</div>
      <div class="exercise-feedback" style="display:none;"></div>
      <div class="exercise-buttons">
        <button type="button" class="exercise-btn-modal next-btn">Next Question</button>
        <button type="button" class="exercise-btn-modal close-btn">Close</button>
      </div>
    `;

    exerciseModal.style.display = 'block';

    body.querySelectorAll('.answer-option').forEach(opt => {
      opt.onclick = () => {
        const selected = opt.dataset.answer;
        const correct = selected === correctAnswer;
        $$('.answer-option').forEach(o => o.classList.remove('selected','correct','incorrect'));
        opt.classList.add('selected', correct ? 'correct' : 'incorrect');
        if (!correct) body.querySelector(`[data-answer="${correctAnswer}"]`)?.classList.add('correct');

        const fb = body.querySelector('.exercise-feedback');
        fb.style.display = 'block';
        fb.innerHTML = correct
          ? `<h4>Correct!</h4><p>Well done!</p>`
          : `<h4>Incorrect</h4><p>The right answer is <strong>${escapeHtml(correctAnswer)}</strong></p>`;

        body.querySelector('.next-btn').onclick = generateExercise;
      };
    });

    body.querySelector('.close-btn').onclick = () => exerciseModal.style.display = 'none';
  };

  exerciseBtn.onclick = generateExercise;
  closeExerciseModal.onclick = () => exerciseModal.style.display = 'none';

  title.onclick = () => { searchInput.value = ''; showResult(''); };

  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => showResult(searchInput.value), 220);
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
    if (action === 'backspace') {
      searchInput.value = searchInput.value.slice(0, -1);
    } else if (action === 'space') {
      searchInput.value += ' ';
    } else {
      searchInput.value += key.textContent;
    }
    searchInput.focus();
    showResult(searchInput.value);
  });

  closeModal.onclick = () => filterModal.style.display = 'none';
  window.addEventListener('click', e => {
    if (e.target === filterModal) filterModal.style.display = 'none';
    if (e.target === exerciseModal) exerciseModal.style.display = 'none';
  });

  showResult('');
});
