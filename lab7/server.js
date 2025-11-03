// LAB 07: Server-side Dice Module
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static client files
app.use(express.static(__dirname));

// Endpoint to roll five dice
app.get('/roll-dices', (req, res) => {
  const dice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
  res.json({ dice });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
