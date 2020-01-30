const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    role: {
    type: String,
    enum: ['LOST', 'FOUND'],
  },
}, {
  timestamps: true,

});

const User = mongoose.model('User', userSchema);

module.exports = User;