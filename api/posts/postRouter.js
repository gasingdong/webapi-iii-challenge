const express = require('express');
const postDb = require('./postDb');

const router = express.Router();

const validatePostId = (req, res, next) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || !Number.isFinite(id)) {
    res.status(400).json({ error: 'The id is not a valid number.' });
  } else {
    (async () => {
      try {
        const post = await postDb.getById(id);

        if (post) {
          req.post = post;
          next();
        } else {
          res.status(404).json({ error: 'There is no post with that id.' });
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
  const { text, user_id } = req.body;

  // eslint-disable-next-line camelcase
  if (text || user_id) {
    (async () => {
      try {
        next();
      } catch (err) {
        next(err);
      }
    })();
  } else {
    res
      .status(400)
      .json({ error: 'Text or user id required for updating post.' });
  }
};

router.use(express.json());

router.get('/', (req, res, next) => {
  (async () => {
    try {
      const posts = await postDb.get();
      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  })();
});

router
  .route('/:id')
  .all(validatePostId)
  .get((req, res) => {
    res.status(200).json(req.post);
  })
  .delete((req, res, next) => {
    (async () => {
      try {
        const { id } = req.post;
        const deleted = await postDb.remove(id);

        if (deleted) {
          res.status(200).json(req.post);
        } else {
          throw new Error();
        }
      } catch (err) {
        next(err);
      }
    })();
  })
  .put(validatePost, (req, res, next) => {
    (async () => {
      try {
        const { id } = req.post;
        // eslint-disable-next-line camelcase
        const { text, user_id } = req.body;
        const updatedPost = {
          text: text || req.post.text,
          // eslint-disable-next-line camelcase
          user_id: user_id || req.post.user_id,
        };
        const updated = await postDb.update(id, updatedPost);

        if (updated) {
          res.status(200).json({
            ...updatedPost,
            id,
          });
        }
      } catch (err) {
        next(err);
      }
    })();
  });

const postErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  res.status(500).json({ error: 'Error while processing post operation.' });
};

router.use(postErrorHandler);

module.exports = router;
