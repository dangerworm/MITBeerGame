import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import { HostName, StartGame, RoundLengthSeconds, UpdateGameStates, UpdateRoundNumber, UpdateEvents } from '../../Constants'

export const GameplayDataContext = createContext(undefined);

export const GameplayDataContextProvider = (props) => {
  const { children } = props;

  const [connection, setConnection] = useState(undefined);
  const [gameStates, setGameStates] = useState(undefined);
  const [roundNumber, setRoundNumber] = useState(undefined);
  const [events, setEvents] = useState(undefined);

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

          connection.on(UpdateGameStates, data => {
            setGameStates(data);
          })

          connection.on(UpdateRoundNumber, data => {
            setRoundNumber(data);
          })

          connection.on(UpdateEvents, data => {
            setEvents(data);
          })
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [connection]);


  useEffect(() => {
    createConnection(HostName);
  }, []);

  const startGame = useCallback((gameId, playerId) => {
    if (!connection || connection.state !== HubConnectionState.Connected) {
      return;
    }

    connection.invoke(StartGame, gameId, playerId, RoundLengthSeconds)
      .then(data => setGameStates(data));
  }, [connection])

  return (
    <GameplayDataContext.Provider
      value={{
        startGame,
        gameStates,
        roundNumber,
        events
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