import express, { Request, Response, NextFunction } from 'express';
import apiRouter from './api/apiRouter';

const server = express();

const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'host'
    )}`
  );
  next();
};

server.use(logger);
server.use('/api', apiRouter);

export default server;
