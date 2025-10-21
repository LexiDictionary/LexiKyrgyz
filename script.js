function isKyrgyz(text) {
  return /[\u0400-\u04FF]/.test(text);
}

const dictionary = {
  en: {
    "apple": {
      canonical: "apple",
      pronunciation: "/ˈæp.əl/",
      topic: "food",
      forms: ["apple", "apples"],
      senses: [
        {
          pos: "noun",
          definition: "a round fruit with red or green skin",
          translation: "алма",
          examples: [
            { en: "She ate an apple for lunch.", kg: "Ал түштүккө алма жеди." },
            { en: "Apples grow on trees.", kg: "Алма даракта өсөт." }
          ],
          derivatives: [
            { word: "apple pie", translation: "алма пирогу" },
            { word: "applesauce", translation: "алма пюреси" }
          ],
          grammar: { plural: "apples" }
        }
      ]
    },
    "fire": {
      canonical: "fire",
      pronunciation: "/faɪər/",
      senses: [
        {
          pos: "noun",
          topic: "nature",
          definition: "burning material",
          translation: "от",
          examples: [
            { en: "Be careful with the fire.", kg: "От менен абай болуңуз." },
            { en: "The campfire kept us warm.", kg: "Лагердеги от бизди жылытты." }
          ],
          derivatives: [
            { word: "fiery", translation: "оттуу" },
            { word: "fireplace", translation: "от жагуучу жай" }
          ],
          grammar: { plural: "fires" }
        },
        {
          pos: "verb",
          topic: "employment",
          definition: "dismiss from job",
          translation: "жумуштан чыгаруу",
          examples: [
            { en: "They fired him for being late.", kg: "Ал кечиккендиктен жумуштан чыгарылды." },
            { en: "She was fired last week.", kg: "Ал өткөн аптада жумуштан чыгарылды." }
          ],
          derivatives: [
            { word: "firing", translation: "жумуштан чыгаруу" },
            { word: "fireable", translation: "жумуштан чыгарылышы мүмкүн" }
          ],
          grammar: {
            past: "fired",
            pastParticiple: "fired",
            presentParticiple: "firing",
            thirdPerson: "fires"
          }
        }
      ],
      forms: ["fire", "fires", "fired", "firing"]
    },
    "beautiful": {
      canonical: "beautiful",
      pronunciation: "/ˈbjuː.tɪ.fəl/",
      topic: "description",
      senses: [
        {
          pos: "adjective",
          definition: "pleasing the senses or mind aesthetically",
          translation: "сүйкүмдүү",
          examples: [
            { en: "She is a beautiful woman.", kg: "Ал сүйкүмдүү аял." },
            { en: "What a beautiful day!", kg: "Кандай сүйкүмдүү күн!" }
          ],
          derivatives: [
            { word: "beauty", translation: "сүйкүмдүүлүк" },
            { word: "beautifully", translation: "сүйкүмдүү түрдө" }
          ],
          grammar: { comparative: "more beautiful", superlative: "most beautiful" }
        }
      ],
      forms: ["beautiful", "more beautiful", "most beautiful"]
    },
    "water": {
      canonical: "water",
      pronunciation: "/ˈwɔː.tər/",
      topic: "nature",
      forms: ["water", "waters"],
      senses: [
        {
          pos: "noun",
          definition: "clear liquid",
          translation: "суу",
          examples: [
            { en: "Drink more water every day.", kg: "Күн сайын көбүрөөк суу ичиңиз." },
            { en: "The water in this lake is clean.", kg: "Бул көлдүн суусу таза." }
          ],
          derivatives: [
            { word: "watery", translation: "суулуу" },
            { word: "watering", translation: "суу куюу" }
          ],
          grammar: { plural: "waters" }
        }
      ]
    },
    "run": {
      canonical: "run",
      pronunciation: "/rʌn/",
      topic: "action",
      forms: ["run", "runs", "ran", "running"],
      senses: [
        {
          pos: "verb",
          definition: "move quickly on foot",
          translation: "жүгүрүү",
          examples: [
            { en: "She runs every morning.", kg: "Ал ар күнү эртең менен жүгүрөт." },
            { en: "Don’t run near the pool.", kg: "Бассейн жанында жүгүрбө." }
          ],
          derivatives: [
            { word: "runner", translation: "жүгүрүүчү" },
            { word: "running", translation: "жүгүрүү" }
          ],
          grammar: {
            past: "ran",
            pastParticiple: "run",
            presentParticiple: "running",
            thirdPerson: "runs"
          }
        }
      ]
    },
    "book": {
      canonical: "book",
      pronunciation: "/bʊk/",
      topic: "education",
      forms: ["book", "books"],
      senses: [
        {
          pos: "noun",
          definition: "collection of pages with text or images",
          translation: "китеп",
          examples: [
            { en: "I read a book every night.", kg: "Мен ар кече китеп окуп жатам." },
            { en: "This book is very interesting.", kg: "Бул китеп абдан кызыктуу." }
          ],
          derivatives: [
            { word: "bookshelf", translation: "китеп салгыч" },
            { word: "bookmark", translation: "китеп белгиси" }
          ],
          grammar: { plural: "books" }
        }
      ]
    },
    "happy": {
      canonical: "happy",
      pronunciation: "/ˈhæp.i/",
      topic: "emotions",
      senses: [
        {
          pos: "adjective",
          definition: "feeling or showing pleasure or contentment",
          translation: "баакыттуу",
          examples: [
            { en: "I'm happy to see you.", kg: "Сени көрүп турганыма кубанычтынам." },
            { en: "She has a happy family.", kg: "Анын баакыттуу үй-бүлөсү бар." }
          ],
          derivatives: [
            { word: "happiness", translation: "баакыт" },
            { word: "happily", translation: "баакыттуу түрдө" }
          ],
          grammar: { comparative: "happier", superlative: "happiest" }
        }
      ],
      forms: ["happy", "happier", "happiest"]
    },
    "thank you": {
      canonical: "thank you",
      pronunciation: "/θæŋk juː/",
      topic: "politeness",
      senses: [
        {
          pos: "fixed expression",
          definition: "an expression of gratitude",
          translation: "рахмат",
          examples: [
            { en: "Thank you for your help.", kg: "Жардамыңыз үчүн рахмат!" },
            { en: "Thank you very much!", kg: "Чындап рахмат!" }
          ],
          derivatives: [],
          grammar: {}
        }
      ],
      forms: ["thank you"]
    },
    "house": {
      canonical: "house",
      pronunciation: "/haʊs/",
      topic: "housing",
      forms: ["house", "houses"],
      senses: [
        {
          pos: "noun",
          definition: "building for living",
          translation: "үй",
          examples: [
            { en: "They built a new house.", kg: "Алар жаңы үй курушуу." },
            { en: "Home is where the heart is.", kg: "Үй - жүрөгүң жаткан жер." }
          ],
          derivatives: [
            { word: "household", translation: "үй-бүлө" },
            { word: "housing", translation: "жайлар" }
          ],
          grammar: { plural: "houses" }
        }
      ]
    }
  },
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
          cognates: [],
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
            { en: "Don’t touch the fire.", kg: "Отту тийбейли." }
          ],
          derivatives: [
            { word: "от дөлө", translation: "flame" },
            { word: "от коргоочу", translation: "firefighter" }
          ],
          cognates: [],
          grammar: {
            accusative: "отту",
            plural: "оттор"
          }
        }
      ]
    },
    "сүйкүмдүү": {
      canonical: "сүйкүмдүү",
      pronunciation: "/süyküm düü/",
      topic: "description",
      cefr: "A2",
      forms: ["сүйкүмдүү", "көбүрөөк сүйкүмдүү", "эң сүйкүмдүү"],
      senses: [
        {
          pos: "adjective",
          definition: "pleasing the senses or mind aesthetically",
          translation: "beautiful",
          examples: [
            { en: "She is beautiful.", kg: "Ал сүйкүмдүү." },
            { en: "What a beautiful flower!", kg: "Кандай сүйкүмдүү гүл!" }
          ],
          derivatives: [
            { word: "сүйкүмдүүлүк", translation: "beauty" },
            { word: "сүйкүмдүү түрдө", translation: "beautifully" }
          ],
          cognates: [],
          grammar: { 
            comparative: "көбүрөөк сүйкүмдүү", 
            superlative: "эң сүйкүмдүү" 
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
          cognates: [],
          grammar: {
            accusative: "сууну",
            plural: "сулар"
          }
        }
      ]
    },
    "жүгүрүү": {
      canonical: "жүгүрүү",
      pronunciation: "/jügürüü/",
      topic: "action",
      cefr: "A2",
      forms: ["жүгүрүү", "жүгүрдүм", "жүгүрүп жатам", "жүгүрөт"],
      senses: [
        {
          pos: "verb",
          definition: "move quickly on foot",
          translation: "run",
          examples: [
            { en: "I run every morning.", kg: "Мен ар күнү эртең менен жүгүрөм." },
            { en: "He ran to school.", kg: "Ал мектепке жүгүрдү." }
          ],
          derivatives: [
            { word: "жүгүрүүчү", translation: "runner" },
            { word: "жүгүрүү", translation: "running" }
          ],
          cognates: [],
          grammar: {
            past: "жүгүрдүм",
            presentParticiple: "жүгүрүп жатам",
            thirdPerson: "жүгүрөт"
          }
        }
      ]
    },
    "китеп": {
      canonical: "китеп",
      pronunciation: "/kitep/",
      topic: "education",
      cefr: "A1",
      forms: ["китеп", "китепти", "китептер"],
      senses: [
        {
          pos: "noun",
          definition: "collection of pages with text or images",
          translation: "book",
          examples: [
            { en: "I read a book.", kg: "Мен китеп окуп жатам." },
            { en: "The book is on the table.", kg: "Китеп столдо жатат." }
          ],
          derivatives: [
            { word: "китепкана", translation: "library" },
            { word: "китеп мукабасы", translation: "book cover" }
          ],
          cognates: [],
          grammar: {
            accusative: "китепти",
            plural: "китептер"
          }
        }
      ]
    },
    "баакыттуу": {
      canonical: "баакыттуу",
      pronunciation: "/baakyttuu/",
      topic: "emotions",
      cefr: "A2",
      forms: ["баакыттуу", "көбүрөөк баакыттуу", "эң баакыттуу"],
      senses: [
        {
          pos: "adjective",
          definition: "feeling or showing pleasure or contentment",
          translation: "happy",
          examples: [
            { en: "I'm happy.", kg: "Мен баакыттууман." },
            { en: "She has a happy family.", kg: "Анын баакыттуу үй-бүлөсү бар." }
          ],
          derivatives: [
            { word: "баакыт", translation: "happiness" },
            { word: "баакыттуу түрдө", translation: "happily" }
          ],
          cognates: [],
          grammar: { 
            comparative: "көбүрөөк баакыттуу", 
            superlative: "эң баакыттуу" 
          }
        }
      ]
    },
    "рахмат": {
      canonical: "рахмат",
      pronunciation: "/Raxmat/",
      topic: "politeness",
      cefr: "A1",
      senses: [
        {
          pos: "fixed expression",
          definition: "an expression of gratitude",
          translation: "thank you",
          examples: [
            { en: "Thank you for your help.", kg: "Жардамыңыз үчүн рахмат!" },
            { en: "You're welcome!", kg: "Суранбайсыз!" }
          ],
          derivatives: [],
          cognates: [],
          grammar: {}
        }
      ],
      forms: ["рахмат"]
    },
    "үй": {
      canonical: "үй",
      pronunciation: "/üy/",
      topic: "housing",
      cefr: "A1",
      forms: ["үй", "үйдү", "үйлөр"],
      senses: [
        {
          pos: "noun",
          definition: "building for living",
          translation: "house",
          examples: [
            { en: "My house is big.", kg: "Менин үйүм чоң." },
            { en: "We live in a house.", kg: "Биз үйдө жашайбыз." }
          ],
          derivatives: [
            { word: "үй-бүлө", translation: "household" },
            { word: "үй жабдыктары", translation: "household items" }
          ],
          cognates: [],
          grammar: {
            accusative: "үйдү",
            plural: "үйлөр"
          }
        }
      ]
    }
  }
};

