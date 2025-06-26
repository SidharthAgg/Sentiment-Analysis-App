import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [movie, setMovie] = useState('');
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/analyze', { movie, review });
      setResult({ ...response.data, movie });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <h1 className="title">Movie Review Sentiment Analyzer</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          className="input"
          type="text"
          placeholder="Enter movie name..."
          value={movie}
          onChange={(e) => setMovie(e.target.value)}
        />
        <textarea
          className="textarea"
          rows="5"
          placeholder="Enter a movie review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="button"
        >
          Analyze Sentiment
        </button>
      </form>
      {result && (
        <div className="result">
          <h2 className="result-title">Result: {result.sentiment}</h2>
          <p className="explanation">Movie: <strong>{result.movie}</strong></p>
          <p className="explanation">{result.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default App;
