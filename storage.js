/*
This file is used to interact with Google Cloud Storage
It will upload image that inputed by user and return its public URL
*/

const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Credentials for Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname, 'gcs-firekey.json'),
  projectId: 'out-fit-425907',
});

const bucket = storage.bucket('image-history');

// Function to post image
async function postImagetoStorage (filepath, fileName) {
    try {
        const storagepath = `/${fileName}`;
        const image = await bucket.upload(filepath, {
            destination: storagepath,
            predefinedAcl: 'publicRead', // Set the file to be publicly readable
            metadata: {
                contentType: "image/png", // Adjust the content type as needed
            }
        });
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagepath}`;
        return publicUrl;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
};

module.exports = {
    postImagetoStorage
}
