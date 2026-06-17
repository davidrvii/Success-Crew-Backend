const router = require('express').Router()
const outOfOfficeController = require('../controller/outOfOfficeController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/all', outOfOfficeController.getAllOutOfOffice)
router.get('/basic/all', outOfOfficeController.getOutOfOfficeBasicAll)
router.get('/basic/:outOfOfficeId', authentication, outOfOfficeController.getOutOfOfficeBasicById)
router.get('/crew/:id', authentication, outOfOfficeController.getCrewOutOfOffice)
router.get('/detail/:id', authentication, outOfOfficeController.getOutOfOfficeDetail)

router.post('/add', authentication, authorization, outOfOfficeController.createNewOutOfOffice)

router.patch('/update/:outOfOfficeId', authentication, authorization, outOfOfficeController.updateOutOfOffice)
router.put('/update/:outOfOfficeId', authentication, authorization, outOfOfficeController.updateOutOfOfficePut)

router.delete('/delete/:outOfOfficeId', authentication, authorization, outOfOfficeController.deleteOutOfOffice)

module.exports = router
