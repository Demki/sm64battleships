/**
 * @type {[[string, number]]}
 */
const starCounts = [
  ["BOB", 7],
  ["WF", 7],
  ["CCM", 7],
  ["JRB", 7],
  ["AQUA", 1],
  ["PSS", 2],
  ["WING", 1],
  ["BITDW", 1],
  ["BBH", 7],
  ["LLL", 7],
  ["SSL", 7],
  ["HMC", 7],
  ["DDD", 7],
  ["BITFS", 1],
  ["WDW", 7],
  ["TTM", 7],
  ["THI", 7],
  ["SL", 7],
  ["TTC", 7],
  ["RR", 7],
  ["WMOTR", 1],
  ["METAL", 1],
  ["VANISH", 1],
  ["BITSKY", 1],
  ["TOAD", 3],
  ["MIPS", 2],
]

const ITEM_CLASS = "item";
const MAX_COUNT = 3;
const MIN_COUNT = -1;

function starsFor([name, count]) {
  return Array.from({ length: count }, (_, i) => ({ star: name, starNumber: i + 1 }));
}

const starList = starCounts.flatMap(starsFor);

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function shuffle(rand, a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomize(rand, orig, list) {
  const arr = Array.from(orig);
  if (rand) {
    shuffle(rand, arr);
  }
  arr.forEach(x => list.removeChild(x));
  arr.forEach(x => list.appendChild(x));
}

function generateId(len) {
  var arr = new Uint8Array(Math.ceil((len || 40) * 3 / 4));
  window.crypto.getRandomValues(arr);
  return base64js.fromByteArray(arr).substring(0, len);
}

function randFromSeed(seed) {
  return seed ? new Math.seedrandom(seed) : null;
}

window.addEventListener("load", () => {
  const board = document.getElementById("board");
  const style = document.createElement("style");
  document.head.appendChild(style);
  const sheet = style.sheet;
  starCounts.forEach(([name,_]) => {
    sheet.insertRule(`.${name} { background-image: url("img/${name}.png"); background-size: cover; width: 30px; height: 30px; }`,0);
  });

  starList.forEach(x => {
    switch (x.star) {
      case "BITSKY":
        board.appendChild(htmlToElement(`<div class="${ITEM_CLASS}"><div class="${x.star}">Sky</div></div>`))
        break;
      case "BITDW":
        board.appendChild(htmlToElement(`<div class="${ITEM_CLASS}"><div class="${x.star}">DW</div></div>`))
        break;
      case "BITFS":
        board.appendChild(htmlToElement(`<div class="${ITEM_CLASS}"><div class="${x.star}">FS</div></div>`))
        break;
      default:
        board.appendChild(htmlToElement(`<div class="${ITEM_CLASS}"><div class="${x.star}">${x.starNumber}</div></div>`))
    }
  })
  board.addEventListener("click", onMark(1));
  board.addEventListener("contextmenu", onMark(-1));

  const seedText = document.getElementById("seedText");
  const orig = Array.from(board.children);
  document.getElementById("genSeedButton").addEventListener("click", () => {
    const seed = generateId(10)
    const rng = randFromSeed(seed);
    seedText.value = seed;
    randomize(rng, orig, board);
  });
  document.getElementById("setSeedButton").addEventListener("click", () => {
    const seed = seedText.value;
    const rand = randFromSeed(seed);
    randomize(rand, orig, board);
  });

  document.getElementById("colCount").value = 10;

  document.getElementById("colCount").addEventListener("change", ({ target }) => {
    document.body.style.setProperty("--columns", target.value);
  });

  const nightBtn = document.getElementById("nightBtn");
  if (nightBtn) nightBtn.addEventListener("click", toggleNightMode);

  nightMode = localStorage.getItem("nightMode") === "true";
  if (nightMode) document.body.classList.add("nightMode");

});

/**
 * @returns {(ev : MouseEvent) => Boolean}
 */
function onMark(c) {
  return (ev) => {
    const target = ev.target;
    if (target.classList.contains(ITEM_CLASS)) {
      mark(c, target);
      ev.preventDefault();
      return false;

    }
  }
}

/**
 * @param {number} c
 * @param {HTMLElement} target
 */
function mark(c, target) {
  if (!("count" in target.dataset)) target.dataset.count = 0;
  const cnt = parseInt(target.dataset.count);
  if ((c > 0 && cnt < MAX_COUNT) || (c < 0 && cnt > MIN_COUNT)) {
    target.dataset.count = cnt + c;
  }
}

let nightMode = false;

function toggleNightMode() {
  if (nightMode) {
    nightMode = false;
    localStorage.setItem("nightMode", nightMode);
    document.body.classList.remove("nightMode");
  }
  else {
    nightMode = true;
    localStorage.setItem("nightMode", nightMode);
    document.body.classList.add("nightMode");
  }
}
