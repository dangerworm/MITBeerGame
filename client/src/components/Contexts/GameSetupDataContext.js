import { createContext, useState, useEffect, useContext } from "react";
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import { HostName, GetHeaders, UpdateGames, UpdateTeams } from '../../Constants'

const getGamesEndpoint = 'GameSetup/GetGames';

export const GameSetupDataContext = createContext(undefined);

export const GameSetupDataContextProvider = (props) => {
  const { children } = props;

  const [connection, setConnection] = useState(null);
  const [games, setGames] = useState([]);

  const createConnection = () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(HostName + 'gameSetupHub')
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);
  }

  useEffect(() => {
    if (!!connection && connection.state !== HubConnectionState.Connected) {
      connection.start()
        .then(_ => {
          console.log("Connected!");

          connection.on(UpdateGames, data => {
            setGames(data);
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [connection])

  const getGames = () => {
    fetch(HostName + getGamesEndpoint, GetHeaders)
      .then(response => response
        .json()
        .then(data => setGames(data)));
  };

  useEffect(() => {
    createConnection(HostName);
    getGames();
  }, []);

  const getGameById = (gameId) => {
    if (games.length === 0) return undefined;

    const game = games.filter(g => g.id === gameId);
    if (!game || game.length !== 1) return undefined;

    return game[0];
  };

  const getPlayerById = (playerId) => {
    if (games.length === 0) return undefined;

    const team = games.filter(t => t.players.some(p => p.id === playerId));
    if (!team || team.length !== 1) return undefined;

    const player = team[0].players.filter(p => p.id === playerId);
    return player[0];
  };

  return (
    <GameSetupDataContext.Provider
      value={{
        games,
        getGameById,
        getPlayerById
      }}
    >
      {children}
    </GameSetupDataContext.Provider>
  )
}

export const useGameSetupDataContext = () => {
  const context = useContext(GameSetupDataContext);
  if (context) return context;
}