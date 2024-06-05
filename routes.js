const { Router } = require('express'); 
const myController = require('./controllers.js'); 
const multer = require('multer');
  
const router = Router(); 

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB
});

// Requests  
router.get('/', myController.welcomePage); 
router.get('/:id/WeeklyRecommendation', myController.getWeeklyRecommendationMethod);
router.get('/:id/OutfitRecommendation', myController.getOutfitRecommendationMethod);
router.get('/:id/History', myController.getHistoryMethod);
router.get('/:id/Profile', myController.getProfileMethod);

router.post('/:id/PostImage', upload.single('file'), myController.postImageMethod);
router.post('/Profile', myController.postProfileMethod);

router.put('/:id/Profile', myController.updateProfileMethod);
  
module.exports = router;