const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const directionBtns = document.querySelectorAll('.direction-btn');
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
let currentDirection = 'en-kg';

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getRandomWord() {
  const dict = currentDirection === 'en-kg' ? dictionary.en : dictionary.kg;
  const words = Object.keys(dict);
  return words[Math.floor(Math.random() * words.length)];
}

function hasLemma(word, direction) {
  const dict = direction === 'en-kg' ? dictionary.en : dictionary.kg;
  return !!dict[word];
}

function searchExamples(query, direction) {
  const dict = direction === 'en-kg' ? dictionary.en : dictionary.kg;
  const results = [];
  for (let word in dict) {
    const entry = dict[word];
    (entry.senses || [entry]).forEach(sense => {
      sense.examples.forEach(example => {
        const textToSearch = direction === 'en-kg' ? example.en : example.kg;
        if (textToSearch.toLowerCase().includes(query)) {
          results.push({
            lemma: word,
            exampleText: example[direction === 'en-kg' ? 'en' : 'kg'],
            translationText: example[direction === 'en-kg' ? 'kg' : 'en']
          });
        }
      });
    });
  }
  return results;
}

function renderEntry(lemma, entry, direction) {
  const isHeadwordKyrgyz = isKyrgyz(entry.canonical);
  let sensesHtml = '';

  if (entry.senses && entry.senses.length > 1) {
    sensesHtml = entry.senses.map((sense, index) => {
      const senseData = sense;
      let examplesHtml = sense.examples.map(example => {
        return `
          <li class="example-item">
            <span class="example-original">${escapeHtml(example.en)}</span>
            <span class="example-translation">${escapeHtml(example.kg)}</span>
          </li>
        `;
      }).join('');

      let grammarHtml = '';
      if (sense.grammar) {
        grammarHtml = `<ul class="grammar-list">`;
        for (let key in sense.grammar) {
          grammarHtml += `
            <li class="grammar-item">
              <span class="grammar-label">${key}:</span>
              ${escapeHtml(sense.grammar[key])}
            </li>
          `;
        }
        grammarHtml += `</ul>`;
      }

      let derivativesHtml = sense.derivatives.map(derivative => {
        const hasEntry = hasLemma(derivative.word, direction);
        const wordClass = hasEntry ? 'derivative-word linkable' : 'derivative-word';
        const translationClass = isKyrgyz(derivative.translation) ? 'kyrgyz' : '';
        return `
          <div class="derivative-item">
            <span class="${wordClass}" ${hasEntry ? `data-word="${derivative.word}"` : ''}>${escapeHtml(derivative.word)}</span>
            <div class="derivative-translation ${translationClass}">${escapeHtml(derivative.translation)}</div>
          </div>
        `;
      }).join('');

      let cognatesHtml = '';
      if (isHeadwordKyrgyz && sense.cognates !== undefined) {
        cognatesHtml = `<div class="section-title">Cognates</div><div class="cognates-list"></div>`;
      }

      const translationClass = isKyrgyz(senseData.translation) ? 'kyrgyz' : '';

      const sensePos = senseData.pos || (entry.senses ? entry.senses[0]?.pos : entry.pos); 
      const senseTopic = senseData.topic || entry.topic;

      let senseTagsHtml = '';
      if (sensePos) {
        senseTagsHtml += `<button class="pos" onclick="showFilterList('pos', '${sensePos}')">${sensePos}</button>`;
      }
      if (senseTopic) {
        senseTagsHtml += `<button class="topic-tag" onclick="showFilterList('topic', '${senseTopic}')">${senseTopic}</button>`;
      }

      return `
        <div class="sense-item">
          <div class="tags-container">${senseTagsHtml}</div>
          <span class="sense-number">${index + 1}.</span>
          <span class="sense-definition">${escapeHtml(senseData.definition)}</span>
          <div class="translation ${translationClass}" onclick="handleTranslationClick('${senseData.translation.replace(/'/g, "\\'")}')"">${escapeHtml(senseData.translation)}</div>
          <div class="section-title">Examples</div>
          <ul class="examples-list">
            ${examplesHtml}
          </ul>
          <div class="section-title">Grammar</div>
          ${grammarHtml}
          <div class="section-title">Derivatives</div>
          <div class="derivatives-list">
            ${derivativesHtml}
          </div>
          ${cognatesHtml}
        </div>
      `;
    }).join('');
  } else {
    const senseData = entry.senses ? entry.senses[0] : entry;
    let examplesHtml = senseData.examples.map(example => {
      return `
        <li class="example-item">
          <span class="example-original">${escapeHtml(example.en)}</span>
          <span class="example-translation">${escapeHtml(example.kg)}</span>
        </li>
      `;
    }).join('');

    let grammarHtml = '';
    if (senseData.grammar) {
      grammarHtml = `<ul class="grammar-list">`;
      for (let key in senseData.grammar) {
        grammarHtml += `
          <li class="grammar-item">
            <span class="grammar-label">${key}:</span>
            ${escapeHtml(senseData.grammar[key])}
          </li>
        `;
      }
      grammarHtml += `</ul>`;
    }

    let derivativesHtml = senseData.derivatives.map(derivative => {
      const hasEntry = hasLemma(derivative.word, direction);
      const wordClass = hasEntry ? 'derivative-word linkable' : 'derivative-word';
      const translationClass = isKyrgyz(derivative.translation) ? 'kyrgyz' : '';
      return `
        <div class="derivative-item">
          <span class="${wordClass}" ${hasEntry ? `data-word="${derivative.word}"` : ''}>${escapeHtml(derivative.word)}</span>
          <div class="derivative-translation ${translationClass}">${escapeHtml(derivative.translation)}</div>
        </div>
      `;
    }).join('');

    let cognatesHtml = '';
    if (isHeadwordKyrgyz && senseData.cognates !== undefined) {
      cognatesHtml = `<div class="section-title">Cognates</div><div class="cognates-list"></div>`;
    }

    const translationClass = isKyrgyz(senseData.translation) ? 'kyrgyz' : '';

    const sensePos = senseData.pos || entry.pos;
    const senseTopic = senseData.topic || entry.topic;

    let senseTagsHtml = '';
    if (sensePos) {
      senseTagsHtml += `<button class="pos" onclick="showFilterList('pos', '${sensePos}')">${sensePos}</button>`;
    }
    if (senseTopic) {
      senseTagsHtml += `<button class="topic-tag" onclick="showFilterList('topic', '${senseTopic}')">${senseTopic}</button>`;
    }

    sensesHtml = `
      <div class="sense-item">
        <div class="tags-container">${senseTagsHtml}</div>
        <div class="translation ${translationClass}" onclick="handleTranslationClick('${senseData.translation.replace(/'/g, "\\'")}')"">${escapeHtml(senseData.translation)}</div>
        <div class="section-title">Examples</div>
        <ul class="examples-list">
          ${examplesHtml}
        </ul>
        <div class="section-title">Grammar</div>
        ${grammarHtml}
        <div class="section-title">Derivatives</div>
        <div class="derivatives-list">
          ${derivativesHtml}
        </div>
        ${cognatesHtml}
      </div>
    `;
  }

  let frequencyHtml = '';
  if (isHeadwordKyrgyz) {
    frequencyHtml = '<div class="frequency-placeholder">Frequency: top 1000</div>';
  }

  let cefrHtml = '';
  if (isHeadwordKyrgyz && entry.cefr) {
    cefrHtml = `<div class="tags-container" style="position:absolute; right:0; top:0;"><button class="level-tag" onclick="showFilterList('cefr', '${entry.cefr}')">${entry.cefr.toUpperCase()}</button></div>`;
  }

  return `
    <div class="entry" style="position:relative;">
      ${cefrHtml}
      <div class="headword ${isHeadwordKyrgyz ? 'kyrgyz' : ''}">${escapeHtml(entry.canonical)}</div>
      <div class="pronunciation">${escapeHtml(entry.pronunciation)}</div>
      ${frequencyHtml}
      ${sensesHtml}
    </div>
  `;
}

