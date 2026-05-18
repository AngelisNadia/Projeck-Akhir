import express from 'express';
import { 
  registerCtrl, 
  loginCtrl, 
  logoutCtrl, 
  verifyEmailCtrl 
} from '../controllers/authController.js'; 
import { 
  getProvidersCtrl, 
  updateProviderCtrl, 
  deleteProviderCtrl 
} from '../controllers/providerController.js'; 

const router = express.Router();

router.post('/register', registerCtrl.handle);
router.post('/login', loginCtrl.handle);
router.post('/logout', logoutCtrl.handle);
router.get('/verify-email/:token', verifyEmailCtrl.handle);

router.get('/all', getProvidersCtrl.handle);
router.put('/update/:id', updateProviderCtrl.handle);
router.delete('/delete/:id', deleteProviderCtrl.handle);

export default router;