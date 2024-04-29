// Sub-routes for /aircraft/:id/offers
// /aircraft/:id/offers is implied
// req.params.id is always defined

const express = require('express');
const controller = require('../controllers/offerController');
const auth = require('../middleware/auth');
const {validateOfferCreate, handleValidationErrors} = require('../middleware/validator');

// mergeParams: true is required to access req.params.id in this router
const router = express.Router({mergeParams: true});

// List - GET /aircraft/:id/offers
router.get('/', auth.isLoggedIn, auth.isSeller, controller.list);

// Create - POST /aircraft/:id/offers
router.post('/', auth.isLoggedIn, auth.isNotSeller, validateOfferCreate, handleValidationErrors, controller.create);

// Accept - PUT? /aircraft/:id/offers/:offerId/accept
router.put('/:offerId/accept', auth.isLoggedIn, auth.isSeller, controller.accept);

module.exports = router;