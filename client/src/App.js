import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';

import { GamesView } from './components/Games/Games';
import { TeamsView } from './components/Teams/Teams';
import { PlayersView } from './components/Players/Players';
import { PlayView } from './components/Play/Play';
import { AppDataContextProvider } from './components/Contexts/AppDataContext';

function App() {
  return (
    <Router>
      <AppDataContextProvider>
        <Routes>
          <Route path="/" element={<GamesView />} />
          <Route path="/Games" element={<GamesView />} />
          <Route path="/Teams/:gameId" element={<TeamsView />} />
          <Route path="/Players/:gameId/:teamId" element={<PlayersView />} />
          <Route path="/Play/:gameId/:teamId/:playerId" element={<PlayView />} />
        </Routes>
      </AppDataContextProvider>
    </Router>
  );
}

export default App;
