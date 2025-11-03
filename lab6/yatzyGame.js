// YatzyGame - manages the current state of the game
import Dice from './dice.js';
import YatzyEngine from './yatzyEngine.js';

class YatzyGame {
  constructor() {
    this.dice = new Dice();
    this.engine = new YatzyEngine();
    this.turn = 1;
    this.rollsThisTurn = 0;
    this.scores = {}; // Store scores per category
    this.keptDice = Array(5).fill(false); // Track which dice are kept
  }

  // Start a new turn
  startTurn() {
    this.rollsThisTurn = 0;
    this.keptDice.fill(false);
  }

  // Roll dice
  rollDice() {
    this.rollsThisTurn++;
    return this.dice.roll(this.keptDice);
  }

  // Keep/unkeep a die
  toggleKeep(index) {
    this.keptDice[index] = !this.keptDice[index];
  }

  // Score a category
  scoreCategory(category) {
    const diceValues = this.dice.getValues();
    const score = this.engine.calculateScore(category, diceValues);
    this.scores[category] = score;
    this.turn++;
    this.startTurn();
    return score;
  }
}

// Export the module
export default YatzyGame;
