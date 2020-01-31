const aws = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');

const awsRekognition = new aws.Rekognition({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: 'us-east-1',
});

const detectUrl = (url) => axios.get(url, {
  responseType: 'arraybuffer',
}).then((response) => {
  const params = {
    Image: {
      Bytes: response.data,
      // Bytes: Buffer.from(catImg, 'base64'),
    },
  };

  return new Promise((resolve, reject) => {
    awsRekognition.detectLabels(params, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(err);
        return;
      }
      // const catOrDog = data.Labels.filter((pet) => pet.Name === 'Cat' || pet.Name === 'Dog');
      const cat = data.Labels.filter((pet) => pet.Name === 'Cat');
      const dog = data.Labels.filter((pet) => pet.Name === 'Dog');
      // console.log(catOrDog[0].Name);
      // console.log(data); // successful response
      let type = null;
      if (dog.length > 0) {
        type = 'dog';
      } else if (cat.length) {
        type = 'cat';
      } else {
        type = null;
      }
      resolve({
        type,
      });
    });
  });
}).catch((error) => console.log(error));


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

module.exports = {
  detectUrl,
};
