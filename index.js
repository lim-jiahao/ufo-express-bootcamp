import express from 'express';
import { read } from './jsonFileStorage.js';
import sightingRouter from './routes/sighting.js';

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
app.use('/sighting', sightingRouter);

app.listen(3004);
