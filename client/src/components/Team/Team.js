import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { useAppDataContext } from '../Contexts/AppDataContext';

import AppPage from '../AppPage/AppPage';

const createTeamEndpoint = 'Game/CreateTeam';

export const TeamView = (props) => {
  const { gameId } = useParams();
  const { setGameId, teams } = useAppDataContext();

  useEffect(() => {
    setGameId(gameId);
  }, [setGameId, gameId]);

  return (
    <AppPage>
      <Teams
        gameId={gameId}
        teams={teams}
      />
    </AppPage>
  );
}

export const Teams = (props) => {
  const { gameId, teams } = props;

  const [teamName, setTeamName] = useState([]);

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
      <h2>New Team</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor={teamName}>Name your team:</label>
        <br />
        <input id="teamName" name="teamName" value={teamName} onChange={onTeamNameUpdate} />
        <br />
        <br />
        <button>Submit</button>
      </form>

      {teams.length > 0 &&
        <div>
          <h2 style={{ marginBottom: "4pt" }}>Current Teams</h2>
          <ul>
            {teams.map(t =>
              <Link key={`link-${t.id}`} to={`/Team/${t.id}`}>
                <li key={t.id}>{t.name}</li>
              </Link>
            )}
          </ul>
        </div>
      }
    </div>
  )
}
