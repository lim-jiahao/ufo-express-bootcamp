import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
const FILENAME = 'data.json';

const getAllSightings = (req, res) => {
  read(FILENAME, (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }

    res.status(200).render('index', data);
  });
};

app.get('/', getAllSightings);

app.listen(3004);
