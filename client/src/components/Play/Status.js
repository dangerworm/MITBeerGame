import React, { useMemo } from 'react';

export const Status = (props) => {
  const { type, event } = props;
  const { onBackOrder, inTransit, stockLevel, lastDispatched, totalOut, orderAmount } = event;

  const minTransit = useMemo(() =>
    Math.min(...Object.keys(inTransit).map(key => parseInt(key)))
    , [inTransit]);

  const maxTransit = useMemo(() =>
    Math.max(...Object.keys(inTransit).map(key => parseInt(key)))
    , [inTransit]);

  const dispatched = useMemo(() =>
    type === 'historic'
      ? lastDispatched
      : totalOut
    , [type, totalOut, lastDispatched]);

  const ordered = useMemo(() =>
    type === 'historic'
      ? inTransit[maxTransit]
      : parseInt(orderAmount)
    , [type, inTransit, maxTransit, orderAmount]);

  return (
    <table width="100%" border="1px solid black" >
      <thead>
        <tr>
          <th>Received</th>
          <th>Dispatched</th>
          <th>Back Orders</th>
          <th>Stock Level</th>
          <th>Ordered</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ textAlign: "center" }}>{inTransit[minTransit]}</td>
          <td style={{ textAlign: "center" }}>{dispatched}</td>
          <td style={{ textAlign: "center" }}>{onBackOrder}</td>
          <td style={{ textAlign: "center" }}>{stockLevel}</td>
          <td style={{ textAlign: "center" }}>{ordered}</td>
        </tr>
      </tbody>
    </table>
  );
}