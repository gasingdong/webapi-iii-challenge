const express = require('express');
const userDb = require('./userDb');

const router = express.Router();

const validateUser = (req, res, next) => {
  console.log(req);
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }
  const { name } = req.body;

  if (name) {
    (async () => {
      try {
        const users = await userDb.get();
        if (users.find(user => user.name === name)) {
          res.status(400).json({ error: 'Name already exists.' });
        } else {
          req.user = {
            name,
          };
          next();
        }
      } catch (err) {
        res
          .status(500)
          .json({ error: 'Error occurred while validating user.' });
      }
    })();
  } else {
    res.status(400).json({ error: 'All users require a unique name.' });
  }
};

router.use(express.json());

router
  .route('/')
  .get((req, res) => {
    (async () => {
      try {
        const users = await userDb.get();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ error: 'The server could not retrieve users.' });
      }
    })();
  })
  .post(validateUser, (req, res) => {
    (async () => {
      try {
        const user = await userDb.insert(req.user);
        res.status(200).json(user);
      } catch (err) {
        res
          .status(500)
          .json({ error: 'Error occurred while creating new user.' });
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

function validatePost(req, res, next) {}

module.exports = router;
