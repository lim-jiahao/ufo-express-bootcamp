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

const createNewSighting = (req, res) => {
  add(FILENAME, 'sightings', req.body, (err) => {
    if (err) {
      res.status(500).send('DB write error.');
      return;
    }

    read(FILENAME, (error, data) => {
      if (error) {
        console.error('Read error', error);
        res.status(500).send(error);
      }
      const index = data.sightings.length - 1;
      res.redirect(`/sighting/${index}`);
    });
  });
};

router.get('/:index', getSightingByIndex);

router
  .route('/')
  .get((req, res) => {
    res.render('new-sighting-form');
  })
  .post(createNewSighting);

export default router;
