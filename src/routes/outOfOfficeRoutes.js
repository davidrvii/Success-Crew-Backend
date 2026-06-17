const router = require('express').Router()
const outOfOfficeController = require('../controller/outOfOfficeController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/admin', outOfOfficeController.getAllOutOfOffice)

router.get('/crew/:id', authentication, outOfOfficeController.getCrewOutOfOffice)

router.get('/detail/:id', authentication, outOfOfficeController.getOutOfOfficeDetail)

router.post('/add', authentication, authorization, outOfOfficeController.createNewOutOfOffice)

router.patch('/update/:id', authentication, authorization, outOfOfficeController.updateOutOfOffice)

router.delete('/delete/:id', authentication, authorization, outOfOfficeController.deleteOutOfOffice)

module.exports = router
