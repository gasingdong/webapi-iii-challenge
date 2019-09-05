import express, {
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import userDb from './userDb';
import postDB from '../posts/postDb';
import { User, Post } from '../../types/index';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    post?: Post;
  }
}

const router = express.Router();

const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }
  const { name } = req.body;

  if (name) {
    try {
      const users = (await userDb.get()) as User[];
      if (users.find((user: User) => user.name === name)) {
        res.status(400).json({ error: 'Name already exists.' });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json({ error: 'All users require a unique name.' });
  }
};

const validateUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || !Number.isFinite(id)) {
    res.status(400).json({ error: 'The id is not a valid number.' });
  } else {
    try {
      const user = (await userDb.getById(id)) as User;

      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ error: 'There is no user with that id.' });
      }
    } catch (err) {
      next(err);
    }
  }
};

const validatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }
  const { text } = req.body;
  if (text) {
    try {
      next();
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json({ error: 'All posts require text content.' });
  }
};

router.use(express.json());

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const users = await userDb.get();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  })
  .post(validateUser, async (req, res, next) => {
    try {
      const { name } = req.body;
      const user = await userDb.insert({
        name,
      });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id')
  .all(validateUserId)
  .get((req, res) => {
    res.status(200).json(req.user);
  })
  .delete(async (req, res, next) => {
    const { id } = req.user as User;
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
  })
  .put(validateUser, async (req, res, next) => {
    try {
      const { id } = req.user as User;
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
  });

router
  .route('/:id/posts')
  .all(validateUserId)
  .get(
    async (req, res, next): Promise<void> => {
      try {
        const { id } = req.user as User;
        const userPosts = await userDb.getUserPosts(id);
        res.status(200).json(userPosts);
      } catch (err) {
        next(err);
      }
    }
  )
  .post(validatePost, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const response = await postDB.insert({
        text,
        user_id: Number(id),
      });
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

const userErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(err);
  }
  console.log(err);
  res.status(500).json({ error: 'Error while processing user operation.' });
};

router.use(userErrorHandler);

export default router;
