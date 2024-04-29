//User database model

// Import mongoose, mongoose.Schema, and bcrypt
// Bcrypt handles password salting, hashing and comparison
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define the users structure
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: 2,
        maxLength: 32
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: 2,
        maxLength: 32
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already in use'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxLength: [64, 'Password must be less than 64 characters']
    }
});

// Every time a users is saved with a new password, hash the password
userSchema.pre('save', function(next)  {
    let user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
});

// Method for using bcrypt to determine if a users's password is correct
userSchema.methods.comparePassword = function(inputPassword) {
    let user = this;
    return bcrypt.compare(inputPassword, user.password);
}

// Export the model
module.exports = mongoose.model('User', userSchema);