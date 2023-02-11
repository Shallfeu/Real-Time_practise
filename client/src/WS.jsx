import { useRef, useState } from 'react';
import axios from 'axios';

export default function WS() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');
  const socket = useRef();
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setConnected(true);
      const message = {
        id: Date.now(),
        date: '02.03.1989',
        username,
      };
      socket.current.send(JSON.stringify(message));
      console.log('Socket has been opened');
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [message, ...prev]);
    };

    socket.current.onclose = () => {
      console.log('Socket is closed');
    };

    socket.current.onerror = () => {
      console.log('Socket error');
    };
  }

  const handleSend = async () => {
    const message = {
      username,
      message: value,
      id: Date.now(),
      event: 'message',
    };

    socket.current.send(JSON.stringify(message));
    setValue('');
  };

  if (!connected) {
    return (
      <div className="container">
        <div className="content">
          <div className="form">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Your name"
            />
            <button onClick={connect}>Enter</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <div className="form">
          <input
            className="form__input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="form__button" type="button" onClick={handleSend}>
            Send
          </button>
        </div>
        <div className="messages">
          <h2>Messages:</h2>
          {messages.map((mess) => (
            <div key={mess.id} className="message">
              {mess.event === 'connection' ? (
                <div>User {mess.username} is connected</div>
              ) : (
                <div>
                  {mess.username} - {mess.message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
