import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, HostName, GetHeaders, PostHeaders, UpdateGames } from '../../Constants'

const NewGame = (props) => {
  const [connection, setConnection] = useState(null);
  const [games, setGames] = useState([]);
  const [gameName, setGameName] = useState('');

  const gameHub = 'gameHub';

  const getGamesEndpoint = 'Game/GetGames'
  const createGameEndpoint = 'Game/CreateGame';

  const createConnection = () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(HostName + gameHub)
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);
  }

  const getGames = () => {
    const endpoint = HostName + getGamesEndpoint;
    fetch(endpoint, GetHeaders)
      .then(response => response
        .json()
        .then(data => setGames(data)));
  };

  const onGameNameUpdate = (event) => {
    setGameName(event.target.value);
  }

  const postNewGameName = async () => {
    const response = await fetch(HostName + createGameEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameName })
    });

    if (response.ok) {
      const gameId = response.body.json()['gameId'];
      window.location.href = `/newPlayer/${gameId}`;
    }
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if (gameName && gameName !== '') {
      postNewGameName();
    }
    else {
      alert('Please type the name of a new game.');
    }
  }

  useEffect(() => {
    if (!!connection && connection.state !== Connected) {
      connection.start()
        .then(_ => {
          console.log("Connected!");

          connection.on(UpdateGames, data => {
            setGames(data);
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [connection, setGames])

  useEffect(() => {
    createConnection(HostName);
    getGames();
  }, []);

  return (
    <div>
      <h1>MIT Beer Game</h1>
      <h2 style={{ marginBottom: "4pt" }}>New Game</h2>
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
          <h2 style={{ marginBottom: "4pt" }}>Existing Games</h2>
          <ul>
            {games.map(g =>
              <li key={g.id}>{g.name}</li>
            )}
          </ul>
        </div>
      }
    </div>
  )
}

export default NewGame;