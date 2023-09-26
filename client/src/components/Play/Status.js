import React, { useMemo } from 'react';

export const Status = (props) => {
  const { event } = props;
  const { onBackOrder, inTransit, stockLevel, totalIn, totalOut } = event;

  const maxTransit = useMemo(() =>
    Math.max(...Object.keys(inTransit).map(key => parseInt(key)))
    , [inTransit]);

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
          <td style={{ textAlign: "center" }}>{totalIn}</td>
          <td style={{ textAlign: "center" }}>{totalOut}</td>
          <td style={{ textAlign: "center" }}>{onBackOrder}</td>
          <td style={{ textAlign: "center" }}>{stockLevel}</td>
          <td style={{ textAlign: "center" }}>{inTransit[maxTransit]}</td>
        </tr>
      </tbody>
    </table>
  );
}