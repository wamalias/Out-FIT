/*
This file is used to interact with Google Cloud Firestore.
1. Store data to Firestore based on User ID
2. Fetch history from Firestore based on User ID
3. Fetch outfit recommendation from Firestore based on outfit type
*/

const {Firestore} = require("@google-cloud/firestore");
const path = require('path');

//credentials for firestore
const db = new Firestore({
    projectId: 'out-fit-425907',
    keyFilename: path.join(__dirname, 'key-firestore.json')
});

//post data to firestore
async function store_data(userID, data) {
    const predictionCollections = db.collection('user_predictions').doc(userID).collection('data');
    const dataDoc = await predictionCollections.doc(data.id)
    try{
      await dataDoc.set(data);
    } catch(err) {
      console.log(err.message);
    }    
}

//get data from firestore grouped by userId
//can use for get histories
async function fetch_history(userID) {
    const predictionCollections = db.collection('user_predictions').doc(userID).collection('data');
    
    try {
        const snapshot = await predictionCollections.get();
        const fetchedData = [];
        snapshot.forEach(doc => {
            fetchedData.push(doc.data());
        });
        return fetchedData;
    } catch (err) {
        console.log(err.message);
        return [];
    }
}

async function fetch_recom(type) {
    const predictionCollections = db.collection('mixandmatch').doc(type).collection('image');
    
    try {
        const snapshot = await predictionCollections.get();
        const fetchedData = [];
        snapshot.forEach(doc => {
            fetchedData.push(doc.data());
        });
        return fetchedData;
    } catch (err) {
        console.log(err.message);
        return [];
    }
}

module.exports = {
    store_data, 
    fetch_history,
    fetch_recom,
};