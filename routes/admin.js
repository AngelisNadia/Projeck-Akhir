import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  getAdminListingsCtrl, 
  updateListingStatusCtrl, 
  getAdminStatsCtrl,
  createCategoryCtrl,    
  updateCategoryCtrl,   
  deleteCategoryCtrl     
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/listings', authenticateToken, getAdminListingsCtrl.handle);
router.patch('/listings/:id', authenticateToken, updateListingStatusCtrl.handle);
router.get('/stats', authenticateToken, getAdminStatsCtrl.handle);
router.post('/categories', authenticateToken, createCategoryCtrl.handle);
router.put('/categories/:id', authenticateToken, updateCategoryCtrl.handle);
router.delete('/categories/:id', authenticateToken, deleteCategoryCtrl.handle);

export default router;