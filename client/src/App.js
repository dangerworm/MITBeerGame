import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';

import NewGame from './components/NewGame/NewGame';
import NewPlayer from './components/NewPlayer/NewPlayer';

function App() {
  return (
    <div style={{ margin: "0 30%" }}>
      <Router>
        <Routes>
          <Route exact path="/" element={<NewGame />} />
          <Route exact path="/newPlayer/:gameId" element={<NewPlayer />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
