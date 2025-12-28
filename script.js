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
const reviewBtn = document.getElementById('reviewBtn');
const savedModal = document.getElementById('savedModal');
const closeSavedModal = document.getElementById('closeSavedModal');
const savedModalBody = document.getElementById('savedModalBody');
const flashcardModal = document.getElementById('flashcardModal');
const closeFlashcardModal = document.getElementById('closeFlashcardModal');
const flashcardModalBody = document.getElementById('flashcardModalBody');
const authModal = document.getElementById('authModal');
const closeAuthModal = document.getElementById('closeAuthModal');
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const authModalTitle = document.getElementById('authModalTitle');
const authToggle = document.getElementById('toggleAuth');
const authIndicator = document.getElementById('authIndicator');
const userDropdown = document.getElementById('userDropdown');

let dictionary = {
  kg: {
    "жазуу": {
      canonical: "жазуу",
      pronunciation: "/d͡ʒɑzuː/",
      topic: "communication",
      cefr: "A2",
      forms: ["жаз", "жазам", "жазасың", "жазат", "жаздым", "жазган"], // Added forms for testing
      senses: [{
        pos: "verb",
        translation: "write",
        examples: [
          { en: "I write a letter.", kg: "Мен кат жазам." }
        ],
        grammar: {
          "tenses": {
            "present": {
              "positive": {
                "мен": "жазам",
                "сен": "жазасың",
                "сиз": "жазасыз",
                "ал": "жазат",
                "биз": "жазабыз",
                "силер": "жазасыңар",
                "сиздер": "жазасыздар",
                "алар": "жазышат"
              },
              "negative": {
                "мен": "жазбайм",
                "сен": "жазбайсың",
                "сиз": "жазбайсыз",
                "ал": "жазбайt",
                "биз": "жазбайбыз",
                "силер": "жазбайсыңар",
                "сиздер": "жазбайсыздар",
                "алар": "жазышпайt"
              }
            },
            "past_definite": {
              "positive": {
                "мен": "жаздым",
                "сен": "жаздың",
                "сиз": "жаздыңыз",
                "ал": "жазды",
                "биз": "жаздык",
                "силер": "жаздыңар",
                "сиздер": "жаздыңыздар",
                "алар": "жазышты"
              },
              "negative": {
                "мен": "жазган жокмун",
                "сен": "жазган жоксуң",
                "сиз": "жазган жоксуз",
                "ал": "жазган жок",
                "биз": "жазган жокпуз",
                "силер": "жазган жоксуңар",
                "сиздер": "жазган жоксуздар",
                "алар": "жазышкан жок"
              }
            },
            "past_indefinite": {
              "positive": {
                "мен": "жазганмын",
                "сен": "жазгансың",
                "сиз": "жазгансыз",
                "ал": "жазган",
                "биз": "жазганбыз",
                "силер": "жазгансыңар",
                "сиздер": "жазгансыздар",
                "алар": "жазышкан"
              },
              "negative": {
                "мен": "жазбаганмын",
                "сен": "жазбагансың",
                "сиз": "жазбагансыз",
                "ал": "жазбаган",
                "биз": "жазбаганбыз",
                "силер": "жазбагансыңар",
                "сиздер": "жазбагансыздар",
                "алар": "жазышпаган"
              }
            },
            "future_definite": {
              "positive": {
                "мен": "жазамын",
                "сен": "жазасың",
                "сиз": "жазасыз",
                "ал": "жазат",
                "биз": "жазабыз",
                "силер": "жазасыңар",
                "сиздер": "жазасыздар",
                "алар": "жазышат"
              },
              "negative": {
                "мен": "жазбаймын",
                "сен": "жазбайсың",
                "сиз": "жазбайсыз",
                "ал": "жазбайt",
                "биз": "жазбайбыз",
                "силер": "жазбайсыңар",
                "сиздер": "жазбайсыздар",
                "алар": "жазышпайt"
              }
            },
            "future_indefinite": {
              "positive": {
                "мен": "жазмакмын",
                "сен": "жазмаксың",
                "сиз": "жазмаксыз",
                "ал": "жазмак",
                "биз": "жазмакбыз",
                "силер": "жазмаксыңар",
                "сиздер": "жазмаксыздар",
                "алар": "жазмак"
              },
              "negative": {
                "мен": "жазмак эмесмин",
                "сен": "жазмак эмессиң",
                "сиз": "жазмак эмессиз",
                "ал": "жазмак эмес",
                "биз": "жазмак эмеспиз",
                "силер": "жазмак эмессиңер",
                "сиздер": "жазмак эмессиздер",
                "алар": "жазмак эмес"
              }
            },
            "conditional": {
              "positive": {
                "мен": "жазсам",
                "сен": "жазсаң",
                "сиз": "жазсаңыз",
                "ал": "жазса",
                "биз": "жазсак",
                "силер": "жазсаңар",
                "сиздер": "жазсаңыздар",
                "алар": "жазышса"
              },
              "negative": {
                "мен": "жазбасам",
                "сен": "жазбасаң",
                "сиз": "жазбасаңыз",
                "ал": "жазбаса",
                "биз": "жазбасак",
                "силер": "жазбасаңар",
                "сиздер": "жазбасаңыздар",
                "алар": "жазышпаса"
              }
            },
            "conditional_past": {
              "positive": {
                "мен": "жазсам эле",
                "сен": "жазсаң эле",
                "сиз": "жазсаңыз эле",
                "ал": "жазса эле",
                "биз": "жазсак эле",
                "силер": "жазсаңар эле",
                "сиздер": "жазсаңыздар эле",
                "алар": "жазышса эле"
              },
              "negative": {
                "мен": "жазбасам эле",
                "сен": "жазбасаң эле",
                "сиз": "жазбасаңыз эле",
                "ал": "жазбаса эле",
                "биз": "жазбасак эле",
                "силер": "жазбасаңар эле",
                "сиздер": "жазбасаңыздар эле",
                "алар": "жазышпаса эле"
              }
            }
          },
          "imperative": {
            "positive": {
              "singular": {
                "informal": "жаз",
                "formal": "жазыңыз"
              },
              "plural": {
                "informal": "жазгыла",
                "formal": "жазыңыздар"
              }
            },
            "negative": {
              "singular": {
                "informal": "жазба",
                "formal": "жазбаңыз"
              },
              "plural": {
                "informal": "жазбагыла",
                "formal": "жазбаңыздар"
              }
            }
          },
          "participles": {
            "present_imperfective": {
              "positive": "жаза",
              "negative": "жазбай"
            },
            "present_perfective": {
              "positive": "жазып",
              "negative": "жазбай"
            },
            "past": {
              "positive": "жазган",
              "negative": "жазбаган"
            },
            "future": {
              "positive": "жазар",
              "negative": "жазбай турган"
            },
            "conditional": {
              "positive": "жазса",
              "negative": "жазбаса"
            }
          }
        }
      }]
    },
    "кол": {  // Added example for form matching
      canonical: "кол",
      pronunciation: "/kol/",
      topic: "body",
      cefr: "A1",
      forms: ["колдун", "колго", "колдо", "колдон", "колдор"], // Added grammatical forms
      senses: [{
        pos: "noun",
        translation: "hand, arm",
        examples: [
          { en: "My hand hurts.", kg: "Менин колум ооруйт." },
          { en: "Raise your hand.", kg: "Колуңузду көтөрүңүз." }
        ],
        grammar: {
          singular: {
            nominative: "кол",
            genitive: "колдун",
            dative: "колго",
            accusative: "колду",
            locative: "колдо",
            ablative: "колдон"
          },
          plural: {
            nominative: "колдор",
            genitive: "колдордун",
            dative: "колдорго",
            accusative: "колдорду",
            locative: "колдордо",
            ablative: "колдордон"
          }
        }
      }]
    }
  }
};

