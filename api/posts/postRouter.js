const express = require('express');
const postDb = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  (async () => {
    try {
      const posts = await postDb.get();
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ error: 'The server could not retrieve posts.' });
    }
  })();
});

router.get('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

router.put('/:id', (req, res) => {});

// custom middleware

function validatePostId(req, res, next) {}

module.exports = router;
