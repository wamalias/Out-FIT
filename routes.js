const { Router } = require('express'); 
const myController = require('./controllers.js'); 
  
const router = Router(); 
  
// Requests  
router.get('/', myController.welcomePage); 
router.get('/:id/WeeklyRecommendation', myController.getWeeklyRecommendationMethod);
router.get('/:id/OutfitRecommendation', myController.getOutfitRecommendationMethod);
router.get('/:id/History', myController.getHistoryMethod);
router.get('/:id/Profile', myController.getProfileMethod);

router.post('/:id/PostImage', myController.postImageMethod);
router.post('/Profile', myController.postProfileMethod);

router.put('/:id/Profile', myController.updateProfileMethod);
  
module.exports = router;