import React, { useState } from 'react';

const ChatInput = (props) => {
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();

    const isUserProvided = user && user !== '';
    const isMessageProvided = message && message !== '';
  
    if (isUserProvided && isMessageProvided) {
      props.sendMessage(user, message);
    }
    else {
      alert('Please insert a user and a message');
    }
  }

  const onUserUpdate = (event) => {
    setUser(event.target.value);
  }

  const onMessageUpdate = (event) => {
    setMessage(event.target.value);
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor={user}>User:</label>
      <br/>
      <input id="user" name="user" value={user} onChange={onUserUpdate} />
      <br/>
      <label htmlFor='message'>Message:</label>
      <br/>
      <input type="text" id="message" name="message" value={message} onChange={onMessageUpdate} />
      <br/>
      <br/>
      <button>Submit</button>
    </form>
  )
}

export default ChatInput;