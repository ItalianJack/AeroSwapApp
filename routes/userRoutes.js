// Imports
const express = require('express');
const controller = require('../controllers/userController');

// Initialize the router
const router = express.Router();

// Routes
// GET /users/new: Render the new users form
router.get('/new', controller.new);

// POST /users: Create a new user
router.post('/', controller.create);

// GET /users/login: Render the login form
router.get('/login', controller.showLogin);

// POST /users/login: Log in a user
router.post('/login', controller.login);

// GET /users/profile: Render the user profile page
// router.get('/profile', controller.profile);

// GET /users/logout: Log out a user
router.get('/logout', controller.logout);

module.exports = router;