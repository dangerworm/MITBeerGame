import React from 'react';

const Message = ({ user, message }) => {
  return (
  <div style={{ background: "#eee", borderRadius: '5px', padding: '0 10px' }}>
    <p><strong>{user}</strong> says:</p>
    <p>{message}</p>
  </div>
  );
}

export default Message;