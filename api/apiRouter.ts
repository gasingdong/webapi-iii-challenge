import express from 'express';
import userRouter from './users/userRouter';
import postRouter from './posts/postRouter';

const router = express.Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);

export default router;
