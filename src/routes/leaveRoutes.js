const router = require('express').Router()
const leaveController = require('../controller/leaveController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/all', leaveController.getAllLeave)
router.get('/basic/all', leaveController.getLeaveBasicAll)
router.get('/basic/:leaveId', authentication, leaveController.getLeaveBasicById)
router.get('/crew/:id', authentication, leaveController.getCrewLeave)
router.get('/detail/:id', authentication, leaveController.getLeaveDetail)

router.post('/add', authentication, authorization, leaveController.createNewLeave)

router.patch('/update/:leaveId', authentication, authorization, leaveController.updateLeave)
router.put('/update/:leaveId', authentication, authorization, leaveController.updateLeavePut)

router.delete('/delete/:leaveId', authentication, authorization, leaveController.deleteLeave)

module.exports = router