import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

const PopupComponent = () => {
  const [isAnimateDone, setIsAnimateDone] = useState(false);
  const [isGlitch, setIsGlitch] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    let glitchCycleCleanup;

    const animateCycle = () => {
      setIsAnimateDone(true);

      const glitchCycle = () => {
        setIsGlitch(true);

        const glitchTimer = setTimeout(() => {
          setIsGlitch(false);
        }, 200);

        const normalizerTimer = setTimeout(() => {
          glitchCycle();
        }, Math.random() * 1000 + 3000);

        glitchCycleCleanup = () => {
          clearTimeout(glitchTimer);
          clearTimeout(normalizerTimer);
        };
      };

      glitchCycle();
    };

    if (isPopupOpen) {
      const popupAnimationTimer = setTimeout(() => {
        animateCycle();
      }, 500); 

      return () => {
        clearTimeout(popupAnimationTimer);
        if (glitchCycleCleanup) glitchCycleCleanup();
      };
    } else {
      setIsAnimateDone(false);
      setIsGlitch(false);
      if (glitchCycleCleanup) glitchCycleCleanup();
    }
  }, [isPopupOpen]);

  return (
    <Popup
      trigger={<button className="button">Показать попап</button>}
      modal
      closeOnDocumentClick
      onOpen={() => setIsPopupOpen(true)}
      onClose={() => setIsPopupOpen(false)}
    >
      {(close) => (
        <div className="popup-container">
          <div
            className={`text-container ${isAnimateDone ? 'animate' : ''} ${isGlitch ? 'glitch' : ''}`}
          >
            <span className="text-part left">Match found</span>
            <span className="text-part right">Match found</span>
          </div>
          <div className="popup-buttons">
            <button
              className="btn accept-btn"
              onClick={() => {
                close();
                console.log('User accepted');
              }}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default PopupComponent;
