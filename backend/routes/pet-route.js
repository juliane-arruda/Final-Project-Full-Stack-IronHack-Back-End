// routes/project-routes.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Pet = require('../models/pet');
const User = require('../models/user');



// POST route => to create a new project
router.post('/pet', (req, res, next) => {

  Pet.create({
      petName: req.body.petName,
      petDescription: req.body.petDescription,
      image: req.body.image,
      owner: req.user._id,
      petLocation: req.body.petLocation
    })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    })
});


// GET route => to get all pets
router.get('/pets', (req, res, next) => {
  Pet.find().sort({
      createdAt: -1
    })
    .then(allThePets => {
      res.json(allThePets);
    })
    .catch(err => {
      res.json(err);
    })
});



// GET route => to get a specific pet/detailed view
router.get('/pet/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid'
    });
    return;
  }

  Pet.findById(req.params.id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.json(err);
    })
})

// PUT route => to update a specific pet
router.put('/pet/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid'
    });
    return;
  }

  Pet.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({
        message: ` ${req.params.id} atualizado com sucesso.`
      });
    })
    .catch(err => {
      res.json(err);
    })
})


// DELETE route => to delete a specific pet
router.delete('/pet/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid'
    });
    return;
  }

  Pet.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({
        message: ` ${req.params.id} Pet removido com sucesso.`
      });
    })
    .catch(err => {
      res.json(err);
    })
})



module.exports = router;