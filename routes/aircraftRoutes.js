const express = require('express');
const upload = require('multer')({dest: './public/images'});
const controller = require('../controllers/aircraftController');
const auth = require('../middleware/auth');
const validator = require('../middleware/validator');

const router = express.Router();

// Index - GET /aircraft
router.get('/', controller.index);

// New - GET /aircraft/new
router.get('/new', auth.isLoggedIn, controller.new);

// Create - POST /aircraft
router.post('/', auth.isLoggedIn, upload.single('image'), controller.create);

// Show - GET /aircraft/:id
router.get('/:id', validator.validateId, controller.show);

// Edit - GET /aircraft/:id/edit
router.get('/:id/edit', validator.validateId, auth.isLoggedIn, auth.isSeller, controller.edit);

// Update - PUT /aircraft/:id
router.put('/:id', validator.validateId, auth.isLoggedIn, auth.isSeller, upload.single('image'), controller.update);

// Destroy - DELETE /aircraft/:id
router.delete('/:id', validator.validateId, auth.isLoggedIn, auth.isSeller, controller.destroy);


module.exports = router;