normalizeDictionary(dictionary);
let dictionaryLoadedFromSupabase = false;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isKyrgyz(text) {
  return /[\u0400-\u04FF]/.test(text);
}

function hasLemma(word) {
  return !!dictionary.kg[word];
}

function renderNounPronounGrammar(grammarObj) {
  const cases = ['nominative', 'genitive', 'dative', 'accusative', 'locative', 'ablative'];
  const caseLabels = {
    nominative: 'Nom.',
    genitive: 'Gen.',
    dative: 'Dat.',
    accusative: 'Acc.',
    locative: 'Loc.',
    ablative: 'Abl.'
  };
  let table = `<div class="grammar-table"><table>
    <thead><tr><th></th><th>Singular</th><th>Plural</th></tr></thead>
    <tbody>`;
  cases.forEach(c => {
    const singular = grammarObj.singular?.[c] || '—';
    const plural = grammarObj.plural?.[c] || '—';
    table += `<tr>
      <td class="case-label">${caseLabels[c]}</td>
      <td>${escapeHtml(singular)}</td>
      <td>${escapeHtml(plural)}</td>
    </tr>`;
  });
  table += `</tbody></table></div>`;
  return table;
}

function renderAdjectiveGrammar(grammarObj) {
  let html = '';
  if (grammarObj.comparative || grammarObj.superlative) {
    const lineStyle = `display: block; color: var(--text-secondary); font-weight: 600; font-size: 0.88rem; margin: 18px 0 6px 8px; line-height: 1.4;`.replace(/\s+/g, ' ').trim();
    const valueStyle = `margin-left: 8px; font-size: 0.94rem; font-weight: normal; color: var(--text-primary);`.replace(/\s+/g, ' ').trim();
    if (grammarObj.comparative) {
      html += `<div style="${lineStyle}"><span style="display:inline-block; min-width:110px;">Comparative:</span><span style="${valueStyle}" class="kyrgyz">${escapeHtml(grammarObj.comparative)}</span></div>`;
    }
    if (grammarObj.superlative) {
      html += `<div style="${lineStyle}"><span style="display:inline-block; min-width:110px;">Superlative:</span><span style="${valueStyle}" class="kyrgyz">${escapeHtml(grammarObj.superlative)}</span></div>`;
    }
  }
  if (grammarObj.cases) {
    html += renderNounPronounGrammar(grammarObj.cases);
  }
  return html;
}

