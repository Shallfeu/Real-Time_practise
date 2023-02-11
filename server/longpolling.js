const express = require('express');
const events = require('events');
const cors = require('cors');

const port = process.env.PORT || 5000;

const emitter = new events.EventEmitter();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/get-message', (req, res) => {
  emitter.once('newMessage', (message) => {
    res.json(message);
  });
});

app.post('/new-message', (req, res) => {
  const message = req.body;
  emitter.emit('newMessage', message);
  res.status(200);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
