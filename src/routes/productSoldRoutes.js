const router = require('express').Router();
const productSoldController = require('../controller/productSoldController');
const { authentication, authorization } = require('../middleware/auth');

router.get('/all', productSoldController.getAllProductSold);
router.post('/add', authentication, authorization, productSoldController.createProductSold);
router.put('/update/:productSoldId', authentication, authorization, productSoldController.updateProductSoldPut);
router.delete('/delete/:productSoldId', authentication, authorization, productSoldController.deleteProductSold);

router.get('/visit/:visitId', authentication, productSoldController.getVisitProductsSold);
router.post('/visit/:visitId', authentication, authorization, productSoldController.createVisitProductSold);
router.patch('/visit/:visitId/:productSoldId', authentication, authorization, productSoldController.updateVisitProductSold);
router.delete('/visit/:visitId/:productSoldId', authentication, authorization, productSoldController.deleteVisitProductSold);

module.exports = router;
