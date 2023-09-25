import React, { useEffect, useState } from 'react';

export const Status = (props) => {
  const { event } = props;
  const { onBackOrder, ordered, stockLevel, totalIn, totalOut } = event;

  useEffect(() => {
    if (!event) {
      return;
    }
  }, [event]);

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
          <td style={{ textAlign: "center" }}>{ordered}</td>
        </tr>
      </tbody>
    </table>
  );
}