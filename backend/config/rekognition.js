const aws = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');

const awsRekognition = new aws.Rekognition({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: 'us-east-1',
});

// const dogImg = fs.readFileSync('/home/juliane/Downloads/teste1.jpeg');
// const params = {
//   Image: {
//     Bytes: Buffer.from(dogImg, 'base64'),
//   },
// };
// awsRekognition.detectLabels(params, (err, data) => {
//   if (err) console.log(err, err.stack); // an error occurred
//   else console.log(data); // successful response
// });


// const catImg = fs.readFileSync('/Users/ironhack/Downloads/cat.jpg');
const dog = 'https://www.petlove.com.br/images/breeds/216944/profile/original/Screen_Shot_2019-11-22_at_17.22.11.png?1574454200';
const cat = 'https://ak8.picdn.net/shutterstock/videos/18338188/thumb/1.jpg';
const cat2 = 'https://img.zipanuncios.com.br/1854532/2.jpg';
axios.get(cat2, {
  responseType: 'arraybuffer',
}).then((response) => {
  const params = {
    Image: {
      Bytes: response.data,
      // Bytes: Buffer.from(catImg, 'base64'),
    },
  };
  awsRekognition.detectLabels(params, (err, data) => {
    if (err) {
      console.log(err, err.stack); // an error occurred
      return;
    }
    const catOrDog = data.Labels.filter((pet) => pet.Name === 'Cat' || pet.Name === 'Dog');
    console.log(catOrDog[0].Name);
    console.log(data); // successful response
  });
})
  .catch((error) => console.log(error));
