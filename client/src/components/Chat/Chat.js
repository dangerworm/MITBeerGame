import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import ChatWindow from '../ChatWindow/ChatWindow';
import ChatInput from '../ChatInput/ChatInput';

import { Connected, ReceiveMessage, SendMessage } from '../../Constants';

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:5000/hubs/chat')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (!!connection && connection.state !== Connected) {
      connection.start()
        .then(_ => {
          console.log("Connected!");

          connection.on(ReceiveMessage, message => {
            setChat(chat => [...chat, message])
          });
        })
        .catch(e => {
          console.log('Connection failed: ', e)
        });
    }
  }, [connection, setChat]);

  const sendMessage = async(user, message) => {
    const chatMessage = {
      user: user,
      message: message
    };

    if (connection.state === Connected) {
      try {
        await connection.send(SendMessage, chatMessage);
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      alert ('No connection to server yet');
    }
  }

  return (
    <div>
      <ChatInput sendMessage={sendMessage} />
      <hr/>
      <ChatWindow chat={chat}/>
    </div>
  );
}

export default Chat;