const User = require('../models/user');
const Aircraft = require('../models/aircraft');
const Offer = require('../models/offer');

exports.new = (req, res) => {
    res.render('users/new');
}

exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then(() => {
            req.flash('success', 'User created successfully!');
            res.redirect('/users/login');
        })
        .catch((err) => {
            next(err);
        });
}

exports.showLogin = (req, res) => {
    res.render('users/login');
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Wrong email address.');
                console.log('Login redirect from email block!')
                return res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(correctPassword => {
                        if (correctPassword) {
                            req.session.user = user;
                            req.flash('success', 'You are now logged in. Welcome back!');
                            return res.redirect('/users/profile');
                        } else {
                            req.flash('error', 'Wrong password.');
                            console.log('Login redirect from password block!')
                            return res.redirect('/users/login');
                        }
                    })
            }
        })
}

exports.profile = (req, res, next) => {
    Promise.all([
        Aircraft.find({seller: req.session.user._id}),
        Offer.find({buyer: req.session.user._id}).populate('aircraft')
    ])
        .then(([aircraft, offers]) => {
            res.render('users/profile', {aircraft, offers});
        })
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