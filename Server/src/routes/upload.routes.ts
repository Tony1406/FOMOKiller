import { Router } from 'express';
import { createRequire } from 'module';
import { uploadImage } from '../controllers/upload.controller.js';

const require = createRequire(import.meta.url);
const multer = require('multer') as any;

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

router.post('/', upload.single('file'), uploadImage);

export default router;
