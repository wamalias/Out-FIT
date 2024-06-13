const {Firestore} = require("@google-cloud/firestore");

async function store_data(data) {
    const db = new Firestore();
    const predictionCollections = db.collection('predictions');
    const dataDoc = await predictionCollections.doc(data.id)
    try{
      await dataDoc.set(data);
    } catch(err) {
      console.log(err.message);
    }    
}

async function fetch_data() {
    const db = new Firestore();

    const predictionCollections = db.collection('predictions');
    
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