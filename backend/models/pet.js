const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petSchema = new Schema({
    petName: String,
    petCharacteristics: String,
    image: String,
    petLocation: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
})

{
    timestamps: true
}


const Pet = mongoose.model('Pet', userSchema)

module.exports = Pet;