function renderVerbGrammar(grammarObj) {
  let html = '';
  const persons = ["мен", "сен", "сиз", "ал", "биз", "силер", "сиздер", "алар"];
  const tenseNames = {
    present: "Present",
    past_definite: "Past (Definite)",
    past_indefinite: "Past (Indefinite)",
    future_definite: "Future (Definite)",
    future_indefinite: "Future (Indefinite)",
    conditional: "Conditional",
    conditional_past: "Conditional Past"
  };
  const tenses = grammarObj.tenses || {};

  if (tenses.present) {
    html += `<div class="section-title" style="margin-top:18px;">${tenseNames.present}</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr><th style="text-align:left; padding:6px 8px;">Person</th><th style="padding:6px 8px;">Positive</th><th style="padding:6px 8px;">Negative</th></tr></thead><tbody>`;
    persons.forEach(person => {
      const pos = tenses.present.positive?.[person] || '—';
      const neg = tenses.present.negative?.[person] || '—';
      html += `<tr><td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(neg)}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  if (tenses.past_definite || tenses.past_indefinite) {
    html += `<div class="section-title" style="margin-top:24px;">Past Tenses</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr><th style="text-align:left; padding:6px 8px;">Person</th><th style="padding:6px 8px;">Past (Definite)<br><small>Positive</small></th><th style="padding:6px 8px;">Past (Definite)<br><small>Negative</small></th><th style="padding:6px 8px;">Past (Indefinite)<br><small>Positive</small></th><th style="padding:6px 8px;">Past (Indefinite)<br><small>Negative</small></th></tr></thead><tbody>`;
    persons.forEach(person => {
      const pd_pos = tenses.past_definite?.positive?.[person] || '—';
      const pd_neg = tenses.past_definite?.negative?.[person] || '—';
      const pi_pos = tenses.past_indefinite?.positive?.[person] || '—';
      const pi_neg = tenses.past_indefinite?.negative?.[person] || '—';
      html += `<tr><td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pd_pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pd_neg)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pi_pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pi_neg)}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  if (tenses.future_definite || tenses.future_indefinite) {
    html += `<div class="section-title" style="margin-top:24px;">Future Tenses</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr><th style="text-align:left; padding:6px 8px;">Person</th><th style="padding:6px 8px;">Future (Definite)<br><small>Positive</small></th><th style="padding:6px 8px;">Future (Definite)<br><small>Negative</small></th><th style="padding:6px 8px;">Future (Indefinite)<br><small>Positive</small></th><th style="padding:6px 8px;">Future (Indefinite)<br><small>Negative</small></th></tr></thead><tbody>`;
    persons.forEach(person => {
      const fd_pos = tenses.future_definite?.positive?.[person] || '—';
      const fd_neg = tenses.future_definite?.negative?.[person] || '—';
      const fi_pos = tenses.future_indefinite?.positive?.[person] || '—';
      const fi_neg = tenses.future_indefinite?.negative?.[person] || '—';
      html += `<tr><td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fd_pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fd_neg)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fi_pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fi_neg)}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  if (tenses.conditional || tenses.conditional_past) {
    html += `<div class="section-title" style="margin-top:24px;">Conditional Forms</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr><th style="text-align:left; padding:6px 8px;">Person</th><th style="padding:6px 8px;">Conditional<br><small>Positive</small></th><th style="padding:6px 8px;">Conditional<br><small>Negative</small></th><th style="padding:6px 8px;">Conditional Past<br><small>Positive</small></th><th style="padding:6px 8px;">Conditional Past<br><small>Negative</small></th></tr></thead><tbody>`;
    persons.forEach(person => {
      const c_pos = tenses.conditional?.positive?.[person] || '—';
      const c_neg = tenses.conditional?.negative?.[person] || '—';
      const cp_pos = tenses.conditional_past?.positive?.[person] || '—';
      const cp_neg = tenses.conditional_past?.negative?.[person] || '—';
      html += `<tr><td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(c_pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(c_neg)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(cp_pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(cp_neg)}</td></tr>`;
    });
    html += `</tbody></table>`;
  }

  if (grammarObj.imperative) {
    const imp = grammarObj.imperative;
    const pos = imp.positive || {};
    const neg = imp.negative || {};
    const sgInfPos = pos.singular?.informal || '—';
    const sgForPos = pos.singular?.formal || '—';
    const plInfPos = pos.plural?.informal || '—';
    const plForPos = pos.plural?.formal || '—';
    const sgInfNeg = neg.singular?.informal || '—';
    const sgForNeg = neg.singular?.formal || '—';
    const plInfNeg = neg.plural?.informal || '—';
    const plForNeg = neg.plural?.formal || '—';
    html += `<div class="section-title" style="margin-top:24px;">Imperative</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr><th style="text-align:left; padding:6px 8px;"></th><th colspan="2" style="padding:6px 8px; text-align:center;">Positive</th><th colspan="2" style="padding:6px 8px; text-align:center;">Negative</th></tr><tr style="font-size:0.8rem; color:var(--text-muted);"><th></th><th style="padding:4px 8px;">Informal</th><th style="padding:4px 8px;">Formal</th><th style="padding:4px 8px;">Informal</th><th style="padding:4px 8px;">Formal</th></tr></thead><tbody><tr><td style="padding:6px 8px; color:var(--text-muted);">Singular</td><td class="kyrgyz">${escapeHtml(sgInfPos)}</td><td class="kyrgyz">${escapeHtml(sgForPos)}</td><td class="kyrgyz">${escapeHtml(sgInfNeg)}</td><td class="kyrgyz">${escapeHtml(sgForNeg)}</td></tr><tr><td style="padding:6px 8px; color:var(--text-muted);">Plural</td><td class="kyrgyz">${escapeHtml(plInfPos)}</td><td class="kyrgyz">${escapeHtml(plForPos)}</td><td class="kyrgyz">${escapeHtml(plInfNeg)}</td><td class="kyrgyz">${escapeHtml(plForNeg)}</td></tr></tbody></table>`;
  }

  if (grammarObj.participles) {
    html += `<div class="section-title" style="margin-top:24px;">Participles</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr><th style="text-align:left; padding:6px 8px;">Type</th><th style="padding:6px 8px;">Positive</th><th style="padding:6px 8px;">Negative</th></tr></thead><tbody>`;
    const participleLabels = {
      present_imperfective: "Present (imperfective)",
      present_perfective: "Present (perfective)",
      past: "Past",
      future: "Future",
      conditional: "Conditional"
    };
    const participleOrder = ['present_imperfective', 'present_perfective', 'past', 'future', 'conditional'];
    participleOrder.forEach(key => {
      const value = grammarObj.participles[key];
      if (value) {
        const label = participleLabels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const pos = value.positive || '—';
        const neg = value.negative || '—';
        html += `<tr><td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(label)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pos)}</td><td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(neg)}</td></tr>`;
      }
    });
    html += `</tbody></table>`;
  }

  html += `<p style="font-size:0.84rem; color:var(--text-light); margin-top:16px; font-style:italic;">The Kyrgyz verb table is more complex; this version shows the main conjugation forms for learners.</p>`;
  return html;
}

function renderGenericGrammar(grammarObj) {
  let html = `<ul class="grammar-list">`;
  for (let key in grammarObj) {
    if (grammarObj[key] !== null && grammarObj[key] !== undefined) {
      let value = grammarObj[key];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      html += `<li class="grammar-item"><span class="grammar-label">${escapeHtml(key)}:</span> ${escapeHtml(String(value))}</li>`;
    }
  }
  html += `</ul>`;
  return html;
}

function renderGrammarSection(sense) {
  if (!sense.grammar || Object.keys(sense.grammar).length === 0) {
    return '<p>No grammar data.</p>';
  }
  const pos = sense.pos?.toLowerCase();
  let grammarHtml = '';
  try {
    if (pos === 'noun' || pos === 'pronoun') {
      grammarHtml = renderNounPronounGrammar(sense.grammar);
    } else if (pos === 'adjective') {
      grammarHtml = renderAdjectiveGrammar(sense.grammar);
    } else if (pos === 'verb') {
      grammarHtml = renderVerbGrammar(sense.grammar);
    } else {
      grammarHtml = renderGenericGrammar(sense.grammar);
    }
  } catch (e) {
    console.error('Error rendering grammar:', e, sense.grammar);
    grammarHtml = `<p style="color:var(--error);">Error displaying grammar.</p>`;
  }
  return grammarHtml;
}

function renderSense(sense, entry, index) {
  const translations = Array.isArray(sense.translations)
    ? sense.translations
    : [sense.translation || ''].filter(Boolean);
  const transClass = translations.some(t => isKyrgyz(t)) ? 'kyrgyz' : '';
  let tags = '';
  if (sense.pos) {
    tags += `<button class="pos" data-filter="pos" data-value="${escapeHtml(sense.pos)}">${escapeHtml(sense.pos)}</button>`;
  }
  const topic = sense.topic || entry.topic;
  if (topic) {
    tags += `<button class="topic-tag" data-filter="topic" data-value="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`;
  }
  const examples = (sense.examples || []).map(ex => `
    <li class="example-item">
      <span class="example-original kyrgyz">${escapeHtml(ex.kg)}</span>
      <span class="example-translation">${escapeHtml(ex.en)}</span>
    </li>
  `).join('');
  const grammar = renderGrammarSection(sense);
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
      ${entry.senses && entry.senses.length > 1 ? `<span class="sense-number">${index + 1}.</span>` : ''}
      <div class="translation ${transClass}">${translations.map(escapeHtml).join(', ')}</div>
      <div class="section-title">Examples</div>
      <ul class="examples-list">${examples}</ul>
      <div class="section-title">Grammar</div>
      ${grammar}
      <div class="section-title">Related</div>
      <div class="related-grid">${related}</div>
    </div>
  `;
}

function renderEntry(lemma, entry) {
  const isHeadwordKyrgyz = isKyrgyz(lemma);
  let sensesHtml = '';
  if (entry.senses && entry.senses.length > 1) {
    sensesHtml = entry.senses.map((sense, index) => renderSense(sense, entry, index)).join('');
  } else {
    const sense = entry.senses ? entry.senses[0] : entry;
    sensesHtml = renderSense(sense, entry);
  }
  let cefr = '';
  if (entry.cefr) {
    cefr = `<button class="level-tag" data-filter="cefr" data-value="${escapeHtml(entry.cefr)}" style="position:absolute; right:0; top:0;">${escapeHtml(entry.cefr).toUpperCase()}</button>`;
  }
  const isSaved = currentUser && savedWords.has(lemma);
  const heartSymbol = isSaved ? '❤️' : '♡';
  const heartClass = isSaved ? 'save-heart saved' : 'save-heart';
  const heartBtn = `<div class="${heartClass}" data-lemma="${escapeHtml(lemma)}">${heartSymbol}</div>`;
  return `
    <div class="entry" style="position:relative;">
      ${cefr}
      ${heartBtn}
      <div class="headword ${isHeadwordKyrgyz ? 'kyrgyz' : ''}">${escapeHtml(entry.canonical)}</div>
      <div class="pronunciation">${escapeHtml(entry.pronunciation)}</div>
      ${sensesHtml}
    </div>
  `;
}

function showResult(query) {
  const q = query.toLowerCase().trim();
  
  // Hide suggestions when showing a result
  hideSuggestions();
  
  if (!q) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    attachEventListeners();
    return;
  }
  
  const isKg = isKyrgyz(q);
  let found = false;
  
  // 1. Check for exact lemma match FIRST
  if (dictionary.kg[q]) {
    resultsContainer.innerHTML = renderEntry(q, dictionary.kg[q]);
    found = true;
  } 
  // 2. Check for form matches (grammatical forms)
  else {
    for (let w in dictionary.kg) {
      if (dictionary.kg[w].forms && dictionary.kg[w].forms.map(f => f.toLowerCase()).includes(q)) {
        resultsContainer.innerHTML = renderEntry(w, dictionary.kg[w]);
        found = true;
        break;
      }
    }
  }
  
  // 3. Check English translations (exact match)
  if (!found && !isKg) {
    const matches = [];
    for (let w in dictionary.kg) {
      (dictionary.kg[w].senses || [dictionary.kg[w]]).forEach(s => {
        const translations = s.translations || [s.translation || ''];
        // Check for exact match first
        if (translations.some(t => t.toLowerCase() === q)) {
          matches.unshift(w); // Put exact matches at the front
        } else if (translations.some(t => t.toLowerCase().startsWith(q))) {
          matches.push(w);
        }
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
  
  // 4. NEW FEATURE: Check for matches in examples (Issue i) - FIXED to search BOTH Kyrgyz AND English
  if (!found) { // Only search in examples for words with at least 2 chars
    const examples = [];
    
    for (let lemma in dictionary.kg) {
      const entry = dictionary.kg[lemma];
      (entry.senses || []).forEach(sense => {
        (sense.examples || []).forEach(ex => {
          const kgText = ex.kg;
          const enText = ex.en;
          
          // Create regex pattern to match whole words (case-insensitive)
          // This handles both Kyrgyz and English
          const escapedQuery = escapeRegExp(q);
          const wordPattern = new RegExp(`(?:^|\\s|[.,!?;:])${escapedQuery}(?:$|\\s|[.,!?;:])`, 'i');
          
          // Check if query appears as a whole word in Kyrgyz OR English examples
          const kgMatch = kgText && wordPattern.test(kgText);
          const enMatch = enText && wordPattern.test(enText);
          
          if (kgMatch || enMatch) {
            // Highlight the whole word match in the appropriate language
            const highlightedKg = kgMatch ? 
              kgText.replace(wordPattern, '<span class="lemma-highlight">$&</span>') : kgText;
            const highlightedEn = enMatch ? 
              enText.replace(wordPattern, '<span class="lemma-highlight">$&</span>') : enText;
            
            examples.push({ 
              lemma: lemma, 
              exampleKg: ex.kg, 
              exampleEn: ex.en,
              highlightedKg: highlightedKg,
              highlightedEn: highlightedEn
            });
          }
        });
      });
    }
    
    if (examples.length > 0) {
      // Remove duplicates (same lemma)
      const uniqueExamples = [];
      const seenLemmas = new Set();
      examples.forEach(ex => {
        if (!seenLemmas.has(ex.lemma)) {
          seenLemmas.add(ex.lemma);
          uniqueExamples.push(ex);
        }
      });
      
      const html = uniqueExamples.map(i => `
        <div class="example-match-item">
          <div class="example-original">${i.highlightedKg}</div>
          <div class="example-translation">${i.highlightedEn}</div>
          <button class="goto-lemma-btn" data-word="${i.lemma}">View "${i.lemma}"</button>
        </div>`).join('');
        
      resultsContainer.innerHTML = `
        <div class="no-result">
          <p>No direct entry for "${escapeHtml(query)}", but found in examples:</p>
          <div class="examples-in-context">${html}</div>
        </div>`;
      found = true;
      
      // Attach listeners for the "View" buttons
      resultsContainer.querySelectorAll('.goto-lemma-btn').forEach(btn => {
        btn.onclick = () => {
          const word = btn.dataset.word;
          searchInput.value = word;
          showResult(word);
        };
      });
    }
  }
  
  if (!found) {
    resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(query)}"</div>`;
  }
  
  attachEventListeners();
}

