import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, HostName, GetHeaders, UpdateGames, UpdateTeams, UpdateEvents } from '../../Constants'

const getGamesEndpoint = 'Game/GetGames';
const getTeamsEndpoint = 'Game/GetTeams';
const getEventsEndpoint = 'Game/GetEvents';

export const AppDataContext = createContext(undefined);

export const AppDataContextProvider = (props) => {
  const { children } = props;

  const [connection, setConnection] = useState(null);

  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);

  const createConnection = () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(HostName + 'gameHub')
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);
  }

  const getGames = useCallback(() => {
    fetch(HostName + getGamesEndpoint, GetHeaders)
      .then(response => response
        .json()
        .then(data => setGames(data)));
  }, []);

  const getTeams = useCallback(() => {
    fetch(HostName + getTeamsEndpoint, GetHeaders)
      .then(response => response
        .json()
        .then(data => setTeams(data)));
  }, []);

  const getEvents = useCallback(() => {
    fetch(HostName + getEventsEndpoint, GetHeaders)
      .then(response => response
        .json()
        .then(data => setEvents(data)));
  }, []);

  useEffect(() => {
    if (!!connection && connection.state !== Connected) {
      connection.start()
        .then(_ => {
          console.log("Connected!");

          connection.on(UpdateGames, data => {
            setGames(data);
          });

          connection.on(UpdateTeams, data => {
            setTeams(data);
          });

          connection.on(UpdateEvents, data => {
            setEvents(data);
          })
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [connection, setGames, setTeams])

  useEffect(() => {
    createConnection(HostName);
    getGames();
    getTeams();
    getEvents();
  }, [getGames, getTeams, getEvents]);

  const getGameById = (gameId) => {
    if (games.length === 0) return undefined;

    const game = games.filter(g => g.id === gameId);
    if (!game || game.length !== 1) return undefined;

    return game[0];
  };

  const getTeamsByGameId = (gameId) => {
    if (teams.length === 0) return [];

    const filteredTeams = teams.filter(t => t.gameId === gameId);
    if (!filteredTeams || filteredTeams.length === 0) return [];

    return filteredTeams;
  };

  const getTeamById = (teamId) => {
    if (teams.length === 0) return undefined;

    const team = teams.filter(t => t.id === teamId);
    if (!team || team.length !== 1) return undefined;

    return team[0];
  };

  const getPlayerById = (playerId) => {
    if (teams.length === 0) return undefined;

    const team = teams.filter(t => t.players.some(p => p.id === playerId));
    if (!team || team.length !== 1) return undefined;

    const player = team[0].players.filter(p => p.id === playerId);
    return player[0];
  };

  return (
    <AppDataContext.Provider
      value={{
        games,
        teams,
        events,
        getGameById,
        getTeamsByGameId,
        getTeamById,
        getPlayerById,
        getEvents
      }}
    >
      {children}
    </AppDataContext.Provider>
  )
}

export const useAppDataContext = () => {
  const context = useContext(AppDataContext);
  if (context) return context;
}