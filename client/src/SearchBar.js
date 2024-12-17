import React, { useState } from 'react';
import { RotateCcw }from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSubmit, isLoading, onRegen }) => {
  const [inputValue, setInputValue] = useState('');
  const [postType, setPostType] = useState('default');

  const handleSubmit = () => {
    if (!inputValue.trim()) {
      alert('Please enter a valid search query');
      return;
    }
    onSubmit(inputValue, postType); 
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Enter Article URL..."
        className="search-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="regen-getlast"> 
      <button 
          className="regen-button"
          onClick={onRegen}
          title="Regenerate"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="format-select">
        <label className="radio-label">
          <input
            type="radio"
            value="default"
            checked={postType === 'default'}
            onChange={(e) => setPostType(e.target.value)}
          />
          Default Summary
        </label>
        
        <label className="radio-label">
          <input
            type="radio"
            value="linkedin"
            checked={postType === 'linkedin'}
            onChange={(e) => setPostType(e.target.value)}
          />
          LinkedIn
        </label>
        
        <label className="radio-label" >
          <input
            type="radio"
            value="twitter"
            checked={postType === 'twitter'}
            onChange={(e) => setPostType(e.target.value)}
          />
          X
        </label>
      </div>
    
      <button className="search-button" onClick={handleSubmit} disabled={isLoading}>
        {isLoading? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
};

export default SearchBar;

