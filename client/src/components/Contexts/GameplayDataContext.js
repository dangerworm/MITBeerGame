import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import { HostName, StartGame, RoundLengthSeconds, UpdateRoundNumber, UpdateHistory, PostHeaders } from '../../Constants'

const getHistoryEndpoint = 'Gameplay/GetHistory';

export const GameplayDataContext = createContext(undefined);

export const GameplayDataContextProvider = (props) => {
  const { children } = props;

  const [connection, setConnection] = useState(undefined);
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

          connection.on(UpdateRoundNumber, data => {
            setRoundNumber(data);
          })

          connection.on(UpdateHistory, data => {
            setEvents(data);
          })

          connection.on(StartGame, data => {
            setEvents(data);
          })
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

  const getHistory = (gameId, playerId) => {
    fetch(HostName + getHistoryEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, playerId })
    })
      .then(response => response
        .json()
        .then(data => setEvents(data)));
  };

  useEffect(() => {
    createConnection(HostName);
  }, []);

  return (
    <GameplayDataContext.Provider
      value={{
        startGame,
        getHistory,
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