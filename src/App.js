import React, { useEffect, useState } from 'react';
import { fetchImages } from './api/picsum';
import { generateCardSet } from './utils';
import Card from './components/Card/Card.js';
import './App.css';
import { TopScores, submitScore } from './components/TopScore.js';

function App() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showToast, setShowToast] = useState(false);

const [startTime, setStartTime] = useState(null);
const [elapsedTime, setElapsedTime] = useState(null);

  useEffect(() => {
    const fetchedImages = fetchImages(); 
    const cardSet = generateCardSet(fetchedImages);
    setCards(cardSet);
  }, []);

  useEffect(() => {
    if (matchedPairs === cards.length / 2 && cards.length > 0) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      const minutes = Math.floor(timeTaken / 60);
      const seconds = Math.floor(timeTaken % 60);
      setElapsedTime(`${minutes} minute(s) and ${seconds} second(s)`);
      setShowToast(true);
      submitScore('Player', timeTaken);
      setTimeout(() => {
        window.location.reload();
      }, 10000); // Toast message duration
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
        setCards(prevCards =>
          prevCards.map((card, i) =>
            i === firstIndex || i === secondIndex ? { ...card, matched: true } : card
          )
        );
        setMatchedPairs(matchedPairs + 1);
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  };

  return (
    <div className="App">
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
      {showToast && (
        <div className="toast-overlay">
          <div className="toast-message">   
            <p>You have found all image pairs in: {elapsedTime} 🥳🥳</p>
          </div>
        </div>
      )}
      <TopScores />
    </div>
  );
}

export default App;
