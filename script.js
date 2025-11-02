const SUPABASE_URL = 'https://jvizodlmiiisubatqykg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let lemmaCache = new Map();
let lemmaList = [];
let filterCache = {
  cefr: new Map(),
  pos: new Map(),
  topic: new Map()
};
let isCacheLoading = false;

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const escapeHtml = unsafe => {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const isKyrgyz = text => {
  if (!text) return false;
  return /[\u0400-\u04FF]/.test(String(text));
};

const safeParseGrammar = raw => {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  if (typeof raw !== 'string') return {};
  try {
    const cleaned = raw.replace(/\\"/g, '"');
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('Grammar parse failed:', raw);
    return {};
  }
};

async function preloadFilters() {
  const tables = ['cefr', 'pos', 'topic'];
  for (const type of tables) {
    const column = type === 'cefr' ? 'cefr' : type === 'pos' ? 'pos' : 'topic';
    const table = type === 'topic' ? 'senses' : 'lemmas';
    const selectCol = column === 'topic' ? 'topic' : column;
    try {
      const resp = await supabase
        .from(table)
        .select(selectCol)
        .not(selectCol, 'is', null);
      const data = resp?.data;
      if (!data) {
        filterCache[type] = new Map();
        continue;
      }
      const counts = {};
      data.forEach(row => {
        const value = row[selectCol] || row.topic;
        if (value) counts[value] = (counts[value] || 0) + 1;
      });
      filterCache[type] = new Map(Object.entries(counts).sort((a, b) => b[1] - a[1]));
    } catch (e) {
      console.error('preloadFilters error', e);
      filterCache[type] = new Map();
    }
  }
}

async function preloadCache() {
  if (isCacheLoading || lemmaList.length > 0) return;
  isCacheLoading = true;
  try {
    const { data, error } = await supabase
      .from('lemmas')
      .select('id, canonical, pronunciation, cefr')
      .limit(1000);
    if (error || !data) {
      console.error('Cache preload failed:', error);
      isCacheLoading = false;
      return;
    }
    lemmaList = data;
    await preloadFilters();
  } catch (e) {
    console.error('preloadCache error', e);
  } finally {
    isCacheLoading = false;
  }
}

async function fetchFullLemma(canonical) {
  if (!canonical && canonical !== 0) return null;
  if (lemmaCache.has(canonical)) return lemmaCache.get(canonical);
  try {
    const { data: lemma, error: e1 } = await supabase
      .from('lemmas')
      .select('*')
      .eq('canonical', canonical)
      .single();
    if (e1 || !lemma) return null;
    let senses = [];
    try {
      const resp = await supabase
        .from('senses')
        .select('*')
        .eq('lemma_id', lemma.id)
        .order('id', { ascending: true });
      senses = resp.data || [];
    } catch (e2) {
      senses = [];
    }
    for (const sense of senses) {
      try {
        const { data: examples } = await supabase
          .from('examples')
          .select('*')
          .eq('sense_id', sense.id);
        sense.examples = examples || [];
      } catch (ex) {
        sense.examples = [];
      }
      try {
        const { data: related } = await supabase
          .from('related')
          .select('word,translation')
          .eq('sense_id', sense.id);
        sense.related = related || [];
      } catch (ex2) {
        sense.related = [];
      }
      sense.grammar = safeParseGrammar(sense.grammar);
    }
    const entry = {
      canonical: lemma.canonical,
      pronunciation: lemma.pronunciation || '',
      cefr: lemma.cefr || '',
      senses
    };
    lemmaCache.set(canonical, entry);
    return entry;
  } catch (e) {
    console.error('fetchFullLemma error', e);
    return null;
  }
}

async function fetchLemmaByForm(form) {
  if (!form) return null;
  try {
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
    return await fetchFullLemma(lemma.canonical);
  } catch (e) {
    console.error('fetchLemmaByForm error', e);
    return null;
  }
}

function renderEntry(headword, entry) {
  const kyrgyzHead = isKyrgyz(headword) ? 'kyrgyz' : '';
  const senseHtml = (entry.senses || []).map((sense, i) => {
    const transCls = isKyrgyz(sense.translation) ? 'kyrgyz' : '';
    let tags = '';
    if (sense.pos) tags += `<button type="button" class="pos tag-btn" data-type="pos" data-value="${escapeHtml(sense.pos)}">${escapeHtml(sense.pos)}</button>`;
    if (sense.topic) tags += `<button type="button" class="topic-tag tag-btn" data-type="topic" data-value="${escapeHtml(sense.topic)}">${escapeHtml(sense.topic)}</button>`;
    const examples = (sense.examples || []).map(ex => `
      <li class="example-item">
        <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
        <span class="example-translation">${escapeHtml(ex.en)}</span>
      </li>`).join('');
    let grammarHtml = '';
    if (sense.grammar && Object.keys(sense.grammar).length > 0) {
      grammarHtml = `<ul class="grammar-list">`;
      for (const [key, value] of Object.entries(sense.grammar)) {
        grammarHtml += `<li class="grammar-item">
          <span class="grammar-label">${escapeHtml(key)}:</span>
          ${escapeHtml(value)}
        </li>`;
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
      <button type="button" class="level-tag tag-btn" data-type="cefr" data-value="${escapeHtml(entry.cefr)}">${escapeHtml(String(entry.cefr).toUpperCase())}</button>
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

document.addEventListener('DOMContentLoaded', async () => {
  const filterModalEl = $('#filterModal');
  const exerciseModalEl = $('#exerciseModal');
  const virtualKeyboardEl = $('#virtualKeyboard');
  if (filterModalEl) filterModalEl.style.display = 'none';
  if (exerciseModalEl) exerciseModalEl.style.display = 'none';
  if (virtualKeyboardEl) virtualKeyboardEl.style.display = 'none';
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
  const exerciseModalBody = $('#exerciseModalBody');

  const showFilterModal = async (type, value) => {
    if (!modalTitle || !modalBody) return;
    const titles = { cefr: 'CEFR Levels', pos: 'Parts of Speech', topic: 'Topics' };
    modalTitle.textContent = titles[type] || 'Filters';
    if (!value) {
      const items = filterCache[type];
      if (!items || items.size === 0) {
        modalBody.innerHTML = `<p style="text-align:center;color:var(--text-muted);">No data available.</p>`;
      } else {
        const listHtml = Array.from(items.entries())
          .map(([val, count]) => `
            <li class="filter-item" data-filter-value="${escapeHtml(val)}" data-filter-type="${escapeHtml(type)}">
              <span>${escapeHtml(val)}</span>
              <span class="filter-count">${count}</span>
            </li>
          `).join('');
        modalBody.innerHTML = `<ul class="filter-list">${listHtml}</ul>`;
        modalBody.querySelectorAll('.filter-item').forEach(item => {
          item.onclick = () => {
            const v = item.dataset.filterValue;
            const t = item.dataset.filterType;
            showFilterModal(t, v);
          };
        });
      }
      if (filterModalEl) filterModalEl.style.display = 'flex';
      return;
    }
    let lemmasToShow = [];
    try {
      if (type === 'cefr') {
        const { data } = await supabase.from('lemmas').select('id, canonical').eq('cefr', value);
        lemmasToShow = data || [];
      } else if (type === 'pos') {
        const { data: senses } = await supabase.from('senses').select('lemma_id').eq('pos', value);
        if (senses) {
          const lemmaIds = [...new Set(senses.map(s => s.lemma_id))];
          const { data } = await supabase.from('lemmas').select('id, canonical').in('id', lemmaIds);
          lemmasToShow = data || [];
        }
      } else if (type === 'topic') {
        const { data: senses } = await supabase.from('senses').select('lemma_id').eq('topic', value);
        if (senses) {
          const lemmaIds = [...new Set(senses.map(s => s.lemma_id))];
          const { data } = await supabase.from('lemmas').select('id, canonical').in('id', lemmaIds);
          lemmasToShow = data || [];
        }
      }
    } catch (e) {
      console.error('showFilterModal fetch lemmas error', e);
    }
    if (!lemmasToShow || lemmasToShow.length === 0) {
      modalBody.innerHTML = `<div class="no-result">No entries found for ${escapeHtml(value)}</div>`;
      if (filterModalEl) filterModalEl.style.display = 'flex';
      return;
    }
    const listHtml = (lemmasToShow || []).map(l => `
      <li class="filter-lemma-item" data-canonical="${escapeHtml(l.canonical)}" data-lemma-id="${escapeHtml(l.id)}" style="padding:12px 10px;cursor:pointer;border-bottom:1px solid var(--border-color);">
        ${escapeHtml(l.canonical)}
      </li>
    `).join('');
    modalBody.innerHTML = `<ul class="filter-lemma-list">${listHtml}</ul>`;
    modalBody.querySelectorAll('.filter-lemma-item').forEach(item => {
      item.onclick = async () => {
        const canonical = item.dataset.canonical;
        const entry = await fetchFullLemma(canonical);
        if (entry && resultsContainer) {
          resultsContainer.innerHTML = renderEntry(entry.canonical, entry);
          attachTagFilters();
          if (filterModalEl) filterModalEl.style.display = 'none';
        }
      };
    });
    if (filterModalEl) filterModalEl.style.display = 'flex';
  };

  const filterAndShow = async (type, value) => {
    let lemmasToShow = [];
    try {
      if (type === 'cefr') {
        const { data } = await supabase.from('lemmas').select('canonical').eq('cefr', value);
        lemmasToShow = data || [];
      } else if (type === 'pos') {
        const { data: senses } = await supabase.from('senses').select('lemma_id').eq('pos', value);
        if (senses) {
          const lemmaIds = [...new Set(senses.map(s => s.lemma_id))];
          const { data } = await supabase.from('lemmas').select('canonical').in('id', lemmaIds);
          lemmasToShow = data || [];
        }
      } else if (type === 'topic') {
        const { data: senses } = await supabase.from('senses').select('lemma_id').eq('topic', value);
        if (senses) {
          const lemmaIds = [...new Set(senses.map(s => s.lemma_id))];
          const { data } = await supabase.from('lemmas').select('canonical').in('id', lemmaIds);
          lemmasToShow = data || [];
        }
      }
    } catch (e) {
      console.error('filterAndShow error', e);
    }
    if (!resultsContainer) return;
    if (lemmasToShow.length === 0) {
      resultsContainer.innerHTML = `<div class="no-result">No entries found for ${escapeHtml(value)}</div>`;
      return;
    }
    const entries = await Promise.all(lemmasToShow.map(l => fetchFullLemma(l.canonical)));
    resultsContainer.innerHTML = entries.filter(e => e).map(e => renderEntry(e.canonical, e)).join('');
    attachTagFilters();
  };

  const attachTagFilters = () => {
    $$('.tag-btn').forEach(btn => {
      btn.onclick = e => {
        e.stopPropagation();
        const type = btn.dataset.type;
        const value = btn.dataset.value;
        if (type && value) {
          showFilterModal(type, value);
        } else if (type) {
          showFilterModal(type);
        }
      };
    });
  };

  const showResult = async (query = '') => {
    if (!resultsContainer || !aboutSection) return;
    const q = String(query || '').trim();
    if (!q) {
      resultsContainer.innerHTML = aboutSection.outerHTML;
      attachTagFilters();
      return;
    }
    let html = `<div class="no-result">No entry found for "${escapeHtml(q)}"</div>`;
    const kg = isKyrgyz(q);
    try {
      if (kg) {
        let entry = await fetchFullLemma(q);
        if (!entry) entry = await fetchLemmaByForm(q);
        if (entry) html = renderEntry(entry.canonical || q, entry);
      } else {
        const { data: senses } = await supabase
          .from('senses')
          .select('lemma_id, translation')
          .ilike('translation', `%${q}%`);
        if (senses?.length === 1) {
          const { data: lemma } = await supabase
            .from('lemmas')
            .select('canonical')
            .eq('id', senses[0].lemma_id)
            .single();
          if (lemma) {
            const full = await fetchFullLemma(lemma.canonical);
            if (full) html = renderEntry(lemma.canonical, full);
          }
        } else if (senses?.length > 1) {
          const uniqueIds = [...new Set(senses.map(s => s.lemma_id))];
          const { data: lemmas } = await supabase.from('lemmas').select('canonical').in('id', uniqueIds).limit(20);
          if (lemmas && lemmas.length) {
            const entries = await Promise.all(lemmas.map(l => fetchFullLemma(l.canonical)));
            html = entries.filter(e => e).map(e => renderEntry(e.canonical, e)).join('');
          }
        } else {
          const { data: lemmas } = await supabase.from('lemmas').select('canonical').ilike('canonical', `%${q}%`).limit(20);
          if (lemmas && lemmas.length) {
            const entries = await Promise.all(lemmas.map(l => fetchFullLemma(l.canonical)));
            html = entries.filter(e => e).map(e => renderEntry(e.canonical, e)).join('');
          }
        }
      }
    } catch (e) {
      console.error('showResult error', e);
    }
    resultsContainer.innerHTML = html;
    attachTagFilters();
  };

  if (randomBtn) {
    randomBtn.onclick = async () => {
      if (!lemmaList.length) await preloadCache();
      if (!lemmaList.length) return;
      const rand = lemmaList[Math.floor(Math.random() * lemmaList.length)];
      const entry = await fetchFullLemma(rand.canonical);
      if (entry && searchInput && resultsContainer) {
        searchInput.value = entry.canonical;
        resultsContainer.innerHTML = renderEntry(entry.canonical, entry);
        attachTagFilters();
      }
    };
  }

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
    if (!exerciseModalBody) return;
    exerciseModalBody.innerHTML = `
      <div class="exercise-question">What's the English for <span class="kyrgyz">${escapeHtml(correct.canonical)}</span>?</div>
      <div class="answer-options">${optsHtml}</div>
      <div class="exercise-feedback" style="display:none;"></div>
      <div class="exercise-buttons">
        <button type="button" class="exercise-btn-modal next-btn">Next Question</button>
        <button type="button" class="exercise-btn-modal close-btn">Close</button>
      </div>
    `;
    if (exerciseModalEl) exerciseModalEl.style.display = 'block';
    exerciseModalBody.querySelectorAll('.answer-option').forEach(opt => {
      opt.onclick = () => {
        const selected = opt.dataset.answer;
        const isCorrect = selected === answer;
        $$('.answer-option').forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
        opt.classList.add('selected', isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect) {
          const match = Array.from(exerciseModalBody.querySelectorAll('.answer-option')).find(a => a.dataset.answer === answer);
          if (match) match.classList.add('correct');
        }
        const fb = exerciseModalBody.querySelector('.exercise-feedback');
        if (fb) {
          fb.style.display = 'block';
          fb.innerHTML = isCorrect ? `<h4>Correct!</h4><p>Well done!</p>` : `<h4>Incorrect</h4><p>The right answer is <strong>${escapeHtml(answer)}</strong></p>`;
        }
        const nextBtn = exerciseModalBody.querySelector('.next-btn');
        if (nextBtn) nextBtn.onclick = generateExercise;
      };
    });
    const closeBtn = exerciseModalBody.querySelector('.close-btn');
    if (closeBtn) closeBtn.onclick = () => { if (exerciseModalEl) exerciseModalEl.style.display = 'none'; };
  };

  if (exerciseBtn) exerciseBtn.onclick = generateExercise;
  if (closeExerciseModal) closeExerciseModal.onclick = () => { if (exerciseModalEl) exerciseModalEl.style.display = 'none'; };

  if (title && searchInput) title.onclick = () => { searchInput.value = ''; showResult(''); };

  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => showResult(searchInput.value), 300);
    });
  }

  if (keyboardToggleBtn && virtualKeyboard) {
    keyboardToggleBtn.onclick = () => {
      const hidden = virtualKeyboard.style.display === 'none' || virtualKeyboard.style.display === '';
      virtualKeyboard.style.display = hidden ? 'block' : 'none';
      keyboardToggleBtn.textContent = hidden ? '⌨️ Hide Keyboard' : '⌨️ Show Keyboard';
    };
  }

  document.addEventListener('click', e => {
    if (!e.target) return;
    if (e.target.matches && e.target.matches('.key')) {
      const key = e.target;
      const action = key.dataset.action;
      if (searchInput) {
        if (action === 'backspace') searchInput.value = searchInput.value.slice(0, -1);
        else if (action === 'space') searchInput.value += ' ';
        else searchInput.value += key.textContent;
        searchInput.focus();
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => showResult(searchInput.value), 100);
      }
    }
  });

  if (closeModal) closeModal.onclick = () => { if (filterModalEl) filterModalEl.style.display = 'none'; };

  window.addEventListener('click', e => {
    if (e.target === filterModalEl) filterModalEl.style.display = 'none';
    if (e.target === exerciseModalEl) exerciseModalEl.style.display = 'none';
  });

  if (resultsContainer && aboutSection) showResult('');
});
