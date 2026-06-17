const router = require('express').Router();
const followUpController = require('../controller/followUpController');
const { authentication, authorization } = require('../middleware/auth');

router.get('/all', followUpController.getAllFollowUp);
router.post('/add', authentication, authorization, followUpController.createFollowUp);
router.put('/update/:followUpId', authentication, authorization, followUpController.updateFollowUpPut);
router.delete('/delete/:followUpId', authentication, authorization, followUpController.deleteFollowUp);

module.exports = router;
