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
        res
          .status(500)
          .json({ error: 'Error occurred while retrieving post.' });
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
        res
          .status(500)
          .json({ error: 'Error occurred while validating user.' });
      }
    })();
  } else {
    res
      .status(400)
      .json({ error: 'Text or user id required for updating post.' });
  }
};

router.use(express.json());

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

router
  .route('/:id')
  .all(validatePostId)
  .get((req, res) => {
    res.status(200).json(req.post);
  })
  .delete((req, res) => {
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
        res.status(500).json({ error: 'Error occured while deleting post.' });
      }
    })();
  })
  .put(validatePost, (req, res) => {
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
        res.status(500).json({ error: 'Error occured while updating post.' });
      }
    })();
  });

module.exports = router;
