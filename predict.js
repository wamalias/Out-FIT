//INI BELUM DITES SAMA SEKALI
//AKU CUMA NGUMPULIN FUNGSI DARI REFERENSI

const tfjs = require('@tensorflow/tfjs-node');
const {Firestore} = require("@google-cloud/firestore");

types_dict = ['Blazer', 'Dress', 'Jacket', 'Pants', 'Shirt', 'Short', 'Skirt', 'Top', 'Tshirt']

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function loadModel() {
//    const ModelUrl = "https://storage.googleapis.com/savedmodelcancer-was/model.json";
    const filePath = path.join(__dirname, '/ModelOutput/model.json');
    const fileContent = await readFile(filePath);
    return tfjs.loadGraphModel(fileContent);
}

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

function detectColors(imageData) {
  // Convert to HSV and create masks for color detection
  // OpenCV.js can be used here for similar processing as in Python
  const src = cv.matFromImageData(imageData);
  const hsv = new cv.Mat();
  cv.cvtColor(src, hsv, cv.COLOR_RGB2HSV);
  
  const redLower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 50, 50, 0]);
  const redUpper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [10, 255, 255, 255]);
  const blueLower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [110, 50, 50, 0]);
  const blueUpper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [130, 255, 255, 255]);
  const yellowLower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [20, 100, 100, 0]);
  const yellowUpper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [30, 255, 255, 255]);
  const greenLower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [50, 50, 50, 0]);
  const greenUpper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [70, 255, 255, 255]);

  const maskRed = new cv.Mat();
  const maskBlue = new cv.Mat();
  const maskYellow = new cv.Mat();
  const maskGreen = new cv.Mat();
  
  cv.inRange(hsv, redLower, redUpper, maskRed);
  cv.inRange(hsv, blueLower, blueUpper, maskBlue);
  cv.inRange(hsv, yellowLower, yellowUpper, maskYellow);
  cv.inRange(hsv, greenLower, greenUpper, maskGreen);
  
  const maskCombined = new cv.Mat();
  cv.add(maskRed, maskBlue, maskCombined);
  cv.add(maskCombined, maskYellow, maskCombined);
  cv.add(maskCombined, maskGreen, maskCombined);
  
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
  cv.morphologyEx(maskCombined, maskCombined, cv.MORPH_CLOSE, kernel);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(maskCombined, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
  const detectedColors = [];
  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    const rect = cv.boundingRect(contour);
    const x = rect.x + rect.width / 2;
    const y = rect.y + rect.height / 2;
    
    if (maskRed.ucharAt(y, x) === 255) detectedColors.push('merah');
    else if (maskBlue.ucharAt(y, x) === 255) detectedColors.push('biru');
    else if (maskYellow.ucharAt(y, x) === 255) detectedColors.push('kuning');
    else if (maskGreen.ucharAt(y, x) === 255) detectedColors.push('hijau');
  }

  src.delete(); hsv.delete();
  redLower.delete(); redUpper.delete();
  blueLower.delete(); blueUpper.delete();
  yellowLower.delete(); yellowUpper.delete();
  greenLower.delete(); greenUpper.delete();
  maskRed.delete(); maskBlue.delete();
  maskYellow.delete(); maskGreen.delete();
  maskCombined.delete();
  kernel.delete(); contours.delete(); hierarchy.delete();

  return detectedColors;
}

async function predictOutfit(img) {
  model = loadModel();

  const tensor = tfjs.node
    .decodeJpeg(img)
    .resizeNearestNeighbor([150, 150])
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();

  const predictions = model.predict(tensor);
  const predictedClass = predictions.argMax(-1).dataSync()[0];
  const confidenceScore = predictions.dataSync()[predictedClass] * 100;

  return { 
    label: typesDict[predictedClass], 
    confidence: confidenceScore 
  };
}

module.exports = {
    predictOutfit,
    detectColors,
    loadModel, 
    predict, 
    store_data, 
    fetch_data
};