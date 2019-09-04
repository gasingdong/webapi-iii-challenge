const express = require('express');
const userDb = require('./userDb');

const router = express.Router();

const validateUser = (req, res, next) => {
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

const validateUserId = (req, res, next) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || !Number.isFinite(id)) {
    res.status(400).json({ error: 'The id is not a valid number.' });
  } else {
    (async () => {
      try {
        const user = await userDb.getById(id);

        if (user) {
          req.user = user;
          next();
        } else {
          res.status(404).json({ error: 'There is no user with that id.' });
        }
      } catch (err) {
        res
          .status(500)
          .json({ error: 'Error occurred while retrieving user.' });
      }
    })();
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

router
  .route('/:id')
  .all(validateUserId)
  .get((req, res) => {
    res.status(200).json(req.user);
  })
  .delete((req, res) => {
    const { id } = req.user;
    (async () => {
      try {
        const deleted = await userDb.remove(id);

        if (deleted) {
          res.status(200).json(req.user);
        } else {
          throw new Error();
        }
      } catch (err) {
        res.status(500).json({ error: 'Error deleting user.' });
      }
    })();
  })
  .put((req, res) => {});

router.post('/:id/posts', (req, res) => {});

router.get('/:id/posts', (req, res) => {});

function validatePost(req, res, next) {}

module.exports = router;
