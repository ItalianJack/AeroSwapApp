const User = require('../models/user');
const Aircraft = require('../models/aircraft');

exports.new = (req, res) => {
    res.render('users/new');
}

exports.create = (req, res, next) => {
    console.log(req.body);
    let user = new User(req.body);
    user.save()
        .then(() => {
            res.redirect('/users/login');
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                err.message = 'Validation Error';
                err.status = 400;
            }
            if (err.code === 11000) {
                err.message = 'Email already exists';
                err.status = 400;
            }
            next(err);
        });
}

exports.showLogin = (req, res) => {
    res.render('users/login');
}

exports.login = (req, res, next) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                console.log('Wrong email address');
                req.flash('error', 'Wrong email address.');
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(correctPassword => {
                        if (correctPassword) {
                            req.session.user = user;
                            req.flash('success', 'You are now logged in. Welcome back!');
                            res.redirect('/');
                        } else {
                            console.log('Wrong password');
                            req.flash('error', 'Wrong password.');
                            res.redirect('/users/login');
                        }
                    })
            }
        })
}

exports.profile = (req, res, next) => {
    Aircraft.find({seller: req.session.user.id})
        .then(aircraft => res.render('users/profile', {aircraft}))
        .catch(err => next(err));
}

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    })
}