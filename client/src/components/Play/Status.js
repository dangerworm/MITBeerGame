import React, { useEffect, useState } from 'react';

export const Status = (props) => {
  const { events } = props;

  const [required, setRequired] = useState(0);
  const [justDispatched, setJustDispatched] = useState(0);
  const [stockLevel, setStockLevel] = useState(0);
  const [justDelivered, setJustDelivered] = useState(0);

  useEffect(() => {
    if (!events || events.length === 0) {
      return;
    }

    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];

    const totalRequired = events
      .map(e => e.required)
      .reduce((total, current) => total + current, 0);

    const totalDelivered = events
      .map(e => e.delivered)
      .reduce((total, current) => total + current, 0);

    const totalDispatched = events
      .map(e => e.dispatched)
      .reduce((total, current) => total + current, 0);

    setRequired(totalRequired - totalDispatched);
    setJustDispatched(lastEvent.dispatched);
    setStockLevel(firstEvent + totalDelivered - totalDispatched);
    setJustDelivered(lastEvent.delivered);
  }, [events]);

  return (
    <div>
      <p><strong>Required:</strong> {required}</p>
      <p><strong>Just Dispatched:</strong> {justDispatched}</p>
      <p><strong>Stock Level:</strong> {stockLevel}</p>
      <p><strong>Just Delivered:</strong> {justDelivered}</p>
    </div >
  );
}