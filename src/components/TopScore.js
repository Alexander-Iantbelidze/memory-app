import React, { useEffect, useState } from 'react';

async function submitScore(name, time) {
  const response = await fetch('/api/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, time }),
  });
  const data = await response.json();
  return data;
}

async function getTopScores() {
  const response = await fetch('/api/scores');
  const data = await response.json();
  return data;
}

function TopScores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    async function fetchScores() {
      const topScores = await getTopScores();
      setScores(topScores);
    }
    fetchScores();
  }, []);

  return (
    <div>
      <h2>Top 5 Scores:</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.name}: {score.time}s
          </li>
        ))}
      </ul>
    </div>
  );
}

export { TopScores, submitScore };