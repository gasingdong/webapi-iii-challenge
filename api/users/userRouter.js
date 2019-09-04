const express = require('express');
const userDb = require('./userDb');
const postDB = require('../posts/postDb');

const router = express.Router();

const validateUser = (req, res, next) => {
  console.log('validating user');
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
          next();
        }
      } catch (err) {
        next(err);
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
        next(err);
      }
    })();
  }
};

const validatePost = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }
  // eslint-disable-next-line camelcase
  const { text } = req.body;

  // eslint-disable-next-line camelcase
  if (text) {
    (async () => {
      try {
        req.post = {
          text,
          user_id: req.user.id,
        };
        next();
      } catch (err) {
        next(err);
      }
    })();
  } else {
    res.status(400).json({ error: 'All posts require text content.' });
  }
};

router.use(express.json());

router
  .route('/')
  .get((req, res, next) => {
    (async () => {
      try {
        const users = await userDb.get();
        res.status(200).json(users);
      } catch (err) {
        next(err);
      }
    })();
  })
  .post(validateUser, (req, res, next) => {
    (async () => {
      try {
        const { name } = req.body;
        const user = await userDb.insert({
          name,
        });
        res.status(200).json(user);
      } catch (err) {
        next(err);
      }
    })();
  });

router
  .route('/:id')
  .all(validateUserId)
  .get((req, res) => {
    res.status(200).json(req.user);
  })
  .delete((req, res, next) => {
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
        next(err);
      }
    })();
  })
  .put(validateUser, (req, res, next) => {
    (async () => {
      try {
        const { id } = req.user;
        const { name } = req.body;
        const updated = await userDb.update(id, {
          name,
        });

        if (updated) {
          res.status(200).json({
            id,
            name,
          });
        } else {
          throw new Error();
        }
      } catch (err) {
        next(err);
      }
    })();
  });

router
  .route('/:id/posts')
  .all(validateUserId)
  .get((req, res, next) => {
    (async () => {
      try {
        const { id } = req.user;
        const userPosts = await userDb.getUserPosts(id);
        res.status(200).json(userPosts);
      } catch (err) {
        next(err);
      }
    })();
  })
  .post(validatePost, (req, res, next) => {
    (async () => {
      try {
        const response = await postDB.insert(req.post);
        res.status(200).json(response);
      } catch (err) {
        next(err);
      }
    })();
  });

const userErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  res.status(500).json({ error: 'Error while processing user operation.' });
};

router.use(userErrorHandler);

module.exports = router;
