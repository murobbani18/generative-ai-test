import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import {
  chatHandler,
  generateTextHandler,
  generateFromImageHandler,
  generateFromDocumentHandler,
  generateFromAudioHandler
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', upload.single('file'), chatHandler);
router.post('/generate-text', generateTextHandler);
router.post('/generate-from-image', upload.single('image'), generateFromImageHandler);
router.post('/generate-from-document', upload.single('document'), generateFromDocumentHandler);
router.post('/generate-from-audio', upload.single('audio'), generateFromAudioHandler);

export default router;
