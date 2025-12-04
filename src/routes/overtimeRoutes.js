const router = require('express').Router()
const overtimeController = require('../controller/overtimeController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/admin', overtimeController.getAllOvertime)

router.get('/crew/:id', authentication, overtimeController.getCrewOvertime)

router.get('/detail/:id', authentication, overtimeController.getOvertimeDetail)

router.post('/add', authentication, authorization, overtimeController.createNewOvertime)

router.patch('/update/:id', authentication, authorization, overtimeController.updateOvertime)

router.delete('/delete/:id', authentication, authorization, overtimeController.deleteOvertime)

module.exports = router