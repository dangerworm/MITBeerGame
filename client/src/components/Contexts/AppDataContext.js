import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, HostName, GetHeaders, UpdateGames, UpdateTeams, UpdatePlayers } from '../../Constants'

const getGamesEndpoint = 'Game/GetGames'
const getTeamsEndpoint = 'Game/GetTeams'
const getPlayersEndpoint = 'Game/GetPlayers'

export const AppDataContext = createContext(undefined);

export const AppDataContextProvider = (props) => {
  const { children } = props;

  const [connection, setConnection] = useState(null);

  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  const [gameId, setGameId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [playerId, setPlayerId] = useState('');

  const [game, setGame] = useState('');
  const [team, setTeam] = useState('');
  const [player, setPlayer] = useState('');


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
    if (!gameId) return;

    fetch(HostName + getTeamsEndpoint + `/${gameId}`, GetHeaders)
      .then(response => response
        .json()
        .then(data => setTeams(data)));
  }, [gameId]);

  const getPlayers = useCallback(() => {
    if (!teamId) return;

    fetch(HostName + getPlayersEndpoint + `/${teamId}`, GetHeaders)
      .then(response => response
        .json()
        .then(data => setPlayers(data)));
  }, [teamId]);

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

          connection.on(UpdatePlayers, data => {
            setPlayers(data.players);
          });
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
    getPlayers();
  }, [getGames, getTeams, getPlayers]);

  useEffect(() => {
    if (games.length === 0 || !gameId) return;

    const currentGame = games.filter(g => g.id === gameId);
    if (!currentGame || currentGame.length !== 1) return;

    setGame(currentGame[0]);
  }, [games, gameId])

  useEffect(() => {
    if (teams.length === 0 || !teamId) return;

    const currentTeam = teams.filter(g => g.id === teamId);
    if (!currentTeam || currentTeam.length !== 1) return;

    setTeam(currentTeam[0]);
  }, [teams, teamId])

  return (
    <AppDataContext.Provider
      value={{
        games,
        teams,
        players,
        setGameId,
        setTeamId,
        setPlayerId,
        game,
        team,
        player,
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