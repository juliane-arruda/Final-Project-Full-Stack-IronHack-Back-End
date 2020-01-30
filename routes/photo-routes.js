const express = require('express');

const router = express.Router();

// include CLOUDINARY:
const uploader = require('../configs/cloudinary');

router.get((req, res) => res.json('teste'));

// esse aqui faz o upload da imagem
router.post('/upload', uploader.single('imageUrl'), (req, res, next) => {
  // console.log('file is: ', req.file)

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  // get secure_url from the file object and save it in the
  // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
  res.json({
    secure_url: req.file.secure_url,
  });
});

// esse aqui é executado quando aperta o botão salvar
router.post('/photo', (req, res, next) => {
});

module.exports = router;
