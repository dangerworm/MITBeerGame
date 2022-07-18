import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';

import { GamesView } from './components/Games/Games';
import { TeamsView } from './components/Teams/Teams';
import { PlayersView } from './components/Players/Players';
import { PlayView } from './components/Play/Play';
import { GameSetupDataContextProvider } from './components/Contexts/GameSetupDataContext';
import { GameplayDataContextProvider } from './components/Contexts/GameplayDataContext';

function App() {
  return (
    <Router>
      <GameSetupDataContextProvider>
        <GameplayDataContextProvider>
          <Routes>
            <Route path="/" element={<GamesView />} />
            <Route path="/Games" element={<GamesView />} />
            <Route path="/Teams/:gameId" element={<TeamsView />} />
            <Route path="/Players/:gameId/:teamId" element={<PlayersView />} />
            <Route path="/Play/:gameId/:teamId/:playerId" element={<PlayView />} />
          </Routes>
        </GameplayDataContextProvider>
      </GameSetupDataContextProvider>
    </Router>
  );
}

export default App;
