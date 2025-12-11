const router = require('express').Router()
const leaveController = require('../controller/leaveController')
const { authentication , authorization } = require('../middleware/auth')
/*
router.get('/admin', leaveController.getAllLeave)

router.get('/crew/:id', authentication, leaveController.getCrewLeave)

router.get('/detail/:id', authentication, leaveController.getLeaveDetail)

router.post('/add', authentication, authorization, leaveController.createNewLeave)

router.patch('/update/:id', authentication, authorization, leaveController.updateLeave)

router.delete('/delete/:id', authentication, authorization, leaveController.deleteLeave)
*/
module.exports = router