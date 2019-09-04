const express = require('express');
const userDb = require('./userDb');

const router = express.Router();

router.route('/').get((req, res) => {
  (async () => {
    try {
      const users = await userDb.get();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'The server could not retrieve users.' });
    }
  })();
});

router.post('/', (req, res) => {});

router.post('/:id/posts', (req, res) => {});

router.get('/:id', (req, res) => {});

router.get('/:id/posts', (req, res) => {});

router.delete('/:id', (req, res) => {});

router.put('/:id', (req, res) => {});

// custom middleware

function validateUserId(req, res, next) {}

function validateUser(req, res, next) {}

function validatePost(req, res, next) {}

module.exports = router;
