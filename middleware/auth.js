const Aircraft = require('../models/aircraft');

// If the current user is a guest, continue. Otherwise redirect to the login page.
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        req.flash('error', 'You are already logged in.');
        res.redirect('/users/profile');
    }
}

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        req.flash('error', 'You must be logged in to view that page.');
        res.redirect('/users/login');
    }
}

exports.isSeller = (req, res, next) => {
    const listingId = req.params.id;
    Aircraft.findById(listingId)
        .then(listing => {
            if (listing) {
                if (listing.seller.equals(req.session.user._id)) {
                    next();
                } else {
                    let err = new Error('Unauthorized');
                    err.status = 401;
                    next(err);
                }
            } else {
                const err = new Error('Listing not found');
                err.status = 404;
                next(err);
            }
        })
}

exports.isNotSeller = (req, res, next) => {
    const listingId = req.params.id;
    Aircraft.findById(listingId)
        .then(listing => {
            if (listing) {
                if (!listing.seller.equals(req.session.user._id)) {
                    next();
                } else {
                    let err = new Error('Unauthorized');
                    err.status = 401;
                    next(err);
                }
            } else {
                const err = new Error('Listing not found');
                err.status = 404;
                next(err);
            }
        })
}