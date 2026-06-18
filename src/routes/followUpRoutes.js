const router = require('express').Router();
const followUpController = require('../controller/followUpController');
const { authentication, authorization } = require('../middleware/auth');

router.get('/all', followUpController.getAllFollowUp);
router.post('/add', authentication, authorization, followUpController.createFollowUp);
router.put('/update/:followUpId', authentication, authorization, followUpController.updateFollowUpPut);
router.delete('/delete/:followUpId', authentication, authorization, followUpController.deleteFollowUp);

router.get('/visit/:visitId', authentication, followUpController.getVisitFollowUp);
router.post('/visit/:visitId', authentication, authorization, followUpController.createVisitFollowUp);
router.patch('/visit/:visitId/:followUpId', authentication, authorization, followUpController.updateVisitFollowUp);
router.delete('/visit/:visitId/:followUpId', authentication, authorization, followUpController.deleteVisitFollowUp);

module.exports = router;