// Helper function for regex escaping
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showFilterList(filterType, value) {
  let titleText = '';
  if (filterType === 'pos') titleText = `${value.charAt(0).toUpperCase() + value.slice(1)}s`;
  else if (filterType === 'cefr') titleText = `${value.toUpperCase()}`;
  else if (filterType === 'topic') titleText = `${value.charAt(0).toUpperCase() + value.slice(1)}`;
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
      if (match && !filteredWords.includes(lemma)) {
        filteredWords.push(lemma);
        break;
      }
    }
  }
  if (filteredWords.length === 0) {
    modalBody.innerHTML = `<p>No words found for this filter.</p>`;
  } else {
    let html = `<ul class="filter-list">`;
    filteredWords.forEach(w => {
      html += `<li class="filter-item filter-word-item kyrgyz" data-word="${w}">${w}</li>`;
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
  const words = Object.keys(dictionary.kg);
  if (words.length === 0) return;
  const correct = words[Math.floor(Math.random() * words.length)];
  const sense = dictionary.kg[correct].senses ? dictionary.kg[correct].senses[0] : dictionary.kg[correct];
  const translations = Array.isArray(sense.translations) ? sense.translations : [sense.translation || ''];
  const answer = translations[0];
  const distractors = [];
  while (distractors.length < 3) {
    const r = words[Math.floor(Math.random() * words.length)];
    if (r === correct) continue;
    const rs = dictionary.kg[r].senses ? dictionary.kg[r].senses[0] : dictionary.kg[r];
    const rsPrimary = (Array.isArray(rs.translations) ? rs.translations[0] : rs.translation) || '';
    if (rsPrimary && !distractors.includes(rsPrimary) && rsPrimary !== answer) {
      distractors.push(rsPrimary);
    }
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
  const answerOptions = body.querySelectorAll('.answer-option');
  answerOptions.forEach(opt => {
    const newOpt = opt.cloneNode(true);
    opt.parentNode.replaceChild(newOpt, opt);
  });
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
      if (currentUser) updateQuizStats(isCorrect);
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
  document.querySelectorAll('.pos, .topic-tag, .level-tag').forEach(tag => {
    tag.replaceWith(tag.cloneNode(true));
  });
  document.querySelectorAll('[data-filter]').forEach(tag => {
    tag.addEventListener('click', () => {
      const filter = tag.dataset.filter;
      const value = tag.dataset.value;
      showFilterList(filter, value);
    });
  });
  document.querySelectorAll('.filter-word-item').forEach(item => {
    item.onclick = () => {
      searchInput.value = item.dataset.word;
      showResult(item.dataset.word);
      filterModal.style.display = 'none';
    };
  });
  document.querySelectorAll('.save-heart').forEach(btn => {
    const lemma = btn.dataset.lemma;
    btn.onclick = () => {
      if (!currentUser) {
        showTooltip(btn, 'Sign in to save words');
        return;
      }
      toggleSaveWord(lemma, btn);
    };
  });
  document.querySelectorAll('.saved-item').forEach(item => {
    item.onclick = () => {
      searchInput.value = item.dataset.word;
      showResult(item.dataset.word);
      savedModal.style.display = 'none';
    };
    const removeBtn = item.querySelector('.remove-word');
    if (removeBtn) {
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        const lemma = item.dataset.word;
        removeFromSaved(lemma);
        item.remove();
        const remaining = savedModalBody.querySelectorAll('.saved-item').length;
        if (remaining === 0) {
          savedModalBody.innerHTML = '<p>No saved words yet.</p>';
        }
        if (reviewBtn) reviewBtn.disabled = savedWords.size < 10;
      };
    }
  });
}

let supabase = null;
if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
  supabase = window.supabase.createClient(
    'https://jvizodlmiiisubatqykg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I'
  );
} else {
  console.warn('Supabase not loaded - using local dictionary');
}

let currentUser = null;
let savedWords = new Set();
let quizStats = { correct: 0, total: 0 };

function showTooltip(element, text) {
  const tooltip = document.createElement('div');
  tooltip.className = 'save-tooltip';
  tooltip.textContent = text;
  document.body.appendChild(tooltip);
  const rect = element.getBoundingClientRect();
  tooltip.style.left = (rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 8) + 'px';
  setTimeout(() => {
    if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
  }, 2000);
}

async function toggleSaveWord(lemma, btn) {
  const isCurrentlySaved = savedWords.has(lemma);
  if (isCurrentlySaved) {
    const { error } = await supabase
      .from('user_favourites')
      .delete()
      .eq('user_id', currentUser.id)
      .eq('lemma', lemma);
    if (!error) {
      savedWords.delete(lemma);
      btn.textContent = '♡';
      btn.classList.remove('saved');
    }
  } else {
    const { error } = await supabase
      .from('user_favourites')
      .insert({ user_id: currentUser.id, lemma });
    if (!error) {
      savedWords.add(lemma);
      btn.textContent = '❤️';
      btn.classList.add('saved');
    }
  }
  renderAuthIndicator();
  if (reviewBtn) reviewBtn.disabled = savedWords.size < 10;
}

async function removeFromSaved(lemma) {
  if (!currentUser) return;
  await supabase
    .from('user_favourites')
    .delete()
    .eq('user_id', currentUser.id)
    .eq('lemma', lemma);
  savedWords.delete(lemma);
  renderAuthIndicator();
  if (reviewBtn) reviewBtn.disabled = savedWords.size < 10;
}

async function updateSavedWords() {
  if (!currentUser) {
    savedWords.clear();
    return;
  }
  const { data, error } = await supabase
    .from('user_favourites')
    .select('lemma')
    .eq('user_id', currentUser.id);
  if (error) return;
  savedWords = new Set(data.map(item => item.lemma));
  renderAuthIndicator();
  if (reviewBtn) reviewBtn.disabled = savedWords.size < 10;
}

async function loadQuizStats() {
  if (!currentUser) {
    quizStats = { correct: 0, total: 0 };
    return;
  }
  const { data, error } = await supabase
    .from('user_quiz_stats')
    .select('correct, total')
    .eq('user_id', currentUser.id)
    .single();
  if (error && error.code !== 'PGRST116') return;
  if (data) {
    quizStats = { correct: data.correct, total: data.total };
  } else {
    quizStats = { correct: 0, total: 0 };
    await supabase.from('user_quiz_stats').insert({
      user_id: currentUser.id,
      correct: 0,
      total: 0
    });
  }
  renderAuthIndicator();
}

async function updateQuizStats(isCorrect) {
  if (!currentUser) return;
  quizStats.total += 1;
  if (isCorrect) quizStats.correct += 1;
  await supabase
    .from('user_quiz_stats')
    .update({ correct: quizStats.correct, total: quizStats.total })
    .eq('user_id', currentUser.id);
  renderAuthIndicator();
}

function renderAuthIndicator() {
  if (!authIndicator) return;
  if (!currentUser) {
    authIndicator.innerHTML = '<a id="signInLink">Sign in</a>';
    const link = document.getElementById('signInLink');
    if (link && authModal) {
      link.onclick = () => authModal.style.display = 'flex';
    }
  } else {
    const percent = quizStats.total > 0 ? Math.round((quizStats.correct / quizStats.total) * 100) : 0;
    authIndicator.innerHTML = `
      <span>
        <a id="savedCount">❤️ ${savedWords.size}</a> · 
        🤓 ${percent}% (${quizStats.correct}/${quizStats.total}) · 
        <a id="userActionsLink" style="text-decoration:none;">👤</a>
      </span>
    `;
    document.getElementById('savedCount').onclick = showSavedWords;
    document.getElementById('userActionsLink').onclick = toggleUserDropdown;
  }
}

function toggleUserDropdown() {
  if (!userDropdown) return;
  userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
  userDropdown.innerHTML = `
    <a href="#" id="dropdownSaved">Saved Words</a>
    <a href="#" id="dropdownReset">Reset Quiz Stats…</a>
    <a href="#" id="dropdownLogout">Logout</a>
  `;
  document.getElementById('dropdownSaved').onclick = (e) => { e.preventDefault(); showSavedWords(); };
  document.getElementById('dropdownReset').onclick = (e) => { 
    e.preventDefault(); 
    if (confirm('This will delete all your quiz statistics forever. Continue?')) {
      resetQuizStats(); 
    } 
  };
  document.getElementById('dropdownLogout').onclick = (e) => { e.preventDefault(); signOut(); };
}

async function resetQuizStats() {
  quizStats = { correct: 0, total: 0 };
  await supabase
    .from('user_quiz_stats')
    .update({ correct: 0, total: 0 })
    .eq('user_id', currentUser.id);
  renderAuthIndicator();
}

async function showSavedWords() {
  if (!savedModal || !savedModalBody) return;
  if (savedWords.size === 0) {
    savedModalBody.innerHTML = '<p>No saved words yet.</p>';
  } else {
    let html = '<ul class="saved-list">';
    Array.from(savedWords).forEach(w => {
      html += `
        <li class="saved-item kyrgyz" data-word="${w}">
          <span>${escapeHtml(w)}</span>
          <button class="remove-word" title="Remove">✕</button>
        </li>`;
    });
    html += '</ul>';
    savedModalBody.innerHTML = html;
  }
  savedModal.style.display = 'block';
  attachEventListeners();
}

async function handleAuth(e, type) {
  e.preventDefault();
  if (!emailInput || !passwordInput) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) return;
  let user = null;
  if (type === 'signin') {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Sign-in failed: ' + error.message);
      return;
    }
    user = data.user;
  } else {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('Sign-up failed: ' + error.message);
      return;
    }
    user = data.user;
    if (!user) {
      alert('Check email to confirm account.');
      return;
    }
  }
  if (user) {
    currentUser = user;
    await updateSavedWords();
    await loadQuizStats();
    renderAuthIndicator();
    if (authModal) authModal.style.display = 'none';
  }
}

