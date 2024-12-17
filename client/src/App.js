// App.js
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar.js';
import HistoryMenu from './HistoryMenu.js';
import { Linkedin, Twitter, Cloudy } from 'lucide-react';
import aiIcon from './images/aiPic.png';
import './App.css';

function App() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currReq, setCurrReq] = useState(null);
  const [history, setHistory] = useState([]);
  
  

  const handleSubmit = async (query, postType) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/searchSummary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, postType }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      setCurrReq({query, postType});
      const data = await response.json();
      console.log('Response from backend:', data);
      setSummary(data);
      fetchHistory();
      // You can remove the alert and instead display the data in your UI
    } catch (error) {
      console.error('Error during API call:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegen = async () => {
    if (!currReq) {
      alert('Please enter a valid search query');
      return;
    }
    const { query, postType } = currReq;
    handleSubmit(query, postType);
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8080/getHistory');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleHistorySelect = (historyItem) => {
    setSummary(historyItem);
    setCurrReq(null);
  };

  // Fetch history when component mounts
  useEffect(() => {
    fetchHistory();
  }, []);


  return (
    <div className="app">
      <HistoryMenu onSelectHistory={handleHistorySelect} historyCallBack={history}/>
      <header>
        <h1>Summ 
        <img src={aiIcon} alt="AI" className="title-icon" />
          ry<Cloudy size={48} /> </h1> 
      </header>
      <main>
        <SearchBar onSubmit={handleSubmit} isLoading={loading} onRegen={handleRegen}/>

        
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        
        {summary && (
          <div className="summary-container">
            <h2>{summary.originalArticle?.title}</h2>
            <div className="summary-content">
              {summary.summary}
            </div>
          </div>
        )}
        <div className="social-icons">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <Linkedin className="social-icon" size={24} />
        </a>
        <a href="https://x.com" target="_blank" rel="noopener noreferrer">
          <Twitter className="social-icon" size={24} />
        </a>
      </div>
      </main>
    </div>
  );
}

export default App;
