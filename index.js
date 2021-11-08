import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { read } from './jsonFileStorage.js';
import sightingRouter from './routes/sighting.js';
import favouritesRouter from './routes/favourites.js';

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(cookieParser());
const FILENAME = 'data.json';

const capitalise = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

const getAllSightings = (req, res) => {
  read(FILENAME, (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }

    let favIndexes = [];
    if (req.cookies.favourites) favIndexes = req.cookies.favourites;

    let sightings = data.sightings.map((sighting, index) => ({ ...sighting, index }));
    const shapes = [...new Set(sightings.map((sighting) => capitalise(sighting.shape)))];
    shapes.sort((a, b) => a.localeCompare(b));
    const { shape } = req.query;
    if (shape) sightings = sightings.filter((sighting) => capitalise(sighting.shape) === shape);
    res.status(200).render('index', { sightings, shapes, favIndexes });
  });
};

app.get('/', getAllSightings);
app.use('/sighting', sightingRouter);
app.use('/favourites', favouritesRouter);

app.listen(3004);
