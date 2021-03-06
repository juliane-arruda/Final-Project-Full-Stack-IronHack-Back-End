const express = require('express');

// const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Pet = require('../models/pet');
const googleVision = require('../configs/google-vision');

const authRoutes = express.Router();

authRoutes.post('/signup', (req, res, next) => {
  const {
    username,
    password,
    email,
    role,
    petName,
    petDescription,
    imageUrl,
    petLocation,
    petDate,
  } = req.body;

  if (!petLocation) {
    res.status(400).json({
      message: 'localização não definida',
    });
    return;
  }

  if (!username || !password) {
    res.status(400).json({
      message: 'Provide username and password',
    });
    return;
  }

  if (password.length < 5) {
    res.status(400).json({
      message: 'Please make your password at least 5 characters long for security purposes.',
    });
    return;
  }

  User.findOne({
    username,
  }, (err, foundUser) => {
    if (err) {
      res.status(500).json({
        message: 'Username check went bad.',
      });
      return;
    }

    if (foundUser) {
      res.status(400).json({
        message: 'Username taken. Choose another one.',
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      username,
      password: hashPass,
      email,
    });

    // comparecao com api da imagem
    googleVision.detectUrl(imageUrl).then((imageResult) => {
      if (imageResult.isUnsafe) {
        res.status(400).json({
          message: 'conteúdo adulto não permitido',
        });
        return;
      }

      if (imageResult.type === null) {
        res.status(400).json({
          message: 'animal não encontrado',
        });
        return;
      }
                  aNewUser.save((err, user) => {
                    if (err) {
                      res.status(400).json({
                        message: 'Saving user to database went wrong.',
                      });
                      return;
                    }

      const aNewPet = new Pet({
        petName,
        petDescription,
        imageUrl,
        petLocation: {
          type: 'Point',
          coordinates: [
            petLocation.longitude,
            petLocation.latitude,
          ],
        },
        petDate,
        role,
        owner: user._id,
        type: imageResult.type,
        labels: imageResult.labels,
        breed: imageResult.breed,
      });
      console.log(aNewPet)
        
        aNewPet.save((err) => {
          if (err) {
            console.log(err)
            res.status(400).json({
              message: 'Saving user to database went wrong.',
            });
            return;
          }

          // Automatically log in user after sign up
          req.login(aNewUser, (err) => {
            if (err) {
              res.status(500).json({
                message: 'Login after signup went bad.',
              });
              return;
            }

            // Send the user's information to the frontend
            // We can use also: res.status(200).json(req.user);
            res.status(200).json({aNewUser, aNewPet});
          });
        });
      });
    });
  });
});


// LOGIN
authRoutes.post('/login', (req, res, next) => {
  const {
    username,
    password,
  } = req.body;
  if (username === '' || password === '') {
    res.json({
      errorMessage,
    }, {
      errorMessage: 'Please enter both, username and password to sign up.',
    });
    return;
  }

  User.findOne({
    username,
  })
    .then((user) => {
      if (!user) {
        res.json({
          errorMessage,
        }, {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.json({
          user,
        });
      } else {
        res.json({
          errorMessage,
        }, {
          errorMessage: 'Incorrect password',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// LOGOUT
authRoutes.get('/logout', (req, res, next) => {
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({
    message: 'Log out success!',
  });
});


// AUTHORIZATION
authRoutes.get('/loggedin', (req, res, next) => {
  // req.isAuthenticated() is defined by passport
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }
  res.status(403).json({
    message: 'Unauthorized',
  });
});


module.exports = authRoutes;
