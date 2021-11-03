import express from 'express';
import { read, add } from '../jsonFileStorage.js';

const router = express.Router();
const FILENAME = 'data.json';

const getSightingByIndex = (req, res) => {
  read(FILENAME, (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }

    const sighting = data.sightings[req.params.index];
    if (!sighting) {
      res.status(404).send('Sorry, no such index found!');
      return;
    }

    res.status(200).render('sighting', { sighting });
  });
};

router.get('/:index', getSightingByIndex);

export default router;
