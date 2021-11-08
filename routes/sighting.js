import express from 'express';
import moment from 'moment';
import { read, write, add } from '../jsonFileStorage.js';

const router = express.Router();
const FILENAME = 'data.json';

const getSightingByIndex = (req, res) => {
  read(FILENAME, (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }

    const { index } = req.params;
    const sighting = data.sightings[index];
    if (!sighting) {
      res.status(404).send('Sorry, no such index found!');
      return;
    }

    const isFav = req.cookies.favourites?.includes(Number(index));
    sighting.date_time = moment(sighting.date_time).format('dddd, MMMM Do, YYYY, hh:mma');
    if (sighting.created) sighting.created = moment(sighting.created).fromNow();
    res.status(200).render('sighting', { sighting, index, isFav });
  });
};

const createNewSighting = (req, res) => {
  req.body.created = new Date();
  req.body.shape = req.body.shape.trim();
  add(FILENAME, 'sightings', req.body, (err) => {
    if (err) {
      console.error('Read error', err);
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

const getEditForm = (req, res) => {
  read('data.json', (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }
    const { index } = req.params;
    const sighting = data.sightings[index];
    if (!sighting) {
      res.status(404).send('Sorry, no such index found!');
      return;
    }
    const editData = { ...sighting, index };
    res.render('edit-sighting-form', editData);
  });
};

const editSighting = (req, res) => {
  const { index } = req.params;
  read('data.json', (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }

    req.body.created = data.sightings[index].created;
    req.body.shape = req.body.shape.trim();
    data.sightings[index] = req.body;
    write('data.json', data, (error) => {
      if (error) {
        console.error('Edit error', error);
        res.status(500).send(error);
        return;
      }
      res.redirect(`/sighting/${index}`);
    });
  });
};

const deleteSighting = (req, res) => {
  const { index } = req.params;
  read('data.json', (err, data) => {
    if (err) {
      console.error('Read error', err);
      res.status(500).send(err);
      return;
    }

    data.sightings.splice(index, 1);
    let favIndexes = req.cookies.favourites;
    if (favIndexes) {
      favIndexes = favIndexes.filter((el) => el !== Number(index))
        .map((el) => (el > index ? el - 1 : el));
    }
    res.cookie('favourites', favIndexes);

    write('data.json', data, (error) => {
      if (error) {
        console.error('Edit error', error);
        res.status(500).send(error);
        return;
      }
      res.render('delete');
    });
  });
};

router.get('/:index', getSightingByIndex);

router
  .route('/')
  .get((req, res) => { res.render('new-sighting-form', { moment }); })
  .post(createNewSighting);

router
  .route('/:index/edit')
  .get(getEditForm)
  .put(editSighting);

router.delete('/:index/delete', deleteSighting);

export default router;
