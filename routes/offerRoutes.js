// Sub-routes for /aircraft/:id/offers
// /aircraft/:id/offers is implied
// req.params.id is always defined

const express = require('express');
const controller = require('../controllers/offerController');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');

const router = express.Router({mergeParams: true});

// List - GET /aircraft/:id/offers
router.get('/', controller.list);

// Create - POST /aircraft/:id/offers
router.post('/', controller.create);

// Accept - PUT? /aircraft/:id/offers/:offerId/accept
router.put('/:offerId/accept', controller.accept);

module.exports = router;