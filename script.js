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
// const MAX_COUNT = 3;
// const MIN_COUNT = -1;

const DEFAULT_COLORS = [
  [-1,"rgba(0,0,255,1)"],
  [0, "rgba(0,0,0,0)"],
  [1,"rgba(176, 176, 176,1)"],
  [2,"rgba(255,0,0,1)"],
  [3,"rgb(217, 38, 217,1)"]
];

const colorSettings = {}

const starDivs = new Map();

let nightMode = false;
let colorPickerVisible = false;

function starsFor([name, count]) {
  return Array.from({ length: count }, (_, i) => ({ star: name, starNumber: i + 1 }));
}

const starList = starCounts.flatMap(starsFor);


function initializeColorSettings() {
  colorSettings.sheet = new CSSStyleSheet();
  colorSettings.colors = new Map(JSON.parse(localStorage.getItem("sm64battleship.colors")) || structuredClone(DEFAULT_COLORS));
  colorSettings.minCount = Math.min(...colorSettings.colors.keys());
  colorSettings.maxCount = Math.max(...colorSettings.colors.keys());
  colorSettings.rules = new Map();
  for(let [k,v] of colorSettings.colors) {
    const ruleIndex = colorSettings.sheet.insertRule(`
      *[data-count="${k}"] { 
       background-color: ${v}; }
      `);
    colorSettings.rules.set(k, colorSettings.sheet.cssRules[ruleIndex]);
  }
  document.adoptedStyleSheets = [colorSettings.sheet];
}

function saveColors() {
  localStorage.setItem("sm64battleship.colors", JSON.stringify([...colorSettings.colors.entries()]));
}

function resetColors() {
  localStorage.removeItem("sm64battleship.colors");
  initializeColorSettings();
}

function addNegColor() {
  const k = colorSettings.minCount-1;
  const v = "#00000000";
  colorSettings.colors.set(k, v);
  if(!colorSettings.rules.has(k)) {
    const ruleIndex = colorSettings.sheet.insertRule(`
    *[data-count="${k}"] { 
      background-color: ${v}; }
      `);
      colorSettings.rules.set(k, colorSettings.sheet.cssRules[ruleIndex]);
  }
  else {
    colorSettings.rules.get(k).style.backgroundColor = v;
  }
  colorSettings.minCount = k;
  return [k,v];
}

function removeNegColor() {
  if(colorSettings.minCount < -1) {
    colorSettings.colors.delete(colorSettings.minCount);
    colorSettings.rules.get(colorSettings.minCount).style.backgorundColor = "#00000000";
    colorSettings.minCount++;
    return true;
  }
  else {
    return false;
  }
}

function addPosColor() {
  const k = colorSettings.maxCount+1;
  const v = "#00000000";
  colorSettings.colors.set(k, v);
  if(!colorSettings.rules.has(k)) {
    const ruleIndex = colorSettings.sheet.insertRule(`
    *[data-count="${k}"] { 
      background-color: ${v}; }
      `);
      colorSettings.rules.set(k, colorSettings.sheet.cssRules[ruleIndex]);
  }
  else {
    colorSettings.rules.get(k).style.backgroundColor = v;
  }
  colorSettings.maxCount = k;
  return [k,v];
}

function removePosColor() {
  if(colorSettings.maxCount > 1) {
    colorSettings.colors.delete(colorSettings.maxCount);
    colorSettings.rules.get(colorSettings.maxCount).style.backgorundColor = "#00000000";
    colorSettings.maxCount--;
    return true;
  } else {
    return false;
  }
}

function setColor(k, v) {
  colorSettings.colors.set(k, v);
  colorSettings.rules.get(k).style.backgroundColor = v;
}

function createPicker(k, v) {
  const div = document.createElement("div");
  div.classList.add("colorsPickerRow");
  const label = document.createElement("label");
  label.for = `color${k}ColorPicker`;
  label.innerText = k;
  const picker = document.createElement("input");
  picker.id = `color${k}ColorPicker`;
  div.append(label, picker);
  picker.jscolor = new JSColor(picker,{preset: 'dark'});
  picker.jscolor.fromString(v);
  picker.addEventListener("input", () => {
    setColor(k, picker.jscolor.toHEXString());
    saveColors();
  })
  return div;
}

