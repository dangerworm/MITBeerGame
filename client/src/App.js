import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';

import { GamesView } from './components/Games/Games';
import { TeamView } from './components/Team/Team';
import { PlayerView } from './components/Player/Player';
import { AppDataContextProvider } from './components/Contexts/AppDataContext';

function App() {
  return (
    <Router>
      <AppDataContextProvider>
        <Routes>
          <Route path="/" element={<GamesView />} />
          <Route path="/Game/:gameId" element={<TeamView />} />
          <Route path="/Team/:teamId" element={<PlayerView />} />
        </Routes>
      </AppDataContextProvider>
    </Router>
  );
}

export default App;
