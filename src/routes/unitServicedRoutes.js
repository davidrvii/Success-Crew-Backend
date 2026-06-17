const router = require('express').Router();
const unitServicedController = require('../controller/unitServicedController');
const { authentication, authorization } = require('../middleware/auth');

router.get('/all', unitServicedController.getAllUnitServiced);
router.post('/add', authentication, authorization, unitServicedController.createUnitServiced);
router.put('/update/:unitServicedId', authentication, authorization, unitServicedController.updateUnitServicedPut);
router.delete('/delete/:unitServicedId', authentication, authorization, unitServicedController.deleteUnitServiced);

module.exports = router;
