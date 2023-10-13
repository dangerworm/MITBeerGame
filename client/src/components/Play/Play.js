import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { useGameSetupDataContext } from '../Contexts/GameSetupDataContext';
import { useGameplayDataContext } from '../Contexts/GameplayDataContext';

import AppPage from '../AppPage/AppPage';
import { Status } from './Status';

import { convertRoleIdToString } from '../Helpers/Helpers';

const createOrderEndpoint = 'Gameplay/CreateOrder';

export const PlayView = (props) => {
  const { gameId, teamId, playerId } = useParams();
  const { startGame } = useGameplayDataContext();

  useEffect(() => {
    startGame(gameId, playerId);
  }, [startGame, gameId, playerId]);

  return (
    <AppPage>
      <Play
        gameId={gameId}
        teamId={teamId}
        playerId={playerId}
      />
    </AppPage >
  );
}

export const Play = (props) => {
  const { gameId, teamId, playerId } = props;

  const { games, getGameById, getPlayerById } = useGameSetupDataContext();
  const { gameTimes, events } = useGameplayDataContext();

  const [lastEvent, setLastEvent] = useState(undefined);
  const [orderAmount, setOrderAmount] = useState(0);
  const [waitingForPlayers, setWaitingForPlayers] = useState(undefined);
  const [gameEvents, setGameEvents] = useState(undefined);
  const [roundNumber, setRoundNumber] = useState(undefined);
  const [timeRemaining, setTimeRemaining] = useState(undefined);

  const game = useMemo(() =>
    getGameById(gameId)
    , [gameId, getGameById])

  const player = useMemo(() =>
    getPlayerById(playerId)
    , [playerId, getPlayerById]);

  const createOrder = useCallback(() => {
    fetch(HostName + createOrderEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, teamId, playerId, orderAmount: parseInt(orderAmount) })
    });
  }, [gameId, teamId, playerId, orderAmount]);

  useEffect(() => {
    var thisGame = games.filter(g => g.id === gameId);

    if (thisGame && thisGame.length === 1) {
      setWaitingForPlayers(!thisGame[0].isStarted);
    }

  }, [games, gameId, setWaitingForPlayers])

  const refreshEvents = useCallback(() => {
    if (!events || events.length === 0) {
      return;
    }

    const newGameEvents = events
      .filter(e => e.gameId === game.id &&
        e.roleType === player.roleType);

    newGameEvents.sort((a, b) => a.roundNumber < b.roundNumber ? -1 : 1);

    setGameEvents(newGameEvents);

    const newLastEvent = newGameEvents[newGameEvents.length - 1];
    if (!lastEvent || newLastEvent.id === lastEvent.id) {
      return;
    }

    setLastEvent(newLastEvent);
  }, [events, setGameEvents, lastEvent, setLastEvent])

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameTimes || gameTimes.length === 0) {
        return;
      }

      const time = gameTimes.filter(gt => gt.gameId === gameId);
      if (!time || time.length !== 1) {
        return;
      }

      setRoundNumber(time[0].roundNumber)
      setTimeRemaining(time[0].timeRemainingString);
    }, 500);

    return () => clearInterval(interval);
  }, [gameTimes, gameId, setTimeRemaining]);

  return (
    <div>
      <Link to={`/Players/${gameId}`}>
        <h4>&laquo; Back to Players</h4>
      </Link>

      {waitingForPlayers &&
        <div>
          <h2>{game.name}</h2>
          <h3 style={{ color: "green" }}>Waiting for players...</h3>
        </div>
      }
      {!waitingForPlayers &&
        <>
          <div>
            {game && player && (
              <h3>
                {game.name} |
                &nbsp;{player.playerName} ({convertRoleIdToString(player.roleType)}) |
                &nbsp;Round {roundNumber}
                {timeRemaining && ` | ${timeRemaining} remaining`}
              </h3>
            )}
            {gameEvents && gameEvents.length > 0 && (
              <Status type={'current'} event={{...gameEvents[gameEvents.length - 1], orderAmount}} />
            )}
            <br />
            <form onSubmit={onSubmitOrder}>
              <label htmlFor="order">Next Order:</label>
              <br />
              <input id="nextOrder" name="nextOrder" value={orderAmount} onChange={onOrderUpdate} />
              <br />
              <br />
              <button>Submit</button>
            </form>
          </div>

          <br />
          <hr />

          <div>
            <h3 style={{ marginBottom: "4pt" }}>Event History</h3>
            {gameEvents && gameEvents.map((event, index) =>
              event.roundNumber > 0 && (
                <div key={event.id}>
                  <p><b>Round {event.roundNumber}</b></p>
                  {!!event.description && event.orderAmount === 0 ?
                    (
                      <span key={event.id}>
                        <em>{event.description}</em>
                      </span>
                    ) :
                    <Status type={'historic'} event={{...event, orderAmount}} />
                  }
                </div>
              )
            )}
          </div>
        </>
      }
    </div>
  )
}