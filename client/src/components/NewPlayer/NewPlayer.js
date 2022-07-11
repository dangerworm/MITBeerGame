import React, { useState, useParams, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, HostName, GetHeaders, PostHeaders, UpdateTeams } from '../../Constants'

const NewPlayer = (props) => {
  const { gameId } = useParams();

  const [connection, setConnection] = useState(null);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [role, setRole] = useState('');

  const endpoint = 'gameHub';

  const getTeamsEndpoint = 'Game/GetTeams';
  const createTeamEndpoint = 'Game/CreateTeam';
  const addPlayerEndpoint = 'Game/AddPlayer';

  const createConnection = () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(HostName + endpoint)
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);
  }

  const getTeams = () => {
    fetch(HostName + getTeamsEndpoint, GetHeaders)
      .then(response => response
        .json()
        .then(data => setTeams(response.json())));
  }

  const onNameUpdate = (event) => {
    setName(event.target.value);
  }

  const onTeamNameUpdate = (event) => {
    setTeamName(event.target.value);
  }

  const onRoleUpdate = (newRole) => {
    setRole(newRole);
  }

  const postCreateTeam = async () => {
    const response = await fetch(HostName + createTeamEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, teamName })
    });

    if (response.ok) {
      window.location.href = '/';
    }
  }

  const postAddPlayer = async () => {
    const response = await fetch(HostName + addPlayerEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ teamId, playerName: name, playerRole: role })
    });

    if (response.ok) {
      console.log(response.body.json());
      //window.location.href = '/';
    }
  }

  const onCreateTeam = (event) => {
    event.preventDefault();

    if (teamName && teamName !== '') {
      postCreateTeam();
    }
    else {
      alert('Please type a team name.');
    }
  }

  const onAddPlayer = (event) => {
    event.preventDefault();

    const isNameProvided = name && name !== '';
    const isTeamNameProvided = teamName && teamName !== '';
    const isRoleProvided = role && role !== '';

    if (isNameProvided && isTeamNameProvided && isRoleProvided) {
      postAddPlayer();
    }
    else {
      alert('Please type a name and team, and pick a role');
    }
  }

  useEffect(() => {
    if (!!connection && connection.state !== Connected) {
      connection.start()
        .then(_ => {
          console.log("Connected!");

          connection.on(UpdateTeams, data => {
            setTeams(data);
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [connection, setTeams])

  useEffect(() => {
    createConnection(HostName);
    getTeams();
  }, []);

  return (
    <div>
      <h1>MIT Beer Game</h1>
      {teams.length > 0 &&
        <div>
          <h2 style={{ marginBottom: "4pt" }}>Existing Teams</h2>
          <ul>
            {teams.map(t =>
              <li key={t.id} onClick={_ => setTeamId(t.id)}>{t.name}</li>
            )}
          </ul>
        </div>
      }
      <h2>New Team</h2>
      <form onSubmit={onCreateTeam}>
        <label htmlFor={teamName}>Name your team:</label>
        <br />
        <input id="teamName" name="teamName" value={teamName} onChange={onTeamNameUpdate} />
        <br />
        <br />
        <button>Submit</button>
      </form>
      <h2 style={{ marginBottom: "4pt" }}>New Player</h2>
      <form onSubmit={onAddPlayer}>
        <label htmlFor={name}>Name:</label>
        <br />
        <input id="name" name="name" value={name} onChange={onNameUpdate} />
        <br />
        <label htmlFor={teamName}>Team:</label>
        <br />
        <input id="teamName" name="teamName" value={teamName} onChange={onTeamNameUpdate} />
        <br />
        <label htmlFor={role}>Role:</label>
        <br />
        <input id="role-vendor" name="role" type="radio" radioGroup="roles" value={role === "vendor"} onChange={_ => onRoleUpdate('vendor')} />
        <label for="role-vendor">Vendor</label>
        <br />
        <input id="role-wholesaler" name="role" type="radio" radioGroup="roles" value={role === "wholesaler"} onChange={_ => onRoleUpdate('wholesaler')} />
        <label for="role-wholesaler">Wholesaler</label>
        <br />
        <input id="role-distributor" name="role" type="radio" radioGroup="roles" value={role === "distributor"} onChange={_ => onRoleUpdate('distributor')} />
        <label for="role-distributor">Distributor</label>
        <br />
        <input id="role-brewery" name="role" type="radio" radioGroup="roles" value={role === "brewer"} onChange={_ => onRoleUpdate('brewer')} />
        <label for="role-brewery">Brewer</label>
        <br />
        <br />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default NewPlayer;