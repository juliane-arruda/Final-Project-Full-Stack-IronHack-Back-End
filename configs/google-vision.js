// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// [START vision_quickstart]
async function detectUrl(imageUrl) {

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // console.log('teste', vision.ImageAnnotatorClient.types);

  // Performs label detection on the image file
  const [result] = await client.annotateImage({
    image: {
      source: {
        // filename: './resources/teste.jpg',
        imageUri: imageUrl,
      },
    },
    features: [{
        type: 'LABEL_DETECTION'
      },
      {
        type: 'SAFE_SEARCH_DETECTION'
      },
    ],
  });
  console.log(result);


  const isUnsafe = Object.values(result.safeSearchAnnotation)
    .filter((value) => value === 'VERY_LIKELY' || value === 'LIKELY').length > 0;

  const labels = result.labelAnnotations.map((pet) => pet.description);

  const breed = result.labelAnnotations.filter((element) => element.description !== 'Dog' && element.description !== 'Cat' && element.description !== 'Facial expression' && element.description !== 'Felidae' && element.description !== 'Whiskers' && element.description !== 'Small to medium-sized cats' && element.description !== 'Snout' && element.description !== 'Mammal' && element.description !== 'Vertebrate' && element.description !== 'Dog breed' && element.description !== 'Canidae' && element.description !== 'Skin' && element.description !== 'Companion dog' && element.description !== 'Carnivore').map((e) => e.description);

  
  const cat = result.labelAnnotations.filter((pet) => pet.description === 'Cat');
  const dog = result.labelAnnotations.filter((pet) => pet.description === 'Dog');
  let type = null;
  if (dog.length > 0) {
    type = 'dog';
  } else if (cat.length) {
    type = 'cat';
  } else {
    type = null;
  }
  return {
    type,
    isUnsafe,
    labels,
    breed,
  };

  // const labels = result.labelAnnotations;
  // console.log('Labels:');
  // labels.forEach(label => console.log(label.description));
}

module.exports = { detectUrl };
