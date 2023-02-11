import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LongPolling() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = async () => {
    const eventSource = new EventSource('http://localhost:5000/connect');
    eventSource.onmessage = function (event) {
      const message = JSON.parse(event.data);
      console.log(message);
      setMessages((prev) => [message, ...prev]);
    };
  };

  const handleSend = async () => {
    axios.post('http://localhost:5000/new-message', {
      message: value,
      id: Date.now(),
    });
  };

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
              {mess.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
