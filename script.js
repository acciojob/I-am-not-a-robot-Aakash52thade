const tilesEl = document.getElementById("tiles");
const resetBtn = document.getElementById("reset");
const verifyBtn = document.getElementById("verify");

const IMG_KEYS = ["img1", "img2", "img3", "img4", "img5"];

let tiles = [];
let selected = [];

// Shuffle helper
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Render tiles to DOM
function renderTiles() {
  tilesEl.innerHTML = "";
  tiles.forEach((key, idx) => {
    const img = document.createElement("img");
    img.classList.add(key); // img1, img2...
    img.dataset.index = idx;
    img.dataset.key = key;
    img.addEventListener("click", onTileClick);
    tilesEl.appendChild(img);
  });
}

// Handle tile click
function onTileClick(e) {
  const img = e.target;
  const idx = img.dataset.index;
  const key = img.dataset.key;

  if (selected.find(sel => sel.idx === idx)) {
    img.classList.remove("selected");
    selected = selected.filter(sel => sel.idx !== idx);
  } else if (selected.length < 2) {
    img.classList.add("selected");
    selected.push({ idx, key });
  }

  resetBtn.style.display = selected.length > 0 ? "inline-block" : "none";
  verifyBtn.style.display = selected.length === 2 ? "inline-block" : "none";
}

// Verify button action
verifyBtn.addEventListener("click", () => {
  if (selected.length === 2 && selected[0].key === selected[1].key) {
    alert("You are a human. Congratulations!");
  } else {
    alert("Verification failed. Try again.");
  }
});

// Reset button action
resetBtn.addEventListener("click", () => {
  selected = [];
  startGame();
});

// Start new game
function startGame() {
  const set = [...IMG_KEYS];
  const randomKey = IMG_KEYS[Math.floor(Math.random() * IMG_KEYS.length)];
  set.push(randomKey); // duplicate one image
  shuffle(set);
  tiles = set;
  selected = [];
  renderTiles();
  resetBtn.style.display = "none";
  verifyBtn.style.display = "none";
}

startGame();
