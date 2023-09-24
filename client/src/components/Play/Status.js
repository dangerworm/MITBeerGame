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
    <table width="100%" border="1px solid black" >
      <thead>
        <tr>
          <th>Required</th>
          <th>Just Dispatched</th>
          <th>Stock Level</th>
          <th>Just Delivered</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ textAlign: "center" }}>{required}</td>
          <td style={{ textAlign: "center" }}>{justDispatched}</td>
          <td style={{ textAlign: "center" }}>{stockLevel}</td>
          <td style={{ textAlign: "center" }}>{justDelivered}</td>
        </tr>
      </tbody>
    </table>
  );
}