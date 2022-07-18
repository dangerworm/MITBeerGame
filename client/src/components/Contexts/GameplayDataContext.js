import { createContext, useState, useEffect, useContext } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, HostName, UpdateRoundNumber, UpdateEvents } from '../../Constants'

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
    if (!!connection && connection.state !== Connected) {
      connection.start()
        .then(_ => {
          console.log("Connected!");

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

  return (
    <GameplayDataContext.Provider
      value={{
        roundNumber,
        events,
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