function handleTranslationClick(translationWord) {
  const newDirection = currentDirection === 'en-kg' ? 'kg-en' : 'en-kg';
  showResult(translationWord, newDirection);
  directionBtns.forEach(btn => {
    if (btn.getAttribute('data-direction') === newDirection) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  currentDirection = newDirection;
  searchInput.value = translationWord;
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showResult(lemma, forcedDirection = null) {
  const direction = forcedDirection || currentDirection;
  const query = lemma.toLowerCase().trim();
 
  let entry = null;
  if (direction === 'en-kg') {
    entry = dictionary.en[query];
  } else {
    entry = dictionary.kg[query];
  }

  if (entry) {
    resultsContainer.innerHTML = renderEntry(lemma, entry, direction);
    attachEventListeners();
    return;
  }

  const dict = direction === 'en-kg' ? dictionary.en : dictionary.kg;
  let foundLemma = null;

  for (let word in dict) {
    const wordEntry = dict[word];
    if (wordEntry && wordEntry.forms && Array.isArray(wordEntry.forms)) {
      if (wordEntry.forms.map(f => f.toLowerCase()).includes(query)) {
        foundLemma = word;
        entry = wordEntry;
        break;
      }
    }
  }

  if (foundLemma) {
    resultsContainer.innerHTML = renderEntry(foundLemma, entry, direction);
    attachEventListeners();
    return;
  }

  const foundInExamples = searchExamples(query, direction);

  if (foundInExamples.length > 0) {
    let examplesHtml = foundInExamples.map(item => {
      const escapedQuery = escapeHtml(query);
      const escapedExample = escapeHtml(item.exampleText);
      const highlightedExample = escapedExample.replace(new RegExp(`(${escapedQuery})`, 'gi'), '<span class="lemma-highlight">$1</span>');
      return `
        <div class="example-match-item">
          <div class="example-original">${highlightedExample}</div>
          <div class="example-translation">${escapeHtml(item.translationText)}</div>
          <button class="goto-lemma-btn" data-word="${item.lemma}"> → View "${item.lemma}" entry</button>
        </div>
      `;
    }).join('');

    resultsContainer.innerHTML = `
      <div class="no-result">
        <p>No lemma found for "${escapeHtml(lemma)}", but it appears in the following example(s):</p>
        <div class="examples-in-context">${examplesHtml}</div>
      </div>
    `;
    attachExampleMatchListeners();
  } else {
    resultsContainer.innerHTML = `<div class="no-result">No entry found for "${escapeHtml(lemma)}"</div>`;
  }
}

function attachEventListeners() {
  document.querySelectorAll('.lemma-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const word = link.getAttribute('data-word');
      showResult(word);
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  document.querySelectorAll('.derivative-word.linkable, .cognate-word.linkable').forEach(wordEl => {
    wordEl.addEventListener('click', (e) => {
      e.preventDefault();
      const word = wordEl.getAttribute('data-word');
      showResult(word);
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function attachExampleMatchListeners() {
  document.querySelectorAll('.goto-lemma-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const word = btn.getAttribute('data-word');
      searchInput.value = word;
      showResult(word);
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function showFilterList(type, value) {
  filterModal.style.display = 'block';
  modalTitle.textContent = value.toUpperCase();

  const dict = currentDirection === 'en-kg' ? dictionary.en : dictionary.kg;

  const matchingWords = Object.keys(dict).filter(word => {
    const entry = dict[word];
    if (type === 'pos') return entry.pos === value || (entry.senses && entry.senses.some(s => s.pos === value));
    if (type === 'topic') return entry.topic === value || (entry.senses && entry.senses.some(s => s.topic === value));
    if (type === 'cefr') return entry.cefr === value;
  }).sort((a, b) => a.localeCompare(b));

  let listHtml = '<ul class="filter-word-list">';
  matchingWords.forEach(word => {
    listHtml += `<li class="filter-word-item" data-word="${word}">${word}</li>`;
  });
  listHtml += '</ul>';

  modalBody.innerHTML = listHtml;

  document.querySelectorAll('.filter-word-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const word = e.target.getAttribute('data-word');
      searchInput.value = word;
      showResult(word);
      filterModal.style.display = 'none';
      resultsContainer.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function generateExercise() {
  const dict = currentDirection === 'en-kg' ? dictionary.en : dictionary.kg;
  const words = Object.keys(dict);
  const correctWord = words[Math.floor(Math.random() * words.length)];
  const entry = dict[correctWord];
  const sense = entry.senses ? entry.senses[0] : entry;
  const question = currentDirection === 'en-kg' ? sense.translation : correctWord;
  const correctAnswer = currentDirection === 'en-kg' ? correctWord : sense.translation;

  const incorrectWords = [];
  while (incorrectWords.length < 3) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (randomWord === correctWord) continue;

    const randomEntry = dict[randomWord];
    const randomSense = randomEntry.senses ? randomEntry.senses[0] : randomEntry;
    const randomAnswer = currentDirection === 'en-kg' ? randomWord : randomSense.translation;

    if (!incorrectWords.includes(randomAnswer)) {
      incorrectWords.push(randomAnswer);
    }
  }

  const allAnswers = [correctAnswer, ...incorrectWords].sort(() => Math.random() - 0.5);

  let answersHtml = '';
  allAnswers.forEach(answer => {
    answersHtml += `
      <div class="answer-option" data-answer="${escapeHtml(answer)}">
        ${escapeHtml(answer)}
      </div>
    `;
  });

  const questionText = currentDirection === 'en-kg'
    ? `What is the English word for: "${question}"?`
    : `What is the Kyrgyz word for: "${question}"?`;

  exerciseModal.querySelector('.modal-body').innerHTML = `
    <div class="exercise-question">${escapeHtml(questionText)}</div>
    <div class="answer-options">${answersHtml}</div>
    <div class="exercise-feedback" style="display:none;"></div>
    <div class="exercise-buttons">
      <button class="exercise-btn-modal next-btn">Next Question</button>
      <button class="exercise-btn-modal close-btn">Close</button>
    </div>
  `;

  exerciseModal.style.display = 'block';

  document.querySelectorAll('.answer-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.answer-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
      });
      option.classList.add('selected');
      const isCorrect = option.textContent.trim() === correctAnswer.trim();
      if (isCorrect) {
        option.classList.add('correct');
      } else {
        option.classList.add('incorrect');
        document.querySelectorAll('.answer-option').forEach(opt => {
          if (opt.textContent.trim() === correctAnswer.trim()) {
            opt.classList.add('correct');
          }
        });
      }

      const feedback = document.querySelector('.exercise-feedback');
      feedback.style.display = 'block';
      feedback.innerHTML = isCorrect
        ? `<h4>Correct!</h4><p>Well done!</p>`
        : `<h4>Incorrect</h4><p>The correct answer is: <strong>${escapeHtml(correctAnswer)}</strong></p>`;

      document.querySelector('.next-btn').onclick = generateExercise;
      document.querySelector('.close-btn').onclick = () => {
        exerciseModal.style.display = 'none';
      };
    });
  });
}

directionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    directionBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentDirection = btn.getAttribute('data-direction');
    searchInput.value = '';
    resultsContainer.innerHTML = `<div class="about-section" id="aboutSection">
      <div class="section-title">About</div>
      <p class="about-content">bla blabla bla</p>
    </div>`;
  });
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  if (query) {
    showResult(query);
  } else {
    resultsContainer.innerHTML = `<div class="about-section" id="aboutSection">
      <div class="section-title">About</div>
      <p class="about-content">bla blabla bla</p>
    </div>`;
  }
});

randomBtn.addEventListener('click', () => {
  const word = getRandomWord();
  searchInput.value = word;
  showResult(word);
});

exerciseBtn.addEventListener('click', () => {
  generateExercise();
});

closeModal.addEventListener('click', () => {
  filterModal.style.display = 'none';
});

closeExerciseModal.addEventListener('click', () => {
  exerciseModal.style.display = 'none';
});

keyboardToggleBtn.addEventListener('click', () => {
  virtualKeyboard.style.display = virtualKeyboard.style.display === 'none' ? 'block' : 'none';
  keyboardToggleBtn.textContent = virtualKeyboard.style.display === 'none' ? ' ⌨️ Show Keyboard' : ' ⌨️ Hide Keyboard';
});

document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    const action = key.getAttribute('data-action');
    const input = searchInput;
    if (action === 'backspace') {
      input.value = input.value.slice(0, -1);
    } else if (action === 'space') {
      input.value += ' ';
    } else {
      input.value += key.textContent.trim();
    }
    input.focus();
    if (input.value.trim()) {
      showResult(input.value);
    }
  });
});