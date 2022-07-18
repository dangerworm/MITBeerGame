import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { HalfWidth } from '../../Styles'
import { useGameSetupDataContext } from '../Contexts/GameSetupDataContext';

import AppPage from '../AppPage/AppPage';

const createPlayerEndpoint = 'GameSetup/CreatePlayer';
const deletePlayerEndpoint = 'GameSetup/DeletePlayer';
const startGameEndpoint = 'Gameplay/StartGame';

export const PlayersView = (props) => {
  const { gameId, teamId } = useParams();
  const { getTeamById } = useGameSetupDataContext();

  return (
    <AppPage>
      <Players
        gameId={gameId}
        teamId={teamId}
        getTeamById={getTeamById}
      />
    </AppPage>
  );
}

export const Players = (props) => {
  const { gameId, teamId, getTeamById } = props;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const team = useMemo(() => {
    return getTeamById(teamId)
  }, [teamId, getTeamById]);

  const onNameUpdate = (event) => {
    setName(event.target.value);
  }

  const onRoleUpdate = (newRole) => {
    setRole(newRole);
  }

  const createPlayer = async () => {
    await fetch(HostName + createPlayerEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ teamId: team.id, playerName: name, playerRole: role })
    });
  }

  const deletePlayer = async (playerId) => {
    await fetch(HostName + deletePlayerEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ teamId, playerId })
    });
  }

  const startGame = async () => {
    await fetch(HostName + startGameEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId })
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

  const onRemovePlayer = (event, playerId) => {
    event.preventDefault();
    deletePlayer(playerId);
  }

  return (
    <div>
      {!!team &&
        <h2>{team.name}</h2>
      }
      <Link to={`/Teams/${gameId}`}>
        <h4>&laquo; Back to Teams</h4>
      </Link>
      <div style={HalfWidth}>
        <h3 style={{ marginBottom: "4pt" }}>New Player</h3>
        <form onSubmit={onAddPlayer}>
          <label htmlFor="name">Name:</label>
          <br />
          <input id="name" name="name" value={name} onChange={onNameUpdate} />
          <br />
          <label htmlFor="teamName">Team:</label>
          <br />
          <input readOnly id="teamName" name="teamName" value={team?.name} />
          <br />
          <label htmlFor="role">Role:</label>
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
      </div>

      {!!team && team.players.length > 0 &&
        <div style={HalfWidth}>
          <h3 style={{ marginBottom: "4pt" }}>Current Players</h3>
          <ul>
            {team.players.map(p =>
              <li key={p.id}>
                {!!team && team.players.length === 4 &&
                  <span>
                    <Link key={`link-${p.id}`} to={`/Play/${gameId}/${teamId}/${p.id}`}>
                      {p.playerName} is the {p.role}
                    </Link>
                  </span>
                }
                {(!team || team.players.length < 4) &&
                  <span>
                    {p.playerName} is the {p.role}
                  </span>
                }

                <span onClick={e => onRemovePlayer(e, p.id)}>&nbsp; [x]</span>
              </li>
            )}
          </ul>
          {!!team && team.players.length === 4 &&
            <div>
              <br />
              <h3 style={{ color: "green" }} onClick={startGame}>Let's play!</h3>
            </div>
          }
        </div>
      }
    </div >
  )
}
