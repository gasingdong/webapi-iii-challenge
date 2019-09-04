const express = require('express');
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const router = express.Router();

router.use('/users', userRouter);
router.use('/posts', postRouter);

module.exports = router;
