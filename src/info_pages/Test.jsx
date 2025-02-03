import React from 'react'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const Test = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [popupClass, setPopupClass] = React.useState('');
  
    const openPopup = () => {
      setIsOpen(true);
    };
  
    const closePopup = () => {
      setPopupClass(''); // удаляем анимацию при закрытии
      setTimeout(() => setIsOpen(false), 300); // задержка, чтобы анимация завершилась
    };
  
    React.useEffect(() => {
      if (isOpen) {
        setPopupClass('popup-open');
      }
    }, [isOpen]);
  
    return (
        <div>
            <button onClick={openPopup}>Open Popup</button>

            <Popup open={isOpen} onClose={closePopup} closeOnDocumentClick>
            <div className={`modal ${popupClass} text-black`}>
                <h2>Popup Content</h2>
                <p>Here is some content inside the popup.</p>
                <button onClick={closePopup}>Close</button>
            </div>
            </Popup>
        </div>
    );
}

export default Test