function genColorsPickerHTML(pickerDiv) {
  {
    const div = document.createElement("div");
    const btn = document.createElement("input");
    btn.type = "button";
    btn.value = "reset colors";
    div.append(btn);
    pickerDiv.append(div);

    btn.addEventListener("click", () => {
      resetColors();
      while(pickerDiv.firstChild) {
        pickerDiv.removeChild(pickerDiv.lastChild);
      }
      genColorsPickerHTML(pickerDiv);
    });
  }
  
  {
    const div = document.createElement("div");
    const btnP = document.createElement("input");
    btnP.type = "button";
    btnP.value = "+";
    btnP.classList.add("addRemoveBtn");
    const btnM = document.createElement("input");
    btnM.type = "button";
    btnM.value = "-";
    btnM.classList.add("addRemoveBtn");
    div.append(btnP,btnM);
    pickerDiv.append(div);

    btnM.addEventListener("click", () => {
      if(removeNegColor())
      {
        saveColors();
        pickerDiv.removeChild(div.nextSibling);
      }
    });
    btnP.addEventListener("click", () => {
      const [k,v] = addNegColor();
      saveColors();
      pickerDiv.insertBefore(createPicker(k,v), div.nextSibling);
    });
  }
  const colors = [...colorSettings.colors.entries()];
  colors.sort(([x,_],[y,__]) => x-y);
  for(let [k,v] of colors) {
    if(k === 0) continue;
    pickerDiv.append(createPicker(k,v));
  }

  {
    const div = document.createElement("div");
    const btnP = document.createElement("input");
    btnP.type = "button";
    btnP.value = "+";
    btnP.classList.add("addRemoveBtn");
    const btnM = document.createElement("input");
    btnM.type = "button";
    btnM.value = "-";
    btnM.classList.add("addRemoveBtn");
    div.append(btnP,btnM);
    pickerDiv.append(div);

    btnM.addEventListener("click", () => {
      if(removePosColor())
      {
        saveColors();
        pickerDiv.removeChild(div.previousSibling);
      }
    });
    btnP.addEventListener("click", () => {
      const [k,v] = addPosColor();
      saveColors();
      pickerDiv.insertBefore(createPicker(k,v), div);
    });
  }
}

function saveMarkings() {
  const data = [...starDivs.entries()].map(([i,d]) => [i,Number.parseInt(d.dataset.count) || 0]);
  const file = new Blob([JSON.stringify(data)], { type: "application/json" });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(file);
  a.download = "sm64battleships-markings.json";
  a.click();
}

function loadMarkings() {
  const markingsFile = document.getElementById("markingsFile");
  if(markingsFile.files.length === 0) {
    alert("No files selected.");
    return;
  }
  const file = markingsFile.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      const map = new Map(data);
      for(let [i, m] of map) {
        starDivs.get(i).dataset.count = m;
      }
    } catch(e) {
      alert(`Could not read file because of:\n${e.message}`);
      console.log("Could not read file", e);
    }
  });
  reader.readAsText(file);

}

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

function starText({ star, starNumber }) {
  switch (star) {
    case "BITSKY":
      return "Sky";
    case "BITDW":
      return "DW";
    case "BITFS":
      return "FS";
    default:
      return `${starNumber}`;
  }
}

function onSearchClear()
{
  document.getElementById("searchBox").value = "";
  onSearch("");
}

function onSearch(value)
{
  const foundLevels = starCounts.filter(([s, _]) => s.search(value.toUpperCase()) !== -1 ).map(([s,_]) => s);
  for(let x of document.getElementById("board").children)
  {
    if(!foundLevels.some(level => x.firstElementChild.classList.contains(level))) 
    {
      x.classList.add("searchHide");
    }
    else 
    {
      x.classList.remove("searchHide");
    }
  }
}

