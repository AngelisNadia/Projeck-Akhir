import express from 'express';
import { getCategoriesCtrl } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', getCategoriesCtrl.handle);

export default router;