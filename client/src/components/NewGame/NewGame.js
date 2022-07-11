import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, CreateNewGame, UpdateGames } from '../../Constants'

const NewGame = (props) => {
  const [connection, setConnection] = useState(null);
  const [games, setGames] = useState([]);
  const [name, setName] = useState('');

  const hostname = 'https://localhost:7046/';
  const endpoint = 'gameHub';

  const getGamesEndpoint = 'https://localhost:7046/Game/GetGames'
  const createGameEndpoint = 'https://localhost:7046/Game/CreateGame';

  const createConnection = (hostname) => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(hostname + endpoint)
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);
  }

  const getGames = () => {
    fetch(getGamesEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        response
          .json()
          .then(data => {
            setGames(data);
          });
      });
  }

  const postNewGameName = () => {
    fetch(createGameEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gameName: name })
    });
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
  
  const sendMessage = async(name) => {
    const newGameMessage = { name };

    if (!!connection && connection.state === Connected) {
      try {
        await connection.send(CreateNewGame, newGameMessage);
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      alert ('No connection to server yet');
    }
  }

  useEffect(() => {
    createConnection(hostname);
    getGames();
  }, []);

   const onNameUpdate = (event) => {
    setName(event.target.value);
  }

  const onSubmit = (event) => {
    event.preventDefault();

    const isNameProvided = name && name !== '';

    if (isNameProvided) {
      postNewGameName();
    }
    else {
      alert('Please type a name and team, and pick a role');
    }
  }

  return (
    <div>
      <h1>MIT Beer Game</h1>
      {games.length > 0 &&
        <div>
          <h2>Existing Games</h2>
          <ul>
            {games.map(g =>
              <li key={g.id}>{g.name}</li>
            )}
          </ul>
        </div>
      }
      <form onSubmit={onSubmit}>
        <label htmlFor={name}>New game name:</label>
        <br />
        <input id="gameName" name="gameName" value={name} onChange={onNameUpdate} />
        <br />
        <br />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default NewGame;