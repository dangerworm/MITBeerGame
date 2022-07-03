import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, CreateNewPlayer } from '../../Constants'

const NewPlayer = (props) => {
  const [connection, setConnection] = useState(null);
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5000/hubs/chat')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  const sendMessage = async(name, team, role) => {
    const newPlayerMessage = { name, team, role };

    if (connection.state === Connected) {
      try {
        await connection.send(CreateNewPlayer, newPlayerMessage);
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
    const isTeamProvided = team && team !== '';
    const isRoleProvided = role && role !== '';
  
    if (isNameProvided && isTeamProvided && isRoleProvided) {
      sendMessage(name, team, role);
    }
    else {
      alert('Please type a name and team, and pick a role');
    }
  }

  const onNameUpdate = (event) => {
    setName(event.target.value);
  }

  const onTeamUpdate = (event) => {
    setTeam(event.target.value);
  }

  const onRoleUpdate = (newRole) => {
    setRole(newRole);
  }

  return (
    <div>
    <h1>MIT Beer Game</h1>
    <form onSubmit={onSubmit}>
      <label htmlFor={name}>Name:</label>
      <br/>
      <input id="name" name="name" value={name} onChange={onNameUpdate} />
      <br/>
      <label htmlFor={team}>Team:</label>
      <br/>
      <input id="team" name="team" value={team} onChange={onTeamUpdate} />
      <br/>
      <label htmlFor={role}>Role:</label>
      <br/>
      <input id="role-vendor" name="role" type="radio" radioGroup="roles" value={role === "vendor"} onChange={_ => onRoleUpdate('vendor')} />
      <label for="role-vendor">Vendor</label>
      <br/>
      <input id="role-wholesaler" name="role" type="radio" radioGroup="roles" value={role === "wholesaler"} onChange={_ => onRoleUpdate('wholesaler')} />
      <label for="role-wholesaler">Wholesaler</label>
      <br/>
      <input id="role-distributor" name="role" type="radio" radioGroup="roles" value={role === "distributor"} onChange={_ => onRoleUpdate('distributor')} />
      <label for="role-distributor">Distributor</label>
      <br/>
      <input id="role-brewery" name="role" type="radio" radioGroup="roles" value={role === "brewer"} onChange={_ => onRoleUpdate('brewer')} />
      <label for="role-brewery">Brewer</label>
      <br/>
      <br/>
      <button>Submit</button>
    </form>
    </div>
  )
}

export default NewPlayer;