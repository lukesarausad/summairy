import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const HistoryMenu = ({ onSelectHistory, historyCallBack }) => { 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="history-menu-container">
      <button 
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle history menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="history-dropdown">
          {historyCallBack.length > 0 ? (
            historyCallBack.map((item, index) => (
              <div 
                key={index}
                className="history-item"
                onClick={() => {
                  onSelectHistory(item);
                  setIsOpen(false);
                }}
              >
                <h4>{item.originalArticle?.title || 'Untitled Article'}</h4>
              </div>
            ))
          ) : (
            <div className="history-item empty">No history available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryMenu;