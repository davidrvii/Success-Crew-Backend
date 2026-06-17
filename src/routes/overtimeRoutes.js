const router = require('express').Router()
const overtimeController = require('../controller/overtimeController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/all', overtimeController.getAllOvertime)
router.get('/basic/all', overtimeController.getOvertimeBasicAll)
router.get('/basic/:overtimeId', authentication, overtimeController.getOvertimeBasicById)
router.get('/crew/:id', authentication, overtimeController.getCrewOvertime)
router.get('/detail/:id', authentication, overtimeController.getOvertimeDetail)

router.post('/add', authentication, authorization, overtimeController.createNewOvertime)

router.patch('/update/:overtimeId', authentication, authorization, overtimeController.updateOvertime)
router.put('/update/:overtimeId', authentication, authorization, overtimeController.updateOvertimePut)

router.delete('/delete/:overtimeId', authentication, authorization, overtimeController.deleteOvertime)

module.exports = router