async function signOut() {
  await supabase.auth.signOut();
  currentUser = null;
  savedWords.clear();
  quizStats = { correct: 0, total: 0 };
  renderAuthIndicator();
  if (reviewBtn) reviewBtn.disabled = true;
  if (userDropdown) userDropdown.style.display = 'none';
}

async function startFlashcardSession() {
  if (savedWords.size < 10) return;
  const words = Array.from(savedWords).sort(() => 0.5 - Math.random()).slice(0, 10);
  let currentIndex = 0;
  let responses = { '🙂': 0, '😐': 0, '😞': 0 };

  function showCard() {
    if (currentIndex >= words.length) {
      const summary = `🙂×${responses['🙂']}, 😐×${responses['😐']}, 😞×${responses['😞']}`;
      if (!flashcardModalBody) return;
      flashcardModalBody.innerHTML = `
        <div class="flashcard-content">
          <h3>Session complete!</h3>
          <p>${summary}</p>
        </div>
      `;
      return;
    }
    const word = words[currentIndex];
    const entry = dictionary.kg[word];
    const sense = entry?.senses ? entry.senses[0] : entry;
    const translation = sense?.translation || '—';
    if (!flashcardModalBody) return;
    flashcardModalBody.innerHTML = `
      <div class="flashcard-content">
        <div class="flashcard-progress">${currentIndex + 1}/10</div>
        <div class="flashcard-word">${escapeHtml(word)}</div>
        <div class="flashcard-translation" style="display:none;">${escapeHtml(translation)}</div>
        <div class="flashcard-emojis">
          <button id="happyBtn">🙂</button>
          <button id="mehBtn">😐</button>
          <button id="sadBtn">😞</button>
        </div>
      </div>
    `;
    document.getElementById('happyBtn').onclick = () => handleResponse('🙂');
    document.getElementById('mehBtn').onclick = () => handleResponse('😐');
    document.getElementById('sadBtn').onclick = () => handleResponse('😞');
  }

  function handleResponse(emoji) {
    const buttons = flashcardModalBody.querySelectorAll('.flashcard-emojis button');
    buttons.forEach(b => b.disabled = true);
    responses[emoji]++;
    const translationEl = flashcardModalBody.querySelector('.flashcard-translation');
    if (translationEl) {
      translationEl.style.display = 'block';
    }
    const existingNext = flashcardModalBody.querySelector('.flashcard-next');
    if (existingNext) existingNext.remove();
    const nextBtn = document.createElement('button');
    nextBtn.className = 'flashcard-next';
    nextBtn.textContent = '➡️';
    nextBtn.onclick = () => {
      currentIndex++;
      showCard();
    };
    const emojisContainer = flashcardModalBody.querySelector('.flashcard-emojis');
    if (emojisContainer) {
      emojisContainer.parentNode.insertBefore(nextBtn, emojisContainer.nextSibling);
    }
  }

  if (flashcardModal) flashcardModal.style.display = 'flex';
  showCard();
}

