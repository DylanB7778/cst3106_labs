/*************************************************
 * YATZY — Single Player Game
 * Logic & State Management
 *************************************************/

const GAME = {
  dice: [1, 1, 1, 1, 1],
  kept: [false, false, false, false, false],
  rollsThisTurn: 0,
  turn: 1,
  categories: []
};

// ----- Categories -----
const baseCategories = [
  { key: 'ones', label: 'Ones', type: 'upper', scorer: upperScorer(1) },
  { key: 'twos', label: 'Twos', type: 'upper', scorer: upperScorer(2) },
  { key: 'threes', label: 'Threes', type: 'upper', scorer: upperScorer(3) },
  { key: 'fours', label: 'Fours', type: 'upper', scorer: upperScorer(4) },
  { key: 'fives', label: 'Fives', type: 'upper', scorer: upperScorer(5) },
  { key: 'sixes', label: 'Sixes', type: 'upper', scorer: upperScorer(6) },
  { key: 'threeKind', label: 'Three of a kind', type: 'lower', scorer: threeKindScorer },
  { key: 'fourKind', label: 'Four of a kind', type: 'lower', scorer: fourKindScorer },
  { key: 'fullHouse', label: 'Full house (25)', type: 'lower', scorer: fullHouseScorer },
  { key: 'smallStraight', label: 'Small straight (30)', type: 'lower', scorer: smallStraightScorer },
  { key: 'largeStraight', label: 'Large straight (40)', type: 'lower', scorer: largeStraightScorer },
  { key: 'yatzy', label: 'Yatzy (50)', type: 'lower', scorer: yatzyScorer },
  { key: 'chance', label: 'Chance', type: 'lower', scorer: chanceScorer }
];

GAME.categories = baseCategories.map(c => ({ ...c, used: false, score: null }));

// ----- DOM Elements -----
const diceRow = document.getElementById('diceRow');
const rollBtn = document.getElementById('rollBtn');
const resetKept = document.getElementById('resetKept');
const endTurnBtn = document.getElementById('endTurn');
const newGameBtn = document.getElementById('newGame');
const rollCountEl = document.getElementById('rollCount');
const turnNumEl = document.getElementById('turnNum');
const scoreListEl = document.getElementById('scoreList');
const upperTotalEl = document.getElementById('upperTotal');
const upperBonusEl = document.getElementById('upperBonus');
const lowerTotalEl = document.getElementById('lowerTotal');
const finalScoreEl = document.getElementById('finalScore');
const statusEl = document.getElementById('status');
const gameMessageEl = document.getElementById('gameMessage');

// ----- Utility -----
function randDie() { return Math.floor(Math.random() * 6) + 1; }
function sumDice(dice) { return dice.reduce((a, b) => a + b, 0); }
function countsFromDice(dice) {
  const counts = [0,0,0,0,0,0];
  for (const d of dice) counts[d-1]++;
  return counts;
}

// ----- Scoring Functions -----
function upperScorer(face) {
  return dice => dice.filter(d => d === face).length * face;
}
function threeKindScorer(dice) {
  const c = countsFromDice(dice);
  return c.some(n => n >= 3) ? sumDice(dice) : 0;
}
function fourKindScorer(dice) {
  const c = countsFromDice(dice);
  return c.some(n => n >= 4) ? sumDice(dice) : 0;
}
function fullHouseScorer(dice) {
  const counts = countsFromDice(dice).filter(c => c > 0).sort((a,b) => a-b);
  return (counts.length === 2 && counts[0] === 2 && counts[1] === 3) ? 25 : 0;
}
function smallStraightScorer(dice) {
  const s = new Set(dice);
  const seqs = [[1,2,3,4],[2,3,4,5],[3,4,5,6]];
  return seqs.some(seq => seq.every(n => s.has(n))) ? 30 : 0;
}
function largeStraightScorer(dice) {
  const sorted = [...new Set(dice)].sort((a,b) => a-b).join(',');
  return (sorted === '1,2,3,4,5' || sorted === '2,3,4,5,6') ? 40 : 0;
}
function yatzyScorer(dice) {
  return countsFromDice(dice).some(n => n === 5) ? 50 : 0;
}
function chanceScorer(dice) { return sumDice(dice); }

// ----- Game Logic -----
async function rollDice() {
  if (GAME.rollsThisTurn >= 3) return;

  try {
    const response = await fetch('/roll-dices');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    for (let i = 0; i < 5; i++) {
      if (!GAME.kept[i]) GAME.dice[i] = data.dice[i];
    }

    GAME.rollsThisTurn++;
    updateUI();
    updateStatus();

    if (GAME.rollsThisTurn === 3) rollBtn.disabled = true;
  } catch (error) {
    console.error('Error fetching dice:', error);
    updateStatus('Error rolling dice. Try again.');
  }
}


