const router = require('express').Router();
const unitServicedController = require('../controller/unitServicedController');
const { authentication, authorization } = require('../middleware/auth');

router.get('/all', unitServicedController.getAllUnitServiced);
router.post('/add', authentication, authorization, unitServicedController.createUnitServiced);
router.put('/update/:unitServicedId', authentication, authorization, unitServicedController.updateUnitServicedPut);
router.delete('/delete/:unitServicedId', authentication, authorization, unitServicedController.deleteUnitServiced);

router.get('/visit/:visitId', authentication, unitServicedController.getVisitUnitsServiced);
router.post('/visit/:visitId', authentication, authorization, unitServicedController.createVisitUnitServiced);
router.patch('/visit/:visitId/:unitServicedId', authentication, authorization, unitServicedController.updateVisitUnitServiced);
router.delete('/visit/:visitId/:unitServicedId', authentication, authorization, unitServicedController.deleteVisitUnitServiced);

module.exports = router;
