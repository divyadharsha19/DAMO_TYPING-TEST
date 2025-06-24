import React, { useEffect, useState, useRef } from 'react';
import './App.css';

// 🔟 Sample Typing Texts
const TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice typing every day to improve speed and accuracy.",
  "React makes it easy to build interactive UIs with components.",
  "JavaScript is the language of the web, loved by developers.",
  "Focus on accuracy before worrying about typing faster.",
  "Typing tests help build muscle memory in your fingers.",
  "Frontend development combines HTML, CSS, and JavaScript.",
  "A clean user interface enhances the user experience.",
  "Discipline and consistency are keys to mastering typing.",
  "Dark mode is easier on the eyes, especially at night."
];

function App() {
  const [quote, setQuote] = useState(TEXTS[0]);
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState(60);
  const [mode, setMode] = useState('normal');
  const [duration, setDuration] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [highScores, setHighScores] = useState(() => {
    return JSON.parse(localStorage.getItem('highScores')) || [];
  });

  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      endTest();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timer]);

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);

    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== quote[i]) errors++;
    }
    setMistakes(errors);

    const correctChars = value.length - errors;
    setAccuracy(value.length ? Math.max(0, ((correctChars / value.length) * 100).toFixed(0)) : 100);
    setWpm(((correctChars / 5) / ((duration - timer) / 60)).toFixed(0));
  };

  const startTest = () => {
    const randomQuote = TEXTS[Math.floor(Math.random() * TEXTS.length)];
    setQuote(randomQuote);
    setInput('');
    setTimer(duration);
    setMistakes(0);
    setIsRunning(true);
    setWpm(0);
    setAccuracy(100);
  };

  const endTest = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    const score = parseInt(wpm);
    if (!isNaN(score) && score > 0) {
      const newScores = [score, ...highScores].slice(0, 5);
      setHighScores(newScores);
      localStorage.setItem('highScores', JSON.stringify(newScores));
    }
  };

  const handleThemeToggle = () => {
    document.body.classList.toggle('dark');
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero">
        <h1><span role="img" aria-label="rocket">🚀</span> 
        <span style={{ color: 'inherit' }}>DAMO Typing Speed Test</span></h1>

        <p>Improve your typing skills with real-time stats, strict mode, and performance tracking!</p>
      </section>

      {/* Settings Section */}
      <section className="settings">
        <label>Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="strict">Strict</option>
        </select>

        <label>Time:</label>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          <option value={30}>30s</option>
          <option value={60}>60s</option>
          <option value={120}>120s</option>
        </select>

        <button onClick={handleThemeToggle}>🌗 Toggle Theme</button>
      </section>
    <div className="main-layout">
  <div className="typing-area">
    <section className="typing-test">
      <div className="quote-box">
        {quote.split('').map((char, idx) => {
          let className = '';
          if (input[idx]) {
            className = input[idx] === char ? 'correct' : 'incorrect';
          }
          return <span key={idx} className={className}>{char}</span>;
        })}
      </div>

      <textarea
        value={input}
        onChange={handleInput}
        disabled={!isRunning}
        placeholder="Start typing here..."
      ></textarea>

      <div className="stats">
        <div><strong>⏰ Time:</strong> {timer}s</div>
        <div><strong>⚡ WPM:</strong> {wpm}</div>
        <div><strong>✅ Accuracy:</strong> {accuracy}%</div>
        <div><strong>❌ Mistakes:</strong> {mistakes}</div>
      </div>

      <button onClick={startTest}>🔁 Restart</button>
    </section>
  </div>

  <aside className="high-scores">
    <h2>🏆 Your Top Scores</h2>
    <ul>
      {highScores.map((score, idx) => (
        <li key={idx}>#{idx + 1}: {score} WPM</li>
      ))}
    </ul>
  </aside>
</div>


      {/* How it Works Section */}
      <section className="how-it-works">
        <h2>❓ How it Works</h2>
        <p>
          Type the text shown above as fast and accurately as you can. Mistakes are highlighted. 
          You can switch to strict mode, change the timer, and track your previous scores!
        </p>
      </section>

      {/* Footer */}
      <footer>
        <p>Made by CHIKU | <a href="https://github.com/">GitHub</a> | © 2025</p>
      </footer>
    </div>
  );
}

export default App;
