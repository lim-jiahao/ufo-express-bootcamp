import express from 'express';

const app = express();
const FILENAME = 'data.json';

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(3004);
