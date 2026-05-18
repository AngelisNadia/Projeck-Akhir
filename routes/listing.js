import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js'; 
import { 
  getAllListingsCtrl, 
  getListingDetailCtrl, 
  createListingCtrl, 
  updateListingCtrl,
  getProviderDashboardCtrl,
  getProviderStatsCtrl 
} from '../controllers/listingController.js'; 

const router = express.Router();

router.get('/provider/dashboard', authenticateToken, getProviderDashboardCtrl.handle);
router.get('/provider/stats', authenticateToken, getProviderStatsCtrl.handle);
router.post('/', authenticateToken, createListingCtrl.handle);
router.put('/:id', authenticateToken, updateListingCtrl.handle);

router.get('/', getAllListingsCtrl.handle);
router.get('/:id', getListingDetailCtrl.handle);

export default router;