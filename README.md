# I CAT YOUR PETS

final project with full stack application.

back end part of the project.

## Running your project

First you need a cloudnary account, a Mongo DB, and a Google Cloud account, with the Google Vision API.

1. You need to run `npm install` in the root of the application to install the dependencies.
2. Create a .env file with the following
```
PORT=5000
MONGODB_URI= <url of mongo db>
CLOUDINARY_NAME=<name of the cloudnary API>
CLOUDINARY_KEY=<cloudnary key>
CLOUDINARY_SECRET=<cloudnary secret>
GOOGLE_APPLICATION_CREDENTIALS=<The path of a google private keys. you should use key.json in debug>
EMAIL_PASSWORD=<password used to send email. Not required to run>
```

Then run `npm start`
