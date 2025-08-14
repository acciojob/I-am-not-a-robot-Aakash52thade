//your code here
// ---------- Config: use stable image URLs so we truly have 5 unique + 1 duplicate ----------
const IMG_MAP = {
  img1: "https://picsum.photos/id/237/200/200",  // dog
  img2: "https://picsum.photos/id/1025/200/200", // husky
  img3: "https://picsum.photos/id/1003/200/200",
  img4: "https://picsum.photos/id/1011/200/200",
  img5: "https://picsum.photos/id/103/200/200"
};
// We only use these keys for identity checks:
const IMG_KEYS = Object.keys(IMG_MAP); // ["img1", "img2", "img3", "img4", "img5"]

// ---------- DOM ----------
const tilesEl = document.getElementById("tiles");
const resetBtn = document.getElementById("reset");
const verifyBtn = document.getElementById("verify");
const promptEl = document.getElementById("h");
const resultEl = document.getElementById("para");

// ---------- State ----------
let tiles = [];             // array of {key, src}
let selected = [];          // array of indices (0..5)
let verified = false;       // prevents multiple verify runs in same round

// ---------- Utils ----------
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function clearChildren(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

// ---------- Rendering ----------
function renderTiles() {
  clearChildren(tilesEl);
  tiles.forEach((t, idx) => {
    const img = document.createElement("img");
    img.className = "tile";
    img.src = t.src;
    img.alt = `tile ${idx + 1}`;
    img.setAttribute("data-index", String(idx));
    img.setAttribute("data-key", t.key); // identity of the image
    img.addEventListener("click", onTileClick);
    tilesEl.appendChild(img);
  });
}

// ---------- Setup for each round ----------
function newRound() {
  // State 1: initial
  verified = false;
  selected = [];
  resultEl.textContent = "";
  promptEl.textContent =
    "Please click on the identical tiles to verify that you are not a robot.";
  resetBtn.style.display = "none";
  verifyBtn.style.display = "none";

  // Build 6 tiles: 5 unique + 1 duplicate (randomly chosen)
  const duplicateKey = IMG_KEYS[Math.floor(Math.random() * IMG_KEYS.length)];
  const uniqueTiles = IMG_KEYS.map((key) => ({ key, src: IMG_MAP[key] }));
  const duplicateTile = { key: duplicateKey, src: IMG_MAP[duplicateKey] };
  tiles = [...uniqueTiles, duplicateTile];

  // Shuffle on each load as required
  shuffle(tiles);

  renderTiles();
}

function updateSelectionsUI() {
  // Toggle selected class based on the 'selected' indices
  const imgs = tilesEl.querySelectorAll("img.tile");
  imgs.forEach((img, idx) => {
    if (selected.includes(idx)) {
      img.classList.add("selected");
    } else {
      img.classList.remove("selected");
    }
  });

  // State transitions
  if (selected.length === 0) {
    // State 1
    resetBtn.style.display = "none";
    verifyBtn.style.display = "none";
    resultEl.textContent = "";
  } else if (selected.length === 1) {
    // State 2
    resetBtn.style.display = "inline-block";
    verifyBtn.style.display = "none";
  } else if (selected.length === 2) {
    // State 3
    resetBtn.style.display = "inline-block";
    verifyBtn.style.display = "inline-block";
  } else {
    // > 2 selections not allowed by our click handler, but keep safe
    verifyBtn.style.display = "none";
  }
}

// ---------- Handlers ----------
function onTileClick(e) {
  if (verified) return; // lock after verify

  const idx = Number(e.currentTarget.getAttribute("data-index"));

  // Toggle behavior: if already selected -> deselect
  if (selected.includes(idx)) {
    selected = selected.filter((i) => i !== idx);
    updateSelectionsUI();
    return;
  }

  // Enforce at most 2 distinct tiles
  if (selected.length >= 2) {
    // Ignoring more than two selections satisfies:
    // "Clicking on more than two images should not display the Verify button."
    return;
  }

  selected.push(idx);

  // Show Reset as soon as the first tile is clicked (State 2)
  resetBtn.style.display = "inline-block";
  updateSelectionsUI();
}

function onReset() {
  // State 1 again
  verified = false;
  selected = [];
  resultEl.textContent = "";
  promptEl.textContent =
    "Please click on the identical tiles to verify that you are not a robot.";
  updateSelectionsUI();
}

function onVerify() {
  if (selected.length !== 2) return;

  // State 4: after clicking Verify, the button disappears
  verifyBtn.style.display = "none";
  verified = true;

  const [aIdx, bIdx] = selected;
  const aKey = tiles[aIdx].key;
  const bKey = tiles[bIdx].key;

  if (aKey === bKey && aIdx !== bIdx) {
    // identical images, two distinct tiles
    resultEl.textContent = "You are a human. Congratulations!";
  } else {
    resultEl.textContent =
      "We can't verify you as a human. You selected the non-identical tiles.";
  }
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  newRound();
  resetBtn.addEventListener("click", onReset);
  verifyBtn.addEventListener("click", onVerify);
});
