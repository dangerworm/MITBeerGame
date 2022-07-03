import React from 'react';

import Message from '../Message/Message';

const ChatWindow = ({ chat }) => {
  return (
    <div>
      {chat
        .map(m =>
          <Message
            key={Date.now() * Math.random()}
            user={m.user}
            message={m.message} />)}
    </div>
  )
}

export default ChatWindow;