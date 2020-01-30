const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
})

const Photo = mongoose.model('User', photoSchema);

module.exports = Photo;