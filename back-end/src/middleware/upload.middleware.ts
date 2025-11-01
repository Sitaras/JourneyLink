import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configure multer for memory storage (files will be stored in memory as Buffer)
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images and PDFs
  const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WEBP images and PDF files are allowed.'));
  }
};

// Configure multer with size limits
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});