window.addEventListener("load", () => {
  const board = document.getElementById("board");
  const style = document.createElement("style");
  document.head.appendChild(style);
  const sheet = style.sheet;

  starCounts.forEach(([name, _]) => {
    sheet.insertRule(`.${name} { background-image: url("img/${name}.png"); }`, 0);
  });

  starList.forEach((x,i) => {
    const div = htmlToElement(`<div class="${ITEM_CLASS}"><div class="${x.star}"><span class="${starText(x)}">${starText(x)}</span></div></div>`);
    board.appendChild(div);
    starDivs.set(i, div);
  });
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
  
  document.getElementById("clearSearchBtn").addEventListener("click", () => {
    onSearchClear();
  });
  onSearchClear();

  document.getElementById("searchBox").addEventListener("keyup", ({ target }) => {
    onSearch(target.value);
  });
  document.getElementById("searchBox").addEventListener("change", ({ target }) => {
    onSearch(target.value);
  });
  document.getElementById("searchBox").addEventListener("paste", ({ target }) => {
    onSearch(target.value);
  });

  const colCount = localStorage.getItem("colCount") || 10;
  document.getElementById("colCount").value = colCount;
  document.body.style.setProperty("--columns", colCount);

  document.getElementById("colCount").addEventListener("change", ({ target }) => {
    document.body.style.setProperty("--columns", target.value);
    localStorage.setItem("colCount", target.value);
  });

  const nightBtn = document.getElementById("nightBtn");
  if (nightBtn) nightBtn.addEventListener("click", toggleNightMode);

  nightMode = (localStorage.getItem("nightMode") || "true") === "true";
  if (nightMode) document.body.classList.add("nightMode");

  const colorPickerBtn = document.getElementById("colorPickerBtn");
  if (colorPickerBtn) colorPickerBtn.addEventListener("click", toggleColorPicker);

  colorPickerVisible = localStorage.getItem("sm64battleships.colorPickerVisible") === "true";
  if (colorPickerVisible) document.getElementById("colorsPicker").classList.remove("hidden");

  initializeColorSettings();
  const colorsPickerDiv = document.getElementById("colorsPicker");
  genColorsPickerHTML(colorsPickerDiv);

  const sizeObserver = new MutationObserver(() => 
  {
    localStorage.setItem("boardWidth", board.style.width);
    localStorage.setItem("boardHeight", board.style.height);
  });

  sizeObserver.observe(board, {attributes: true, attributeFilter: ["style"]});

  if(localStorage.getItem("boardWidth") && localStorage.getItem("boardHeight"))
  {
    board.style.setProperty("width", localStorage.getItem("boardWidth"));
    board.style.setProperty("height", localStorage.getItem("boardHeight"));
  }

  const loadMarkingsBtn = document.getElementById("loadMarkingsBtn");
  if (loadMarkingsBtn) loadMarkingsBtn.addEventListener("click", loadMarkings);

  const saveMarkingsBtn = document.getElementById("saveMarkingsBtn");
  if (saveMarkingsBtn) saveMarkingsBtn.addEventListener("click", saveMarkings);

  document.addEventListener("keydown", ( {target, target:{nodeName}, code} ) => { 
    if (code === "Escape") {
      onSearchClear();
    }
    if (nodeName !== 'INPUT') {
      document.getElementById("searchBox").focus();
    }
  });
  
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
  const cnt = Number.parseInt(target.dataset.count);
  
  if ((c > 0 && cnt < colorSettings.maxCount) || (c < 0 && cnt > colorSettings.minCount)) {
    target.dataset.count = cnt + c;
  }
}


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

function toggleColorPicker() {
  if (colorPickerVisible) {
    colorPickerVisible = false;
    localStorage.setItem("sm64battleships.colorPickerVisible", colorPickerVisible);
    document.getElementById("colorsPicker").classList.add("hidden")
  }
  else {
    colorPickerVisible = true;
    localStorage.setItem("sm64battleships.colorPickerVisible", colorPickerVisible);
    document.getElementById("colorsPicker").classList.remove("hidden")
    document.getElementById("colorsPicker").scrollIntoView();
  }
}
