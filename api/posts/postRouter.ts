import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import postDb from './postDb';
import { Post } from '../../types';

const router = express.Router();

const validatePostId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || !Number.isFinite(id)) {
    res.status(400).json({ error: 'The id is not a valid number.' });
  } else {
    try {
      const post = (await postDb.getById(id)) as Post;

      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ error: 'There is no post with that id.' });
      }
    } catch (err) {
      next(err);
    }
  }
};

const validatePost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/camelcase
  const { text, user_id } = req.body;

  // eslint-disable-next-line @typescript-eslint/camelcase
  if (text || user_id) {
    next();
  } else {
    res
      .status(400)
      .json({ error: 'Text or user id required for updating post.' });
  }
};

router.use(express.json());

router.get('/', async (req, res, next) => {
  try {
    const posts = await postDb.get();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
});

router
  .route('/:id')
  .all(validatePostId)
  .get((req, res) => {
    res.status(200).json(req.post);
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.post as Post;
      const deleted = await postDb.remove(id);

      if (deleted) {
        res.status(200).json(req.post);
      } else {
        throw new Error();
      }
    } catch (err) {
      next(err);
    }
  })
  .put(validatePost, async (req, res, next) => {
    try {
      // eslint-disable-next-line @typescript-eslint/camelcase
      const { id, text, user_id } = req.post as Post;
      const { body } = req;
      const updatedPost = {
        text: body.text || text,
        // eslint-disable-next-line @typescript-eslint/camelcase
        user_id: body.user_id || user_id,
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
  });

const postErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(err);
  }
  console.log(err);
  res.status(500).json({ error: 'Error while processing post operation.' });
};

router.use(postErrorHandler);

export default router;
