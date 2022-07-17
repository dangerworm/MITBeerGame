import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import { HostName, PostHeaders } from '../../Constants'
import { HalfWidth } from '../../Styles'
import { useGameSetupDataContext } from '../Contexts/GameSetupDataContext';

import AppPage from '../AppPage/AppPage';
import { Status } from './Status';

const createOrderEndpoint = 'GameSetup/CreateOrder';

export const PlayView = (props) => {
  const { gameId, teamId, playerId } = useParams();
  const { getPlayerById, getEvents } = useGameSetupDataContext();

  return (
    <AppPage>
      <Play
        gameId={gameId}
        teamId={teamId}
        playerId={playerId}
        getPlayerById={getPlayerById}
        getEvents={getEvents}
      />
    </AppPage>
  );
}

export const Play = (props) => {
  const { gameId, teamId, playerId, getPlayerById, events } = props;

  const [ lastEvent, setLastEvent ] = useState({});
  const [ orderAmount, setOrderAmount ] = useState(0);

  const player = useMemo(() => 
    getPlayerById(playerId)
  , [playerId, getPlayerById]);

  const onOrderUpdate = (event) => {
    setOrderAmount(event.target.value);
  }

  const submitOrder = useCallback(async () => {
    await fetch(HostName + createOrderEndpoint, {
      ...PostHeaders,
      body: JSON.stringify({ gameId, teamId, playerId, orderAmount: parseInt(orderAmount) })
    });
  }, [gameId, teamId, playerId, orderAmount])

  useEffect(() => {
    if (!events || events.length === 0) {
      return;
    }

    const newLastEvent = events[events.length - 1];
    if (!lastEvent || newLastEvent.id === lastEvent.id) {
      return;
    }

    setLastEvent(newLastEvent);
    submitOrder();
  }, [events, lastEvent, setLastEvent, submitOrder])

  const onSubmitOrder = (event) => {
    event.preventDefault();

    const order = parseInt(orderAmount);
    const isOrderANumber = !isNaN(order);
    const isOrderAnInteger = order - Math.floor(parseFloat(orderAmount)) === 0;

    if (!!order && isOrderANumber && isOrderAnInteger && order >= 0) {
      submitOrder();
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

      <div style={HalfWidth}>
        <h3>Current Status</h3>
        <Status events={events} />
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
        {!!events && events.map((event, index) =>
          <Status events={events.slice(0, index + 1)} />
        )}
      </div>
    </div >
  )
}