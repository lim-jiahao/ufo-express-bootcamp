import express from 'express';
import { read } from '../jsonFileStorage.js';

const router = express.Router();
const FILENAME = 'data.json';

const getFavourites = (req, res) => {
  read(FILENAME, (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }

    let favIndexes = [];
    let sightings = data.sightings.map((sighting, index) => ({ ...sighting, index }));
    sightings = sightings.filter((el) => req.cookies.favourites?.includes(el.index));

    if (req.cookies.favourites) favIndexes = req.cookies.favourites;

    res.status(200).render('favourites', { sightings, favIndexes });
  });
};

const addToFavourites = (req, res) => {
  const { index } = req.query;

  let favIndexes = [];

  if (req.cookies.favourites) favIndexes = req.cookies.favourites;

  if (!favIndexes.includes(Number(index))) favIndexes.push(Number(index));
  else favIndexes = favIndexes.filter((el) => el !== Number(index));

  res.cookie('favourites', favIndexes);
  res.redirect('/');
};

router.get('/', getFavourites);
router.get('/add', addToFavourites);

export default router;
