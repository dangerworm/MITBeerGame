import React, { useEffect, useState } from 'react';

export const Status = (props) => {
  const { playerRole, events } = props;

  const [required, setRequired] = useState(0);
  const [justDispatched, setJustDispatched] = useState(0);
  const [stockLevel, setStockLevel] = useState(0);
  const [justDelivered, setJustDelivered] = useState(0);

  useEffect(() => {
    if (!events || events.length === 0) {
      return;
    }
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