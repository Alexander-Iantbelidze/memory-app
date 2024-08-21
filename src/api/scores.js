const fs = require('fs');
const path = require('path');

let scores = [];

// Lade bestehende Scores aus einer JSON-Datei
const scoresFilePath = path.resolve(__dirname, 'scores.json');
if (fs.existsSync(scoresFilePath)) {
  scores = JSON.parse(fs.readFileSync(scoresFilePath));
}

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { name, time } = req.body;
    scores.push({ name, time });
    scores.sort((a, b) => a.time - b.time);
    scores = scores.slice(0, 5); // Nur die Top 5 speichern
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores));
    res.status(201).json(scores);
  } else if (req.method === 'GET') {
    res.status(200).json(scores);
  } else {
    res.status(405).send('Method Not Allowed');
  }
};