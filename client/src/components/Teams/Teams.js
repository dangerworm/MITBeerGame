import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { HalfWidth } from '../../Styles';
import { useAppDataContext } from '../Contexts/AppDataContext';

import AppPage from '../AppPage/AppPage';

const createTeamEndpoint = 'Game/CreateTeam';

export const TeamsView = (props) => {
  const { gameId } = useParams();
  const { getGameById, getTeamsByGameId } = useAppDataContext();

  return (
    <AppPage>
      <Teams
        gameId={gameId}
        getGameById={getGameById}
        getTeamsByGameId={getTeamsByGameId}
      />
    </AppPage>
  );
}

export const Teams = (props) => {
  const { gameId, getGameById, getTeamsByGameId } = props;

  const [teamName, setTeamName] = useState([]);

  const game = useMemo(() =>
    getGameById(gameId)
    , [gameId, getGameById])

  const teams = useMemo(() =>
    getTeamsByGameId(gameId)
    , [gameId, getTeamsByGameId])

  const onTeamNameUpdate = (event) => {
    setTeamName(event.target.value);
  }

  const createTeam = async () => {
    await fetch(HostName + createTeamEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, teamName })
    });
  }

  const onSubmit = (event) => {
    event.preventDefault();

    if (teamName && teamName !== '') {
      createTeam();
    }
    else {
      alert('Please type a team name.');
    }
  }

  return (
    <div>
      <Link to={'/'}>
        <h2>{game?.name}</h2>
      </Link>
      <div style={HalfWidth}>
        <h3 style={{ marginBottom: "4pt" }}>New Team</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor={teamName}>Name your team:</label>
          <br />
          <input id="teamName" name="teamName" value={teamName} onChange={onTeamNameUpdate} />
          <br />
          <br />
          <button>Submit</button>
        </form>
      </div>

      {teams.length > 0 &&
        <div style={HalfWidth}>
          <h3 style={{ marginBottom: "4pt" }}>Current Teams</h3>
          <ul>
            {teams.map(t =>
              <li key={t.id}>
                <Link key={`link-${t.id}`} to={`/Players/${gameId}/${t.id}`}>
                  {t.name}
                </Link>
              </li>
            )}
          </ul>
        </div>
      }
    </div>
  )
}
