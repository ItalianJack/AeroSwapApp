const {validationResult, body, check} = require('express-validator');

exports.validateId = (req, res, next) => {
    const id = req.params.id;

    //an objectId is a 24-bit Hex string
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid id');
        err.status = 400;
        return next(err);
    } else {
        next();
    }
}


// if a field is 'required' in the schema, the field cannot be empty
// other than password and image, all inputs must be escaped to avoid XSS attacks
// all fields should be trimmed to avoid extra spaces
// the email field must be normalized, and the value of the email field must be a valid email address.
// the value of the password field must have a minimum length of 8 and a maximum length of 64
// the value of the condition field can only be one of those listed in the the condition field in the new item form.
//     Hint: isIn() method defined in validator.js can be used for this validation.
// the value of the price field and the offer field can ONLY be a number that is greater than 0.

exports.validateUserCreate = [
    body('email', 'Valid email is required').trim().notEmpty().isEmail().normalizeEmail().escape(),
    body('firstName', 'First name between 2 and 32 characters is required').trim().notEmpty().isLength({
        min: 2,
        max: 32
    }).escape(),
    body('lastName', 'Last name between 2 and 32 characters is required').trim().notEmpty().isLength({
        min: 2,
        max: 32
    }).escape(),
    body('password', 'Password must be between 8 and 64 characters').trim().notEmpty().isLength({min: 8, max: 64}),
]

exports.validateUserLogin = [
    body('email', 'Valid email is required').trim().notEmpty().isEmail().normalizeEmail().escape(),
    body('password', 'Password must be between 8 and 64 characters').trim().notEmpty().isLength({min: 8, max: 64}),
]

exports.validateAircraftCreate = [
    body('title', 'Title is required').trim().notEmpty().escape(),
    body('condition', 'Condition must be an approved value').trim().notEmpty().isIn([
        'New', 'Like new', 'Used, no engine overhauls', 'Used, one engine overhaul', 'Used, two or more overhauls'
    ]).escape(),
    body('price', 'Price must be greater than 0').trim().notEmpty().isFloat({gt: 0}).escape(),
    body('details', 'Details are required').trim().notEmpty().escape(),
    check('image', 'Image is required').custom((value, {req}) => {
        if (req.file) {
            return true;
        } else {
            return false;
        }
    })
]

// notEmpty() CHECKS ARE USED BECAUSE UPDATE FORM IS PRE-FILLED WITH PREVIOUS DATA.
// It is assumed that if a user doesn't want to change an attribute of a listing, they don't change the pre-filled value.
// Omitting the notEmpty() check would allow a user to submit an empty form and overwrite the existing data with empty values.
// With the exception of the image upload, because that is not pre-filled. If the user doesn't upload a new image, the old image should remain.
exports.validateAircraftUpdate = [
    body('title', 'Title is required').trim().notEmpty().escape(),
    body('condition', 'Condition must be an approved value').trim().notEmpty().isIn([
        'New', 'Like new', 'Used, no engine overhauls', 'Used, one engine overhaul', 'Used, two or more overhauls'
    ]).escape(),
    body('price', 'Price must be greater than 0').trim().notEmpty().isFloat({gt: 0}).escape(),
    body('details', 'Details are required').trim().notEmpty().escape(),
    // No image check is necessary because the image is not required for an update
]

exports.validateOfferCreate = [
    body('price', 'Price must be greater than 0').trim().notEmpty().isFloat({gt: 0}).escape(),
]

exports.handleValidationErrors = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        console.log('Redirecting from handleValidationErrors')
        return res.redirect('back');
    } else {
        return next();
    }
}