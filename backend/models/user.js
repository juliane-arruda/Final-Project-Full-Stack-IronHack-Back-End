const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { 
        type: String,
        unique: true,
        required: true,
    },
    email: String,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum : ['LOST', 'FOUND']
      },
})

{
    timestamps: true
}


const User = mongoose.model('User', userSchema)

module.exports = User;