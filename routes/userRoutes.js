// Imports
const express = require('express');
const controller = require('../controllers/userController');
const auth = require('../middleware/auth');
const {validateUserCreate, handleValidationErrors, validateUserLogin} = require("../middleware/validator");

// Initialize the router
const router = express.Router();

// Routes
// GET /users/new: Render the new users form
router.get('/new', auth.isGuest, controller.new);

// POST /users: Create a new user
router.post('/', auth.isGuest, validateUserCreate, handleValidationErrors, controller.create);

// GET /users/login: Render the login form
router.get('/login', auth.isGuest, controller.showLogin);

// POST /users/login: Log in a user
router.post('/login', auth.isGuest, validateUserLogin, handleValidationErrors, controller.login);

// GET /users/profile: Render the user profile page
router.get('/profile', auth.isLoggedIn, controller.profile);

// GET /users/logout: Log out a user
router.get('/logout', auth.isLoggedIn, controller.logout);

module.exports = router;