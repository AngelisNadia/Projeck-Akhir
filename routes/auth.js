const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/verify-email/:token', authController.verifyEmail);

router.get('/all', authController.getProviders);

router.put('/update/:id', authController.updateProvider);

router.delete('/delete/:id', authController.deleteProvider);

module.exports = router;