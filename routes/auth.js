const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const providerController = require('../controllers/provider.controller'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);

router.get('/all', providerController.getProviders);
router.put('/update/:id', providerController.updateProvider);
router.delete('/delete/:id', providerController.deleteProvider);

module.exports = router;