import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { useAppDataContext } from '../Contexts/AppDataContext';

import AppPage from '../AppPage/AppPage';

const createGameEndpoint = 'Game/CreateGame';

export const GamesView = () => {
  const { games } = useAppDataContext();

  return (
    <AppPage>
      <Games 
        games={games} 
      />
    </AppPage>
  )
}

const Games = (props) => {
  const { games } = props;

  const [gameName, setGameName] = useState('');

  const onGameNameUpdate = (event) => {
    setGameName(event.target.value);
  }

  const createGame = async () => {
    await fetch(HostName + createGameEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameName })
    });
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (gameName && gameName !== '') {
      createGame();
    }
    else {
      alert('Please type the name of a new game.');
    }
  }

  return (
    <div>
      <h2>New Game</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor={gameName}>Name your game:</label>
        <br />
        <input id="gameName" name="gameName" value={gameName} onChange={onGameNameUpdate} />
        <br />
        <br />
        <button>Submit</button>
      </form>

      {games.length > 0 &&
        <div>
          <h2 style={{ marginBottom: "4pt" }}>Current Games</h2>
          <ul>
            {games.map(g =>
              <Link key={`link-${g.id}`} to={`/Game/${g.id}`}>
                <li key={g.id}>{g.name}</li>
              </Link>
            )}
          </ul>
        </div>
      }
    </div>
  )
}
