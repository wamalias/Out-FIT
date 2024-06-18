/*
This is a file to make routing for every API 
and add middlewear to store file that uploaded from user.
*/ 

const { Router } = require('express'); 
const myController = require('./controllers.js'); 
const multer = require('multer');
const path = require('path');

const router = Router(); 

//to get file from user
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/'); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename to avoid overwriting
    }
});

const upload = multer({storage: storage});

// Requests
router.get('/WeeklyRecommendation', myController.getWeeklyRecommendationMethod);
router.get('/:type/OutfitRecommendation', myController.getOutfitRecommendationMethod);
router.get('/:id/History', myController.getHistoryMethod);
router.post('/:id/PostImage', upload.single('file'), myController.postImageMethod);
  
module.exports = router;