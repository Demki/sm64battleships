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

function starsFor([name, count]) {
  return Array.from({length: count}, (_, i) => ({star: name, starNumber: i+1}));
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
    board.appendChild(htmlToElement(`<div><div>${x.star} ${x.starNumber}</div></div>`))
  })
  board.addEventListener("click", () => {});
});
