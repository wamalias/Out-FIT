const {Firestore} = require("@google-cloud/firestore");

//credentials for firestore
const db = new Firestore({
    projectId: 'out-fit-425907',
    keyFilename: path.join(__dirname, 'firestore-outfit.json')
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
async function fetch_data(userID) {
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

module.exports = {
    store_data, 
    fetch_data
};