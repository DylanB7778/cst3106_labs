# Yatzy — Single Player Dice Game

This is the readme for the Yatzy game. 
This project was created for Assignment 1: Single-Player Yatzy Game Development (JS).  
It’s built using HTML, CSS, and JavaScript.

---

# How to Play

1. Click Roll Dice to roll all five dice.  
2. Click on any dice you want to keep, they’ll stay locked for your next roll.  
3. You can roll up to three times per turn.  
4. After rolling, choose a scoring category (like Three of a Kind, Full House, etc.) to apply your points.  
5. Once all categories are filled or you choose to end early, the game will display your final score and a message congratulating (or teasing) you.

---

# Scoring Categories

| Category | Description | Points |

1. | Ones – Sixes | Add up all dice showing that number | Sum of dice |
2. | Three of a Kind | 3 dice of same number | Sum of all dice |
3. | Four of a Kind | 4 dice of same number | Sum of all dice |
4. | Full House | 3 of one + 2 of another | 25 |
5. | Small Straight | Sequence of 4 (1-2-3-4-5 or 2-3-4-5-6) | 30 |
6. | Large Straight | Sequence of 5 | 40 |
7. | Yatzy | 5 of a kind | 50 |
8. | Chance | Any dice, sum total | Sum of all dice |

Get 63+ points in the Ones–Sixes section for a bonus of 35 points!


# Tech Stack

- HTML → Structure and layout of the game board  
- CSS → Visual design, layout, and responsiveness  
- JavaScript → Handles dice rolls, scoring logic, and UI updates  

# Design System

We designed a clean and modern visual style to make gameplay intuitive and appealing.

| Element           | Font / Style           | Color / Hex      | Rationale |


1. | Headings (H1, H2)| Inter, 700            | #06B6D4        | Bold and vibrant for clarity |
2. | Subheadings       | Inter, 500            | #9AA4B2        | Muted, secondary emphasis |
3. | Body text         | Inter, 400            | #E6EEF6        | Easy to read on dark background |
4. | Background        | N/A                    | #0F1724        | Dark theme for contrast and focus |
5. | Cards / Dice      | Rounded, subtle shadow | #0B1220        | Soft, modern, minimal distraction |
6. | Buttons           | Bold, gradient         | #06B6D4 → #0891B2 | Clear call-to-action, visually appealing |

Rationale:  
The palette emphasizes readability and contrast, ensuring scores and buttons stand out. Fonts maintain hierarchy and legibility, while a dark theme reduces eye strain.

I implemented the following components using HTML and CSS:

1. Game Board – Shows current dice, rolls remaining, and turn number
2. Dice Row – Interactive dice, clickable to keep or release
3. Scorecard – Lists all categories with current scores, updates dynamically
4. Controls – Buttons for Roll, Reset, End Turn, New Game

Example HTML Snippet:

<div class="dice-row">
  <div class="die">⚀</div>
  <div class="die kept">⚄</div>
  <div class="die">⚂</div>
  <div class="die">⚃</div>
  <div class="die">⚁</div>
</div>
<button id="rollBtn">Roll Dice</button>

Flow: Roll dice → choose dice to keep → reroll if desired → select scoring category → next turn
Score Updates: Scorecard updates immediately after category selection