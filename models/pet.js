const mongoose = require('mongoose');

const { Schema } = mongoose;

const petSchema = new Schema({
  petName: String,
  petDescription: String,
  imageUrl: String,
  petLocation: String,
  petDate: String,
  type: {
    type: String,
    enum: ['dog', 'cat'],
  },
  role: {
    type: String,
    enum: ['perdido', 'encontrado'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
},
{
  timestamps: true,
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
