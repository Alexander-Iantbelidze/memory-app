import React, { useEffect, useState } from 'react';

async function getTopScores() {
  try {
    const response = await fetch('/api/scores');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }

    const text = await response.text();
    console.log('Response text:', text); // Protokolliere die Antwort

    if (text.trim() === '') {
      return []; // Leere Antwort behandeln
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return [];
  }
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
      <h2>Top 5 Scores</h2>
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

export { TopScores };