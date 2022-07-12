import React from "react";
import { Link } from "react-router-dom";

const AppPage = (props) => {
  const { children } = props;

  return (
    <div style={{ margin: "0 25%" }}>
      <Link to='/'>
        <h1>MIT Beer Game</h1>
      </Link>
      {children}
    </div>
  );
}

export default AppPage;
