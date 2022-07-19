import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { HalfWidth } from '../../Styles'
import { useGameSetupDataContext } from '../Contexts/GameSetupDataContext';
import { useGameplayDataContext } from '../Contexts/GameplayDataContext';

import AppPage from '../AppPage/AppPage';
import { Status } from './Status';

const getRoundNumberEndpoint = 'Gameplay/GetRoundNumber';
const getEventsEndpoint = 'Gameplay/GetEvents';

export const PlayView = (props) => {
  const { gameId, teamId, playerId } = useParams();
  const { getPlayerById } = useGameSetupDataContext();
  const { startGame, events } = useGameplayDataContext();

  useEffect(() => {
    startGame(gameId, playerId);
  }, [startGame, gameId, playerId]);

  return (
    <AppPage>
      <Play
        gameId={gameId}
        teamId={teamId}
        playerId={playerId}
        getPlayerById={getPlayerById}
        events={events}
      />
    </AppPage >
  );
}

export const Play = (props) => {
  const { gameId, teamId, playerId, getPlayerById, events } = props;

  const [lastEvent, setLastEvent] = useState(undefined);
  const [orderAmount, setOrderAmount] = useState(0);
  const [waitingForPlayers, setWaitingForPlayers] = useState(undefined);
  const [gameEvents, setGameEvents] = useState(undefined);

  const player = useMemo(() =>
    getPlayerById(playerId)
    , [playerId, getPlayerById]);

  const roundNumber = useMemo(() => {
    const roundNumbers = events.map(e => e.roundNumber);
    return Math.max(...roundNumbers);
  }, [events]);

  const createOrder = useCallback(() => {
    fetch(HostName + getEventsEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, teamId, playerId, orderAmount: parseInt(orderAmount) })
    });
  }, [gameId, teamId, playerId, orderAmount]);

  useEffect(() => {
    if (!events || events.length === 0) {
      return;
    }

    if (events.every(e => e.description && e.description.includes('waiting'))) {
      setWaitingForPlayers(true);
      return;
    }

    const newGameEvents = events.filter(e => !e.description || !e.description.includes('waiting'));
    newGameEvents.sort((a, b) => a.dateTime < b.dateTime ? -1 : 1);

    setGameEvents(newGameEvents);

    const newLastEvent = events[events.length - 1];
    if (!lastEvent || newLastEvent.id === lastEvent.id) {
      return;
    }

    setLastEvent(newLastEvent);
    createOrder();
  }, [events, lastEvent, setLastEvent, createOrder]);

  const onOrderUpdate = (event) => {
    setOrderAmount(event.target.value);
  }

  const onSubmitOrder = (event) => {
    event.preventDefault();

    const order = parseInt(orderAmount);
    const isOrderANumber = !isNaN(order);
    const isOrderAnInteger = order - Math.floor(parseFloat(orderAmount)) === 0;

    if (!!order && isOrderANumber && isOrderAnInteger && order >= 0) {
      createOrder();
    }
    else {
      alert('Please order a positive whole number of units');
    }
  }

  return (
    <div>
      <Link to={`/Players/${gameId}/${teamId}`}>
        <h4>&laquo; Back to Players</h4>
      </Link>

      {waitingForPlayers &&
        <div>
          <h3 style={{ color: "green" }}>Waiting for players...</h3>
        </div>
      }
      {!waitingForPlayers &&
        <>
          <div style={HalfWidth}>
            <h3>Round {roundNumber}</h3>
            <Status events={gameEvents} />
            <form onSubmit={onSubmitOrder}>
              <label htmlFor="order">Next Order:</label>
              <br />
              <input id="nextOrder" name="nextOrder" value={orderAmount} onChange={onOrderUpdate} />
              <br />
              <br />
              <button>Submit</button>
            </form>
          </div>

          <div style={HalfWidth}>
            <h3 style={{ marginBottom: "4pt" }}>Events</h3>
            {!!gameEvents && gameEvents.map((event, index) =>
              <div key={event.id}>
                <p><b>Event {gameEvents.length - index}</b></p>
                {!!event.description && event.orderAmount === 0 ?
                  (
                    <span key={event.id}>
                      <em>{event.description}</em>
                    </span>
                  ) :
                  <Status key={event.id} events={gameEvents.slice(0, index + 1)} />
                }
              </div>
            )}
          </div>
        </>
      }
    </div>
  )
}