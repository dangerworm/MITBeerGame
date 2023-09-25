import { createContext, useState, useEffect, useMemo, useContext, useCallback } from "react";
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import { HostName, StartGame, RoundLengthSeconds, UpdateRoundNumber, UpdateHistory, UpdateGameTimes } from '../../Constants'

export const GameplayDataContext = createContext(undefined);

export const GameplayDataContextProvider = (props) => {
  const { children } = props;

  const [connection, setConnection] = useState(undefined);
  const [events, setEvents] = useState(undefined);
  const [gameTimes, setGameTimes] = useState(undefined);
  const [roundNumber, setRoundNumber] = useState(undefined);

  const createConnection = () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(HostName + 'gameplayHub')
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);
  }

  useEffect(() => {
    if (!!connection && connection.state !== HubConnectionState.Connected) {
      connection.start()
        .then(_ => {
          console.log("Connected!");

          connection.on(UpdateHistory, data => {
            setEvents(data);
          });

          connection.on(UpdateGameTimes, data => {
            setGameTimes(data);
          });
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [connection]);

  const startGame = useCallback((gameId, playerId) => {
    if (!connection || connection.state !== HubConnectionState.Connected) {
      return;
    }

    connection.invoke(StartGame, gameId, playerId, RoundLengthSeconds);
  }, [connection])

  useEffect(() => {
    createConnection(HostName);
  }, []);

  return (
    <GameplayDataContext.Provider
      value={{
        startGame,
        gameTimes,
        events,
        roundNumber,
      }}
    >
      {children}
    </GameplayDataContext.Provider>
  )
}

export const useGameplayDataContext = () => {
  const context = useContext(GameplayDataContext);
  if (context) return context;
}