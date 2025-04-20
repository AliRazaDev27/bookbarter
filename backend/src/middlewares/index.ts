import multer from 'multer'
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const upload = multer({ storage });

const { JWT_SECRET } = process.env;

function generateToken() {
  return jwt.sign({ type: 'admin' }, JWT_SECRET as string, { expiresIn: '1h' });
}

interface JwtPayload {
  type: string,
}

function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const adminToken = req.cookies['admin-token']
    if (!adminToken) throw new Error("Please login as Admin first");
    const decoded = jwt.verify(adminToken, JWT_SECRET as string) as JwtPayload;
    if (decoded.type !== 'admin') throw new Error("Unauthorized");
    next();
  } catch (error: any) {
    res.json({ success: false, message: error.message || "Internal server error" });
  }
}

export { generateToken, verifyAdmin };