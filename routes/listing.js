const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing.controller');
const { authenticateToken } = require('../middleware/authMiddleware'); 

router.get('/provider/dashboard', authenticateToken, listingController.getProviderDashboard);
router.get('/provider/stats', authenticateToken, listingController.getProviderStats);
router.post('/', authenticateToken, listingController.createListing);
router.put('/:id', authenticateToken, listingController.updateListing);a
router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingDetail);

module.exports = router;