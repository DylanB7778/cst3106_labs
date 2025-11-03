// Dice module - handles rolling dice
class Dice {
  constructor(numDice = 5) {
    this.numDice = numDice;
    this.values = Array(numDice).fill(0);
  }

  // Roll all dice or only unkept dice
  roll(kept = []) {
    for (let i = 0; i < this.numDice; i++) {
      if (!kept[i]) this.values[i] = Math.floor(Math.random() * 6) + 1;
    }
    return this.values;
  }

  // Optionally, get current dice values
  getValues() {
    return this.values;
  }
}

// Export the module
export default Dice;
