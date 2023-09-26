import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { HalfWidth } from '../../Styles'
import { useGameSetupDataContext } from '../Contexts/GameSetupDataContext';

import AppPage from '../AppPage/AppPage';

const numberOfRoles = 5;

const createPlayerEndpoint = 'GameSetup/CreatePlayer';
const deletePlayerEndpoint = 'GameSetup/DeletePlayer';

export const PlayersView = (props) => {
  const { gameId } = useParams();
  const { getGameById } = useGameSetupDataContext();

  return (
    <AppPage>
      <Players
        gameId={gameId}
        getGameById={getGameById}
      />
    </AppPage>
  );
}

export const Players = (props) => {
  const { gameId, getGameById } = props;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const game = useMemo(() => {
    return getGameById(gameId)
  }, [gameId, getGameById]);

  const onNameUpdate = (event) => {
    setName(event.target.value);
  }

  const onRoleUpdate = (newRole) => {
    setRole(newRole);
  }

  const createPlayer = async () => {
    await fetch(HostName + createPlayerEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, playerName: name, playerRole: role })
    });
  }

  const deletePlayer = async (playerId) => {
    await fetch(HostName + deletePlayerEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, playerId })
    });
  }

  const onAddPlayer = (event) => {
    event.preventDefault();

    const isNameProvided = name && name !== '';
    const isRoleProvided = role && role !== '';

    if (isNameProvided && isRoleProvided) {
      createPlayer()
        .then(_ => {
          setName('');
          setRole('');
        });
    }
    else {
      alert('Please type a team name, and pick a role');
    }
  }

  const onRemovePlayer = (event, playerId) => {
    event.preventDefault();
    deletePlayer(playerId);
  }

  if (!game) {
    return;
  }

  return (
    <div>
      <Link to={`/`}>
        <h4>&laquo; Back to Games</h4>
      </Link>
      
      {!!game &&
        <h2>{game.name}</h2>
      }
      
      <div style={HalfWidth}>
        <h3 style={{ marginBottom: "4pt" }}>New Player</h3>
        <form onSubmit={onAddPlayer}>
          <label htmlFor="name">Name:</label>
          <br />
          <input id="name" name="name" value={name} onChange={onNameUpdate} />
          <br />
          <br />
          <label htmlFor="role">Role:</label>
          <br />
          <RoleInput roleType={"Vendor"} selectedRole={role} players={game?.players} onRoleUpdate={onRoleUpdate} />
          <br />
          <RoleInput roleType={"Wholesaler"} selectedRole={role} players={game?.players} onRoleUpdate={onRoleUpdate} />
          <br />
          <RoleInput roleType={"Distributor"} selectedRole={role} players={game?.players} onRoleUpdate={onRoleUpdate} />
          <br />
          <RoleInput roleType={"Brewer"} selectedRole={role} players={game?.players} onRoleUpdate={onRoleUpdate} />
          <br />
          <br />
          <button>Submit</button>
        </form>
      </div>

      {!!game && game.players.length > 0 &&
        <div style={HalfWidth}>
          <h3 style={{ marginBottom: "4pt" }}>Current Players</h3>
          <ul>
            {game.players
              .map(p =>
                <li key={p.id}>
                  {!!game && game.players.length === numberOfRoles &&
                    <span>
                      <Link key={`link-${p.id}`} to={`/Play/${gameId}/${p.id}`}>
                        {p.playerName} is the {p.role}
                      </Link>
                    </span>
                  }
                  {(!game || game.players.length < numberOfRoles) &&
                    <span>
                      {p.playerName} is the {p.role}
                    </span>
                  }

                  <span onClick={e => onRemovePlayer(e, p.id)}>&nbsp; [x]</span>
                </li>
              )}
          </ul>
          {!!game && game.players.length === numberOfRoles &&
            <div>
              <br />
              <h3 style={{ color: "green" }}>Let's play!</h3>
            </div>
          }
        </div>
      }
    </div >
  )
}

export const RoleInput = (props) => {
  const { roleType, selectedRole, players, onRoleUpdate } = props;

  if (!players) {
    return;
  }

  const id = `role-${roleType}`;
  const roleTaken = players.some(p => p.role === roleType);
  const selected = selectedRole === roleType && !roleTaken;

  return (
    <>
      <input
        id={id}
        name="role"
        type="radio"
        radioGroup="roles"
        checked={selected}
        value={selected}
        disabled={roleTaken}
        onChange={_ => onRoleUpdate(roleType)}
      />
      <label htmlFor={id}>{roleType}</label>
    </>
  )
}
