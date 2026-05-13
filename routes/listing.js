const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing.controller');

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingDetail);

module.exports = router;