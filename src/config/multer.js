import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

const getfilename = (req, file, cb) => {
  crypto.randomBytes(16, (err, res) => {
    if (err) return cb(err);
    return cb(null, res.toString('hex') + extname(file.originalname));
  });
};

export default {
  avatars: {
    storage: multer.diskStorage({
      destination: resolve(__dirname, '..', '..', 'tmp', 'uploads', 'avatars'),
      filename: getfilename,
    }),
  },
  signatures: {
    storage: multer.diskStorage({
      destination: resolve(
        __dirname,
        '..',
        '..',
        'tmp',
        'uploads',
        'signatures'
      ),
      filename: getfilename,
    }),
  },
};
