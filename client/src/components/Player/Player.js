import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { useAppDataContext } from '../Contexts/AppDataContext';

import AppPage from '../AppPage/AppPage';

const createPlayerEndpoint = 'Game/CreatePlayer';

export const PlayerView = (props) => {
  const { teamId } = useParams();
  const { setTeamId, team, players } = useAppDataContext();

  useEffect(() => {
    setTeamId(teamId);
  }, [setTeamId, teamId]);

  return (
    <AppPage>
      <Player
        teamId={teamId}
        team={team}
        players={players}
      />
    </AppPage>
  );
}
export const Player = (props) => {
  const { teamId, team, players } = props;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const onNameUpdate = (event) => {
    setName(event.target.value);
  }

  const onRoleUpdate = (newRole) => {
    setRole(newRole);
  }

  const createPlayer = async () => {
    await fetch(HostName + createPlayerEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ teamId, playerName: name, playerRole: role })
    });
  }

  const onAddPlayer = (event) => {
    event.preventDefault();

    const isNameProvided = name && name !== '';
    const isRoleProvided = role && role !== '';

    if (isNameProvided && isRoleProvided) {
      createPlayer();
    }
    else {
      alert('Please type a name and team, and pick a role');
    }
  }

  return (
    <div>
      <h2>New Player</h2>
      <form onSubmit={onAddPlayer}>
        <label htmlFor={name}>Name:</label>
        <br />
        <input id="name" name="name" value={name} onChange={onNameUpdate} />
        <br />
        <label htmlFor={team?.name}>Team:</label>
        <br />
        <input readOnly id="teamName" name="teamName" value={team?.name} />
        <br />
        <label htmlFor={role}>Role:</label>
        <br />
        <input id="role-vendor" name="role" type="radio" radioGroup="roles" value={role === "vendor"} onChange={_ => onRoleUpdate('vendor')} />
        <label htmlFor="role-vendor">Vendor</label>
        <br />
        <input id="role-wholesaler" name="role" type="radio" radioGroup="roles" value={role === "wholesaler"} onChange={_ => onRoleUpdate('wholesaler')} />
        <label htmlFor="role-wholesaler">Wholesaler</label>
        <br />
        <input id="role-distributor" name="role" type="radio" radioGroup="roles" value={role === "distributor"} onChange={_ => onRoleUpdate('distributor')} />
        <label htmlFor="role-distributor">Distributor</label>
        <br />
        <input id="role-brewery" name="role" type="radio" radioGroup="roles" value={role === "brewer"} onChange={_ => onRoleUpdate('brewer')} />
        <label htmlFor="role-brewery">Brewer</label>
        <br />
        <br />
        <button>Submit</button>
      </form>

      {players.length > 0 &&
        <div>
          <h2 style={{ marginBottom: "4pt" }}>Current Players</h2>
          <ul>
            {players.map(p =>
              <Link key={`link-${p.id}`} to={`/Player/${p.id}`}>
                <li key={p.id}>{p.playerName} is the {p.role}</li>
              </Link>
            )}
          </ul>
        </div>
      }
    </div>
  )
}
