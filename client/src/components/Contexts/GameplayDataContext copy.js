import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';

import { Connected, HostName, GetHeaders, UpdateGames, UpdateTeams, UpdateEvents } from '../../Constants'

const getEventsEndpoint = 'Gameplay/GetEvents';

export const GameplayDataContext = createContext(undefined);

export const GameplayDataContextProvider = (props) => {
  const { children } = props;

  const [connection, setConnection] = useState(null);

  const [events, setEvents] = useState([]);

  const createConnection = () => {
    const hubConnection = new HubConnectionBuilder()
      .withUrl(HostName + 'gameHub')
      .withAutomaticReconnect()
      .build();

    setConnection(hubConnection);
  }

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

          connection.on(UpdateEvents, data => {
            setEvents(data);
          })
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [connection, setEvents])

  useEffect(() => {
    createConnection(HostName);
    getEvents();
  }, [getEvents]);

  return (
    <GameplayDataContext.Provider
      value={{
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