import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  getAdminListingsCtrl, 
  updateListingStatusCtrl, 
  getAdminStatsCtrl 
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/listings', authenticateToken, getAdminListingsCtrl.handle);
router.patch('/listings/:id', authenticateToken, updateListingStatusCtrl.handle);
router.get('/stats', authenticateToken, getAdminStatsCtrl.handle);

export default router;