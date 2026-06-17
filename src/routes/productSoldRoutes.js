const router = require('express').Router();
const productSoldController = require('../controller/productSoldController');
const { authentication, authorization } = require('../middleware/auth');

router.get('/all', productSoldController.getAllProductSold);
router.post('/add', authentication, authorization, productSoldController.createProductSold);
router.put('/update/:productSoldId', authentication, authorization, productSoldController.updateProductSoldPut);
router.delete('/delete/:productSoldId', authentication, authorization, productSoldController.deleteProductSold);

module.exports = router;