function setupAuthToggle() {
  if (!authToggle) return;
  authToggle.onclick = (e) => {
    e.preventDefault();
    if (!authModalTitle) return;
    const isSignIn = authModalTitle.textContent === 'Sign In';
    if (isSignIn) {
      authModalTitle.textContent = 'Sign Up';
      if (document.querySelector('.auth-signin')) document.querySelector('.auth-signin').style.display = 'none';
      if (document.querySelector('.auth-signup')) document.querySelector('.auth-signup').style.display = 'block';
      authToggle.innerHTML = 'Already have an account? <a href="#" id="toggleAuth">Sign in</a>';
    } else {
      authModalTitle.textContent = 'Sign In';
      if (document.querySelector('.auth-signin')) document.querySelector('.auth-signin').style.display = 'block';
      if (document.querySelector('.auth-signup')) document.querySelector('.auth-signup').style.display = 'none';
      authToggle.innerHTML = 'New here? <a href="#" id="toggleAuth">Create an account</a>';
    }
    setupAuthToggle();
  };
}

let suggestionTimeout;
let selectedSuggestionIndex = -1;
const suggestionsContainer = document.getElementById('searchSuggestions');

function showSuggestions(query) {
  // Issue ii.a: Changed from 2 to 4 characters minimum
  if (!dictionaryLoadedFromSupabase || query.length < 4) {
    suggestionsContainer.style.display = 'none';
    selectedSuggestionIndex = -1;
    return;
  }

  const lowerQuery = query.toLowerCase();
  const matches = new Map(); // Use Map to track lemmas with their priority

  // Add lemmas that start with the query (highest priority)
  Object.keys(dictionary.kg).forEach(lemma => {
    if (lemma.toLowerCase().startsWith(lowerQuery)) {
      matches.set(lemma, 1); // Priority 1 for lemma match
    }
  });

  // Issue ii.c: CRITICAL FIX - Add forms that match EXACTLY
  Object.entries(dictionary.kg).forEach(([lemma, entry]) => {
    if (entry.forms) {
      // Check for EXACT matches first (highest priority for forms)
      if (entry.forms.some(f => f.toLowerCase() === lowerQuery)) {
        matches.set(lemma, 0); // Priority 0 (highest) for exact form match
      }
      // Also check for partial matches
      else if (entry.forms.some(f => f.toLowerCase().startsWith(lowerQuery))) {
        if (!matches.has(lemma) || matches.get(lemma) > 2) {
          matches.set(lemma, 2); // Priority 2 for partial form match
        }
      }
    }
  });

  // Add English translations
  Object.entries(dictionary.kg).forEach(([lemma, entry]) => {
    (entry.senses || [entry]).forEach(sense => {
      const translations = sense.translations || [sense.translation || ''];
      if (translations.some(t => t.toLowerCase().startsWith(lowerQuery))) {
        if (!matches.has(lemma) || matches.get(lemma) > 3) {
          matches.set(lemma, 3); // Priority 3 for translation match
        }
      }
    });
  });

  // Sort matches by priority (0 = highest) and then alphabetically
  const sortedMatches = Array.from(matches.entries())
    .sort((a, b) => {
      // First by priority
      if (a[1] !== b[1]) return a[1] - b[1];
      // Then alphabetically
      return a[0].localeCompare(b[0]);
    })
    .map(entry => entry[0])
    .slice(0, 8);

  if (sortedMatches.length === 0) {
    suggestionsContainer.style.display = 'none';
    selectedSuggestionIndex = -1;
    return;
  }

  let html = '';
  sortedMatches.forEach((match, index) => {
    const isSelected = index === selectedSuggestionIndex;
    html += `<div class="search-suggestion ${isSelected ? 'selected' : ''}" data-word="${escapeHtml(match)}">${escapeHtml(match)}</div>`;
  });
  suggestionsContainer.innerHTML = html;
  suggestionsContainer.style.display = 'block';

  suggestionsContainer.querySelectorAll('.search-suggestion').forEach((item, index) => {
    item.onclick = () => {
      searchInput.value = item.dataset.word;
      hideSuggestions();
      showResult(item.dataset.word);
    };
    item.onmouseover = () => {
      selectedSuggestionIndex = index;
      updateSelectedSuggestion();
    };
  });
}


