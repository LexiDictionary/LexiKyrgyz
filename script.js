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

let dictionary = {
  kg: {
    "жазуу": {
      canonical: "жазуу",
      pronunciation: "/d͡ʒɑzuː/",
      topic: "communication",
      cefr: "A2",
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
                "ал": "жазбайт",
                "биз": "жазбайбыз",
                "силер": "жазбайсыңар",
                "сиздер": "жазбайсыздар",
                "алар": "жазышпайт"
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
                "ал": "жазбайт",
                "биз": "жазбайбыз",
                "силер": "жазбайсыңар",
                "сиздер": "жазбайсыздар",
                "алар": "жазышпайт"
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
  const lineStyle = `
    display: block;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 0.88rem;
    margin: 18px 0 6px 8px;
    line-height: 1.4;
  `.replace(/\s+/g, ' ').trim();

  const valueStyle = `
    margin-left: 8px;
    font-size: 0.94rem;
    font-weight: normal;
    color: var(--text-primary);
  `.replace(/\s+/g, ' ').trim();

  if (grammarObj.comparative) {
    html += `<div style="${lineStyle}">
               <span style="display:inline-block; min-width:110px;">Comparative:</span>
               <span style="${valueStyle}" class="kyrgyz">${escapeHtml(grammarObj.comparative)}</span>
             </div>`;
  }
  if (grammarObj.superlative) {
    html += `<div style="${lineStyle}">
               <span style="display:inline-block; min-width:110px;">Superlative:</span>
               <span style="${valueStyle}" class="kyrgyz">${escapeHtml(grammarObj.superlative)}</span>
             </div>`;
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
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr>
      <th style="text-align:left; padding:6px 8px;">Person</th>
      <th style="padding:6px 8px;">Positive</th>
      <th style="padding:6px 8px;">Negative</th>
    </tr></thead><tbody>`;
    persons.forEach(person => {
      const pos = tenses.present.positive?.[person] || '—';
      const neg = tenses.present.negative?.[person] || '—';
      html += `<tr>
        <td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pos)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(neg)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }

  if (tenses.past_definite || tenses.past_indefinite) {
    html += `<div class="section-title" style="margin-top:24px;">Past Tenses</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr>
      <th style="text-align:left; padding:6px 8px;">Person</th>
      <th style="padding:6px 8px;">Past (Definite)<br><small>Positive</small></th>
      <th style="padding:6px 8px;">Past (Definite)<br><small>Negative</small></th>
      <th style="padding:6px 8px;">Past (Indefinite)<br><small>Positive</small></th>
      <th style="padding:6px 8px;">Past (Indefinite)<br><small>Negative</small></th>
    </tr></thead><tbody>`;
    persons.forEach(person => {
      const pd_pos = tenses.past_definite?.positive?.[person] || '—';
      const pd_neg = tenses.past_definite?.negative?.[person] || '—';
      const pi_pos = tenses.past_indefinite?.positive?.[person] || '—';
      const pi_neg = tenses.past_indefinite?.negative?.[person] || '—';
      html += `<tr>
        <td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pd_pos)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pd_neg)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pi_pos)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pi_neg)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }

  if (tenses.future_definite || tenses.future_indefinite) {
    html += `<div class="section-title" style="margin-top:24px;">Future Tenses</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr>
      <th style="text-align:left; padding:6px 8px;">Person</th>
      <th style="padding:6px 8px;">Future (Definite)<br><small>Positive</small></th>
      <th style="padding:6px 8px;">Future (Definite)<br><small>Negative</small></th>
      <th style="padding:6px 8px;">Future (Indefinite)<br><small>Positive</small></th>
      <th style="padding:6px 8px;">Future (Indefinite)<br><small>Negative</small></th>
    </tr></thead><tbody>`;
    persons.forEach(person => {
      const fd_pos = tenses.future_definite?.positive?.[person] || '—';
      const fd_neg = tenses.future_definite?.negative?.[person] || '—';
      const fi_pos = tenses.future_indefinite?.positive?.[person] || '—';
      const fi_neg = tenses.future_indefinite?.negative?.[person] || '—';
      html += `<tr>
        <td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fd_pos)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fd_neg)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fi_pos)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(fi_neg)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
  }

  if (tenses.conditional || tenses.conditional_past) {
    html += `<div class="section-title" style="margin-top:24px;">Conditional Forms</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr>
      <th style="text-align:left; padding:6px 8px;">Person</th>
      <th style="padding:6px 8px;">Conditional<br><small>Positive</small></th>
      <th style="padding:6px 8px;">Conditional<br><small>Negative</small></th>
      <th style="padding:6px 8px;">Conditional Past<br><small>Positive</small></th>
      <th style="padding:6px 8px;">Conditional Past<br><small>Negative</small></th>
    </tr></thead><tbody>`;
    persons.forEach(person => {
      const c_pos = tenses.conditional?.positive?.[person] || '—';
      const c_neg = tenses.conditional?.negative?.[person] || '—';
      const cp_pos = tenses.conditional_past?.positive?.[person] || '—';
      const cp_neg = tenses.conditional_past?.negative?.[person] || '—';
      html += `<tr>
        <td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(person)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(c_pos)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(c_neg)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(cp_pos)}</td>
        <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(cp_neg)}</td>
      </tr>`;
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
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left; padding:6px 8px;"></th>
          <th colspan="2" style="padding:6px 8px; text-align:center;">Positive</th>
          <th colspan="2" style="padding:6px 8px; text-align:center;">Negative</th>
        </tr>
        <tr style="font-size:0.8rem; color:var(--text-muted);">
          <th></th>
          <th style="padding:4px 8px;">Informal</th>
          <th style="padding:4px 8px;">Formal</th>
          <th style="padding:4px 8px;">Informal</th>
          <th style="padding:4px 8px;">Formal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:6px 8px; color:var(--text-muted);">Singular</td>
          <td class="kyrgyz">${escapeHtml(sgInfPos)}</td>
          <td class="kyrgyz">${escapeHtml(sgForPos)}</td>
          <td class="kyrgyz">${escapeHtml(sgInfNeg)}</td>
          <td class="kyrgyz">${escapeHtml(sgForNeg)}</td>
        </tr>
        <tr>
          <td style="padding:6px 8px; color:var(--text-muted);">Plural</td>
          <td class="kyrgyz">${escapeHtml(plInfPos)}</td>
          <td class="kyrgyz">${escapeHtml(plForPos)}</td>
          <td class="kyrgyz">${escapeHtml(plInfNeg)}</td>
          <td class="kyrgyz">${escapeHtml(plForNeg)}</td>
        </tr>
      </tbody>
    </table>`;
  }

  if (grammarObj.participles) {
    html += `<div class="section-title" style="margin-top:24px;">Participles</div>`;
    html += `<table class="grammar-table" style="font-size:0.92rem; width:100%; margin-top:8px;"><thead><tr>
      <th style="text-align:left; padding:6px 8px;">Type</th>
      <th style="padding:6px 8px;">Positive</th>
      <th style="padding:6px 8px;">Negative</th>
    </tr></thead><tbody>`;
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
        html += `<tr>
          <td style="padding:6px 8px; color:var(--text-muted);">${escapeHtml(label)}</td>
          <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(pos)}</td>
          <td style="padding:6px 8px;" class="kyrgyz">${escapeHtml(neg)}</td>
        </tr>`;
      }
    });
    html += `</tbody></table>`;
  }

  html += `<p style="font-size:0.84rem; color:var(--text-light); margin-top:16px; font-style:italic;">
    The Kyrgyz verb table is more complex; this version shows the main conjugation forms for learners.
  </p>`;
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
    cefr = `<div class="tags-container" style="position:absolute; right:0; top:0;">
      <button class="level-tag" data-filter="cefr" data-value="${escapeHtml(entry.cefr)}">${escapeHtml(entry.cefr).toUpperCase()}</button>
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

function showResult(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    resultsContainer.innerHTML = `<div class="about-section"><div class="section-title">About</div><p class="about-content">bla blabla bla</p></div>`;
    attachEventListeners();
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
        const translations = s.translations || [s.translation || ''];
        if (translations.some(t => t.toLowerCase() === q)) matches.push(w);
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
}

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
    console.log('Dictionary loaded from Supabase');
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

let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => showResult(e.target.value), 250);
});

title.onclick = () => { searchInput.value = ''; showResult(''); };
randomBtn.onclick = () => { const w = getRandomWord(); searchInput.value = w; showResult(w); };
exerciseBtn.onclick = generateExercise;
closeModal.onclick = () => filterModal.style.display = 'none';
closeExerciseModal.onclick = () => exerciseModal.style.display = 'none';
keyboardToggleBtn.onclick = () => {
  const isHidden = virtualKeyboard.style.display === 'none';
  virtualKeyboard.style.display = isHidden ? 'block' : 'none';
  keyboardToggleBtn.textContent = isHidden ? '⌨️ Hide Keyboard' : '⌨️ Show Keyboard';
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadFromSupabase);
} else {
  loadFromSupabase();
}
