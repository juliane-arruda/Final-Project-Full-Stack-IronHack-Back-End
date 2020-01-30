const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const petSchema = new Schema({
  petName: String,
  petDescription: String,
  image: String,
  petLocation: String,
  // date: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
},
  {
    timestamps: true,
  }
);

const Pet = mongoose.model('Pet', petSchema)

module.exports = Pet;

