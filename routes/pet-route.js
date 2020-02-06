// routes/project-routes.js
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Pet = require('../models/pet');
const User = require('../models/user');
const nodemailer = require('nodemailer')

// POST route => to create a new pet
router.post('/pet', (req, res, _next) => {
  Pet.create({
      petName: req.body.petName,
      petDescription: req.body.petDescription,
      imageUrl: req.body.image,
      owner: req.user._id,
      petLocation: req.body.petLocation,
      role: req.body.role,
    })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});


// GET route => to get all pets
router.get('/pets', (_req, res, _next) => {
  Pet.find().sort({
      createdAt: -1,
    })
    .then((allThePets) => {
      res.json(allThePets);
    })
    .catch((err) => {
      res.json(err);
    });
});

// GET route => to get pets perdidos
router.get('/pets-perdidos', (_req, res, _next) => {
  // Pet.find().where('role', 'perdido')
  Pet.find({
    role: 'perdido',
  }).then((petsPerdidos) => {
    res.json(petsPerdidos);
  }).catch((err) => {
    res.json(err);
  });
});

// GET route => to get pets encontrados
router.get('/pets-encontrados', (_req, res, _next) => {
  // Pet.find().where('role', 'encontrado')
  Pet.find({
    role: 'encontrado',
  }).then((petsEncontrados) => {
    res.json(petsEncontrados);
  }).catch((err) => {
    res.json(err);
  });
});




// GET route => to get a specific pet/detailed view
router.get('/pets/:id', (req, res, _next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid',
    });
    return;
  }

  Pet.findById(req.params.id).populate("owner")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});


// PUT route => to update a specific pet
router.put('/pets/:id', (req, res, _next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid',
    });
  }

  Pet.findByIdAndUpdate(req.params.id, req.body)
    .then((pet) => {
      res.json({
        pet
      });
    })
    .catch((err) => {
      res.json(err);
    });
});


// DELETE route => to delete a specific pet
router.delete('/pets/:id', (req, res, _next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid',
    });
    return;
  }

  Pet.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({
        message: ` ${req.params.id} Pet removido com sucesso.`,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

// GET route => to get a specific pet and compare 
router.get('/pet/search/:id', (req, res, _next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({
      message: 'Specified id is not valid',
    });
    return;
  }

  Pet.findById(req.params.id)
    .then((petSearch) => {
      // console.log(petSearch) 
     

      const {role, type} = petSearch;

      let newRole = "";

      role === "encontrado" ? newRole = "perdido" : newRole = "encontrado"
      
      Pet.find({ role: newRole, type:type} )
      .populate('owner')
      .then((petBreeds) => {
        
       
        let foundPet = false;
        let similarPets = [];
          similarPets = petBreeds.filter((element) =>  { 
            console.log(element.breed)
            petSearch.breed.forEach((e) => {
             foundPet = false; 
            if (element.breed.includes(e)) foundPet = true;
            console.log(foundPet, e)
            })
          return foundPet
        })
        console.log(similarPets)
      

            res.json(similarPets)
            return
      })
        .catch((err) => {
          res.json(err);
        });
        

        // POST /signup 200 2056.810 ms - 947
        // false ["Shetland sheepdog","Phalène","Scotch collie"] Scotch collie
        // false ["Shetland sheepdog","Phalène","Scotch collie"] Collie
        // false ["Shetland sheepdog","Phalène","Scotch collie"] Rough collie
        // false ["Shetland sheepdog","Phalène","Scotch collie"] Shetland sheepdog
        // GET /pet/search/5e3c17de18b0a43d5ed75bc9 200 26.047 ms - 876
    })
    .catch((err) => {
      res.json(err);
    });


});

router.post('/send-email', (req, res, next) => {
  console.log(req.body)
  let { userEmail, petEmail } = req.body;
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'icatyourpet@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });
  transporter.sendMail({
    from: '"I Cat Your Pet " <icatyourpet@gmail.com>',
    to: petEmail, 
    subject: 'Informações sobre seu Pet', 
    
    text: `Tenho informações sobre esse pet! Por favor entre em contato comigo através do email: ${userEmail}`
  })
  .then(info => res.json( {message:"enviado com sucesso"}))
  .catch(error => console.log(error));
});

module.exports = router;

