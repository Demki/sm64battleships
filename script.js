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

window.addEventListener("load", () => {
  const board = document.getElementById("board");
  starList.forEach(x => {
    board.appendChild(htmlToElement(`<div class="${ITEM_CLASS}"><span>${x.star} ${x.starNumber}</div></div>`))
  })
  board.addEventListener("click", onMark(1));
  board.addEventListener("contextmenu", onMark(-1));
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