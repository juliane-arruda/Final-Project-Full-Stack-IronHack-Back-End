const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const petSchema = new Schema({
  petName: String,
  petDescription: String,
  imageUrl: String,
  petLocation: {
    type: pointSchema,
    required: true,
  },
  petDate: String,
  type: {
    type: String,
    enum: ['dog', 'cat'],
  },
  labels: [String],
  role: {
    type: String,
    enum: ['perdido', 'encontrado'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