function hideSuggestions() {
  suggestionsContainer.style.display = 'none';
  selectedSuggestionIndex = -1;
}

function updateSelectedSuggestion() {
  const items = suggestionsContainer.querySelectorAll('.search-suggestion');
  items.forEach((item, index) => {
    if (index === selectedSuggestionIndex) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
}

searchInput.addEventListener('keydown', (e) => {
  // First check if we should show the entry directly
  const query = searchInput.value.trim();
  
  // If Enter is pressed, always show result directly
  if (e.key === 'Enter') {
    e.preventDefault();
    showResult(query);
    hideSuggestions();
    return;
  }
  
  const items = suggestionsContainer.querySelectorAll('.search-suggestion');
  if (suggestionsContainer.style.display === 'none') return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, items.length - 1);
    updateSelectedSuggestion();
    items[selectedSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
    updateSelectedSuggestion();
    if (selectedSuggestionIndex >= 0) {
      items[selectedSuggestionIndex]?.scrollIntoView({ block: 'nearest' });
    }
  } else if (e.key === 'Escape') {
    hideSuggestions();
  }
});

searchInput.addEventListener('input', (e) => {
  clearTimeout(suggestionTimeout);
  const value = e.target.value;
  const trimmedValue = value.trim();
  
  if (trimmedValue === '') {
    hideSuggestions();
    showResult('');
    return;
  }
  
  const lowerValue = trimmedValue.toLowerCase();
  let shouldShowResultImmediately = false;
  
  // Check for exact matches that should show result immediately
  for (let lemma in dictionary.kg) {
    const entry = dictionary.kg[lemma];
    
    // 1. Check exact lemma match
    if (lemma.toLowerCase() === lowerValue) {
      shouldShowResultImmediately = true;
      break;
    }
    
    // 2. Check exact form match (Issue ii.c)
    if (entry.forms && entry.forms.some(f => f.toLowerCase() === lowerValue)) {
      shouldShowResultImmediately = true;
      break;
    }
    
    // 3. Check exact English translation match
    (entry.senses || [entry]).forEach(s => {
      const translations = s.translations || [s.translation || ''];
      if (translations.some(t => t.toLowerCase() === lowerValue)) {
        shouldShowResultImmediately = true;
      }
    });
    
    if (shouldShowResultImmediately) break;
  }
  
  // If there's an exact match, show the result immediately
  if (shouldShowResultImmediately) {
    hideSuggestions();
    showResult(trimmedValue);
    return;
  }
  
  // Otherwise, show suggestions after delay
  suggestionTimeout = setTimeout(() => {
    showSuggestions(value);
  }, 150);
});


let isClickingSuggestion = false;
suggestionsContainer.addEventListener('mousedown', () => {
  isClickingSuggestion = true;
});
searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    if (!isClickingSuggestion) {
      hideSuggestions();
    }
    isClickingSuggestion = false;
  }, 150);
});

if (closeModal) closeModal.onclick = () => { if (filterModal) filterModal.style.display = 'none'; };
if (closeExerciseModal) closeExerciseModal.onclick = () => { if (exerciseModal) exerciseModal.style.display = 'none'; };
if (closeSavedModal) closeSavedModal.onclick = () => { if (savedModal) savedModal.style.display = 'none'; };
if (closeFlashcardModal) closeFlashcardModal.onclick = () => { if (flashcardModal) flashcardModal.style.display = 'none'; };
if (closeAuthModal) closeAuthModal.onclick = () => { if (authModal) authModal.style.display = 'none'; };

if (authForm) authForm.onsubmit = (e) => handleAuth(e, 'signin');
if (document.querySelector('.auth-signup')) {
  document.querySelector('.auth-signup').onclick = (e) => {
    e.preventDefault();
    handleAuth(e, 'signup');
  };
}

setupAuthToggle();

