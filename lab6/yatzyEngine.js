// YatzyEngine - calculates scores according to rules
class YatzyEngine {
  constructor() {
    // Define scoring categories and rules
    this.categories = [
      'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
      'threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight',
      'largeStraight', 'yatzy', 'chance'
    ];
  }

  // Calculate score for a given category and dice values
  calculateScore(category, diceValues) {
    // Skeleton: return 0 for now
    return 0;
  }

  // Optional: validate if a category has been scored already
  isCategoryAvailable(category) {
    return true;
  }
}

// Export the module
export default YatzyEngine;
