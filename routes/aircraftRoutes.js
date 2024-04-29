const express = require('express');
const upload = require('multer')({dest: './public/images'});
const controller = require('../controllers/aircraftController');
const offerRoutes = require('./offerRoutes');
const auth = require('../middleware/auth');
const {validateId, validateAircraftCreate, handleValidationErrors, validateAircraftUpdate} = require('../middleware/validator');
const {isPubliclyVisible} = require("../middleware/auth");

const router = express.Router();

// Sub-routes for /aircraft

// Index - GET /aircraft
router.get('/', controller.index);

// New - GET /aircraft/new
router.get('/new', auth.isLoggedIn, controller.new);

// Create - POST /aircraft
router.post('/', auth.isLoggedIn, upload.single('image'), validateAircraftCreate, handleValidationErrors, controller.create);

// Show - GET /aircraft/:id
router.get('/:id', validateId, isPubliclyVisible, controller.show);

// Edit - GET /aircraft/:id/edit
router.get('/:id/edit', validateId, auth.isLoggedIn, auth.isSeller, controller.edit);

// Update - PUT /aircraft/:id
router.put('/:id', validateId, auth.isLoggedIn, auth.isSeller, upload.single('image'), validateAircraftUpdate, handleValidationErrors, controller.update);

// Destroy - DELETE /aircraft/:id
router.delete('/:id', validateId, auth.isLoggedIn, auth.isSeller, controller.destroy);

// Sub-routes for /aircraft/:id/offers
// validateId used to guarantee offerRoutes is passed a valid aircraft ID
router.use('/:id/offers', offerRoutes);

module.exports = router;