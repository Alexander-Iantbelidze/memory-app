import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchImages } from './api/picsum';
import { generateCardSet } from './utils';
import Card from './components/Card/Card.js';
import './App.css';

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b/66d4a10facd3cb34a87cd5bd';
const JSONBIN_API_KEY = '$2a$10$oVFjyfDJ6H6pzQkneDKLbOnb1RW.z5Vno5FiQnfPMug9eQzKfCt16';

function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchedImages = fetchImages();
    const cardSet = generateCardSet(fetchedImages);
    setCards(cardSet);
    
    fetchScores();
  }, []);
  
  const fetchScores = async () => {
    try {
      const response = await axios.get(JSONBIN_API_URL, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        }
      });
      console.log("Fetched response data:", response.data);
      if (response.data && response.data.record && Array.isArray(response.data.record.record)) {
        setScores(response.data.record.record);
      } else {
        setScores([]);
      }
    } catch (error) {
      console.error("Failed to fetch scores:", error);
      setScores([]);
    }
  };

  useEffect(() => {
    if (matchedPairs === cards.length / 2 && cards.length > 0) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      const minutes = Math.floor(timeTaken / 60);
      const seconds = Math.floor(timeTaken % 60);
      const formattedTime = `${minutes} minute(s) and ${seconds} second(s)`;
      setElapsedTime(formattedTime);
      setShowToast(true);

      setTimeout(() => {
        setShowInput(true);
      }, 5000);
    }
  }, [matchedPairs, cards, startTime]);

  const handleCardClick = (index) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(index)) return;

    if (startTime === null) {
      setStartTime(Date.now());
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex].url === cards[secondIndex].url) {
        setCards((prevCards) =>
          prevCards.map((card, i) =>
            i === firstIndex || i === secondIndex ? { ...card, matched: true } : card
          )
        );
        setMatchedPairs(matchedPairs + 1);
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  };

  const handleNameSubmit = async () => {
    const newScore = { name, time: elapsedTime };
    const updatedScores = [...scores, newScore].sort((a, b) => {
      const aTime = parseInt(a.time.split(' ')[0]) * 60 + parseInt(a.time.split(' ')[3]);
      const bTime = parseInt(b.time.split(' ')[0]) * 60 + parseInt(b.time.split(' ')[3]);
      return aTime - bTime;
    }).slice(0, 5);

    try {
      await axios.put(JSONBIN_API_URL, { record: updatedScores }, {
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        }
      });
      setScores(updatedScores);
    } catch (error) {
      console.error("Failed to update scores:", error);
    }

    setShowInput(false);
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="game-container">
        <h1>Memory Game</h1>
        <div className="grid-container">
          {cards.map((card, index) => (
            <Card
              key={index}
              image={card}
              onClick={() => handleCardClick(index)}
              flipped={flippedIndices.includes(index) || card.matched}
              matched={card.matched}
            />
          ))}
        </div>
      </div>
      <div className="score-list">
        <h2>Top 5 Scores</h2>
        <ol>
          {scores && scores.length > 0 ? scores.map((score, index) => (
            <li key={index}>{score.name} - {score.time}</li>
          )) : <li>No scores yet</li>}
        </ol>
      </div>
      {showToast && (
        <div className="toast-overlay">
          <div className="toast-message">
            <p>You have found all image pairs in: {elapsedTime} 🥳🥳</p>
          </div>
        </div>
      )}
      {showInput && (
        <div className="input-overlay">
          <div className="input-message">
            <p>Enter your name:</p>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleNameSubmit}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
