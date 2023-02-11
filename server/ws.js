const ws = require('ws');

const PORT = 5000;

const wss = new ws.Server(
  {
    port: PORT,
  },
  () => `Server running on port ${PORT}`,
);

wss.on('connection', function connection(ws) {
  ws.on('message', function (message) {
    message = JSON.parse(message);
    switch (message.event) {
      case 'message':
        broadcastMessage(message);
        break;

      case 'connection':
        broadcastMessage(message);
        break;
    }
  });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(message));
  });
}

// const message = {
//   event: 'message/connection',
//   id: 123,
//   date: '02.03.1989',
//   username: 'Uriy',
//   message: 'Like, bro',
// };
