import multer from 'multer'
import express from 'express';
import { getCurrentUserId } from '../utils/index.ts';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number|null;
      };
    }
  }
}


const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const upload = multer({ storage });

export async function getUser (req: express.Request, res: express.Response, next: express.NextFunction) {
  const userId = await getCurrentUserId(req);
  req.user = {id: userId};
  next();
}