function toggleKeep(i) {
  if (GAME.rollsThisTurn === 0) return;
  GAME.kept[i] = !GAME.kept[i];
  updateUI();
}

function resetKeptDice() {
  GAME.kept = [false, false, false, false, false];
  updateUI();
}

function commitCategory(i) {
  const cat = GAME.categories[i];
  if (cat.used) return;
  if (GAME.rollsThisTurn === 0) {
    updateStatus("You must roll at least once before scoring.");
    return;
  }
  cat.used = true;
  cat.score = cat.scorer([...GAME.dice]);

  GAME.turn++;
  GAME.rollsThisTurn = 0;
  GAME.kept = [false, false, false, false, false];

  if (GAME.turn > 13) {
    updateUI(true);
    showEndGame();
  } else {
    rollBtn.disabled = false;
    updateUI();
    updateStatus(`Scored ${cat.score} in ${cat.label}. Start next turn.`);
  }
}

function computeTotals() {
  let upper = 0, lower = 0;
  GAME.categories.forEach(c => {
    if (c.type === 'upper' && c.score) upper += c.score;
    if (c.type === 'lower' && c.score) lower += c.score;
  });
  const bonus = upper >= 63 ? 35 : 0;
  return { upper, bonus, lower };
}

function showEndGame() {
  const t = computeTotals();
  const final = t.upper + t.bonus + t.lower;
  gameMessageEl.innerHTML = `<div class="game-message">Game complete! Final score: ${final}</div>`;
  rollBtn.disabled = endTurnBtn.disabled = resetKept.disabled = true;
}

function startNewGame() {
  GAME.dice = [1,1,1,1,1];
  GAME.kept = [false,false,false,false,false];
  GAME.rollsThisTurn = 0;
  GAME.turn = 1;
  GAME.categories = baseCategories.map(c => ({ ...c, used:false, score:null }));
  rollBtn.disabled = endTurnBtn.disabled = resetKept.disabled = false;
  gameMessageEl.innerHTML = '';
  updateUI();
  updateStatus('New game — roll to start.');
}

// ----- UI -----
function renderDice(disabled=false) {
  diceRow.innerHTML = '';
  for (let i=0;i<5;i++) {
    const d = GAME.dice[i];
    const div = document.createElement('div');
    div.className = 'die' + (GAME.kept[i] ? ' kept' : '') + (disabled ? ' disabled' : '');
    div.textContent = d;
    if (!disabled) div.onclick = () => toggleKeep(i);
    diceRow.appendChild(div);
  }
}

function renderScorecard() {
  scoreListEl.innerHTML = '';
  GAME.categories.forEach((cat, idx) => {
    const row = document.createElement('div');
    row.className = 'row ' + (cat.used ? 'used' : 'available');
    row.innerHTML = `<div class="name">${cat.label}</div><div class="score">${cat.used ? cat.score : '-'}</div>`;
    if (!cat.used) row.onclick = () => commitCategory(idx);
    scoreListEl.appendChild(row);
  });
}

function updateTotalsUI() {
  const t = computeTotals();
  upperTotalEl.textContent = t.upper;
  upperBonusEl.textContent = t.bonus;
  lowerTotalEl.textContent = t.lower;
  finalScoreEl.textContent = t.upper + t.bonus + t.lower;
}

function updateUI(disabled = false) {
  renderDice(disabled);
  renderScorecard();
  updateTotalsUI();
  rollCountEl.textContent = GAME.rollsThisTurn;
  turnNumEl.textContent = Math.min(GAME.turn, 13);
}

function updateStatus(msg) {
  if (msg) statusEl.textContent = msg;
  else if (GAME.rollsThisTurn < 3)
    statusEl.textContent = `Click dice to keep/unkeep. You may roll up to 3 times per turn.`;
  else statusEl.textContent = `Max rolls reached — choose a category to score.`;
}

/********************
 * EVENT LISTENERS
 ********************/
rollBtn.addEventListener('click', rollDice);
resetKept.addEventListener('click', resetKeptDice);
endTurnBtn.addEventListener('click', () => updateStatus('Pick a category on the right to score this turn.'));
newGameBtn.addEventListener('click', startNewGame);

/********************
 * INITIAL RENDER
 ********************/
startNewGame();