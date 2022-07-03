import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, CreateNewGame } from '../../Constants'

const NewGame = (props) => {
  const [connection, setConnection] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const endpoint = 'hub/test';
    const httpConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/' + endpoint)
      .withAutomaticReconnect()
      .build()
      .start()
      .then(result => {
        setConnection(result);
      })
      .catch(e => {
        console.log(e);
      });

    const httpsConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5000/' + endpoint)
      .withAutomaticReconnect()
      .build()
      .start()
      .then(result => {
        setConnection(result);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  const sendMessage = async(name) => {
    const newGameMessage = { name };

    if (connection.state === Connected) {
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

  const onSubmit = (event) => {
    event.preventDefault();

    const isNameProvided = name && name !== '';
  
    if (isNameProvided) {
      sendMessage(name);
    }
    else {
      alert('Please type a name and team, and pick a role');
    }
  }

  const onNameUpdate = (event) => {
    setName(event.target.value);
  }

  return (
    <div>
    <h1>MIT Beer Game</h1>
    <form onSubmit={onSubmit}>
      <label htmlFor={name}>Name:</label>
      <br/>
      <input id="name" name="name" value={name} onChange={onNameUpdate} />
      <br/>
      <br/>
      <button>Submit</button>
    </form>
    </div>
  )
}

export default NewGame;