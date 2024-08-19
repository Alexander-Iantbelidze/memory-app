import React from 'react';
import './Card.css';

function Card({ image, onClick, flipped, matched }) {
  return (
    <> 
    <div className={`card ${flipped ? 'flipped' : ''} ${matched ? 'matched' : ''}`} onClick={onClick}>
      <div className="inner">
        <div className="front">
          <img src={image.url} alt="memory card" />
        </div>
        <div className="back"></div>
      </div>
    </div>
    </>
  );
}

export default Card;
