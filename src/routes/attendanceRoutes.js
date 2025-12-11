const router = require('express').Router()
const attendanceController = require('../controller/attendanceController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/admin', attendanceController.getAllAttendance)

router.get('/crew/:id', authentication, attendanceController.getCrewAttendance)

router.get('/detail/:id', authentication, attendanceController.getAttendanceDetail)

router.post('/check-in', authentication, authorization, attendanceController.createNewAttendance)

router.patch('/check-out/:id', authentication, authorization, attendanceController.updateAttendance)

router.delete('/delete/:id', authentication, authorization, attendanceController.deleteAttendance)

module.exports = router