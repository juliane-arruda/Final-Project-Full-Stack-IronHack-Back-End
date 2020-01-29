const aws = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');

const awsRekognition = new aws.Rekognition({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: 'us-east-1',
});

const dog = 'https://www.petlove.com.br/images/breeds/216944/profile/original/Screen_Shot_2019-11-22_at_17.22.11.png?1574454200';
const cat = 'https://ak8.picdn.net/shutterstock/videos/18338188/thumb/1.jpg';
const cat2 = 'https://img.zipanuncios.com.br/1854532/2.jpg';
const fish = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTjx5pZmzcO7FXGAixKuDvA-Zh2H1-fCkh2peNsvvkO3yg3pWx&s';
const passaro = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaPgDHCG8aP5apav7lV1tqw8gBSN6ubcJyRCTdUGc8uu9iy-6TOA&s';

axios.get(passaro, {
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
    const catOrDog = data.Labels.filter((pet) => pet.Name === 'Cat' || pet.Name === 'Dog' || pet.Name === 'Bird');
    console.log(catOrDog[0].Name);
    console.log(data); // successful response
  });
})
  .catch((error) => console.log(error));


// const dogImg = fs.readFileSync('/home/juliane/Downloads/teste1.jpeg');
// const fishImg = fs.readFileSync('/home/juliane/Downloads/teste2.jpeg');
// const params = {
//   Image: {
//     Bytes: Buffer.from(fishImg, 'base64'),
//   },
// };
// awsRekognition.detectLabels(params, (err, data) => {
//   if (err) console.log(err, err.stack); // an error occurred
//   else console.log(data); // successful response
// });

