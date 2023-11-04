import multer from 'multer';
import path from 'path';
import { Request } from 'express';


export const filterVoice = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
   
    if (
      file.mimetype === 'audio/mpeg' ||
      file.mimetype === 'audio/wav' ||
      file.mimetype ==='audio/mp3' 
     
    ) {

      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export const filterImage = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(null, false);
    }
    cb(null, true);
  },
});




