const { Router } = require('express'); 
const myController = require('./controllers.js'); 
const multer = require('multer');
const path = require('path');

const router = Router(); 

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
router.get('/', myController.welcomePage); 
router.get('/WeeklyRecommendation', myController.getWeeklyRecommendationMethod);
router.get('/:type/OutfitRecommendation', myController.getOutfitRecommendationMethod);
router.get('/:id/History', myController.getHistoryMethod);
router.get('/:id/Profile', myController.getProfileMethod);

router.post('/:id/PostImage', upload.single('file'), myController.postImageMethod);
router.post('/PostMixandMatch', upload.single('file'), myController.postMixandMatch);
router.post('/Profile', myController.postProfileMethod);

router.put('/:id/Profile', myController.updateProfileMethod);
  
module.exports = router;