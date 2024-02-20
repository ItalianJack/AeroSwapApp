const express = require('express');
const controller = require('../controllers/aircraftController');

const router = express.Router();

// Index - GET /aircraft
router.get('/', controller.index);

// New - GET /aircraft/new
router.get('/new', controller.new);

// Create - POST /aircraft
// router.post('/', controller.create);

// Show - GET /aircraft/:id
router.get('/:id', controller.show);

// Edit - GET /aircraft/:id/edit
router.get('/:id/edit', controller.edit);

// Update - PUT /aircraft/:id
router.put('/:id', controller.update);

// Destroy - DELETE /aircraft/:id
// router.delete('/:id', controller.destroy);


module.exports = router;