if (reviewBtn) {
  reviewBtn.onclick = () => {
    if (currentUser && savedWords.size >= 10) {
      startFlashcardSession();
    } else if (!currentUser && authModal) {
      authModal.style.display = 'flex';
    }
  };
  reviewBtn.onmouseenter = () => {
    if (reviewBtn.disabled && currentUser) {
      showTooltip(reviewBtn, 'Save at least 10 words first');
    }
  };
}

document.addEventListener('click', (e) => {
  if (authIndicator && userDropdown && !authIndicator.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.style.display = 'none';
  }
});

window.onclick = (e) => {
  if (e.target === filterModal) filterModal.style.display = 'none';
  if (e.target === exerciseModal) exerciseModal.style.display = 'none';
  if (e.target === savedModal) savedModal.style.display = 'none';
  if (e.target === flashcardModal) flashcardModal.style.display = 'none';
  if (e.target === authModal) authModal.style.display = 'none';
};

(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await updateSavedWords();
    await loadQuizStats();
  }
  renderAuthIndicator();
  if (reviewBtn) reviewBtn.disabled = !currentUser || savedWords.size < 10;
})();

if (title) title.onclick = () => { if (searchInput) searchInput.value = ''; showResult(''); };
if (randomBtn) randomBtn.onclick = () => { const w = getRandomWord(); if (searchInput) searchInput.value = w; showResult(w); };
if (exerciseBtn) exerciseBtn.onclick = generateExercise;
if (keyboardToggleBtn) {
  keyboardToggleBtn.onclick = () => {
    const isHidden = virtualKeyboard.style.display === 'none';
    virtualKeyboard.style.display = isHidden ? 'block' : 'none';
    keyboardToggleBtn.textContent = isHidden ? '⌨️ Hide Keyboard' : '⌨️ Show Keyboard';
  };
}

document.querySelectorAll('.key').forEach(k => {
  k.onclick = () => {
    const act = k.dataset.action;
    if (act === 'backspace') {
      if (searchInput) searchInput.value = searchInput.value.slice(0, -1);
    } else if (act === 'space') {
      if (searchInput) searchInput.value += ' ';
    } else {
      if (searchInput) searchInput.value += k.textContent;
    }
    if (searchInput) {
      searchInput.focus();
      const event = new Event('input');
      searchInput.dispatchEvent(event);
    }
  };
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFromSupabase);
} else {
  loadFromSupabase();
}
showResult('');
attachEventListeners();

async function loadFromSupabase() {
  if (typeof window.supabase === 'undefined') {
    console.warn('Supabase SDK not loaded. Using fallback dictionary.');
    return;
  }
  try {
    const client = window.supabase.createClient(
      'https://jvizodlmiiisubatqykg.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aXpvZGxtaWlpc3ViYXRxeWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYxNTYsImV4cCI6MjA3NzI0MjE1Nn0.YD9tMUyQVq7v5gkWq-f_sQfYfD2raq_o7FeOmLjeN7I'
    );
    const { data: lemmas, error: lemmasErr } = await client.from('lemmas').select('id, canonical, pronunciation, cefr');
    if (lemmasErr) throw lemmasErr;
    const idToLemma = {};
    const newDict = {};
    lemmas.forEach(l => {
      idToLemma[l.id] = l.canonical;
      newDict[l.canonical] = {
        canonical: l.canonical,
        pronunciation: l.pronunciation || '',
        cefr: l.cefr,
        forms: [],
        senses: []
      };
    });
    const lemmaIds = lemmas.map(l => l.id);
    const { data: forms } = await client.from('forms').select('lemma_id, form').in('lemma_id', lemmaIds);
    forms?.forEach(f => {
      if (newDict[idToLemma[f.lemma_id]]) {
        newDict[idToLemma[f.lemma_id]].forms.push(f.form);
      }
    });
    const { data: senses } = await client.from('senses').select('id, lemma_id, pos, translation, topic, grammar').in('lemma_id', lemmaIds);
    if (!senses || senses.length === 0) return;
    const senseIdToLemma = {};
    senses.forEach(s => {
      const lemmaKey = idToLemma[s.lemma_id];
      if (lemmaKey) {
        senseIdToLemma[s.id] = lemmaKey;
        const transStr = s.translation || '';
        const translations = transStr
          .split(',')
          .map(t => t.trim())
          .filter(t => t);
        let grammarObj = {};
        if (s.grammar) {
          try {
            grammarObj = typeof s.grammar === 'string' ? JSON.parse(s.grammar) : s.grammar;
          } catch (e) {
            console.warn('Invalid JSON in grammar for sense:', s.id);
            grammarObj = {};
          }
        }
        const senseObj = {
          pos: s.pos,
          translation: translations[0] || '',
          translations: translations,
          topic: s.topic,
          grammar: grammarObj,
          examples: [],
          related: []
        };
        newDict[lemmaKey].senses.push(senseObj);
      }
    });
    const senseIds = senses.map(s => s.id);
    const { data: examples } = await client.from('examples').select('sense_id, kg, en').in('sense_id', senseIds);
    examples?.forEach(ex => {
      const lemmaKey = senseIdToLemma[ex.sense_id];
      if (lemmaKey) {
        const sense = newDict[lemmaKey].senses.find(s => s.pos === senses.find(ss => ss.id === ex.sense_id)?.pos);
        if (sense) sense.examples.push({ kg: ex.kg, en: ex.en });
      }
    });
    const { data: related } = await client.from('related').select('sense_id, word, translation').in('sense_id', senseIds);
    related?.forEach(r => {
      const lemmaKey = senseIdToLemma[r.sense_id];
      if (lemmaKey) {
        const sense = newDict[lemmaKey].senses.find(s => s.pos === senses.find(ss => ss.id === r.sense_id)?.pos);
        if (sense) sense.related.push({ word: r.word, translation: r.translation });
      }
    });
    dictionary = { kg: newDict };
    dictionaryLoadedFromSupabase = true;
    normalizeDictionary(dictionary);
    if (searchInput.value.trim()) {
      showResult(searchInput.value);
    }
  } catch (err) {
    console.error('Failed to load from Supabase:', err);
  }
}

function normalizeDictionary(dict) {
  for (const lemma in dict.kg) {
    const entry = dict.kg[lemma];
    const senses = entry.senses || [entry];
    senses.forEach(sense => {
      if (typeof sense.translation === 'string' && !Array.isArray(sense.translations)) {
        sense.translations = sense.translation
          .split(',')
          .map(t => t.trim())
          .filter(t => t);
        sense.translation = sense.translations[0] || '';
      } else if (!sense.translations) {
        sense.translations = [sense.translation || ''];
      }
    });
  }
}
