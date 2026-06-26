const router = require('express').Router()
const attendanceController = require('../controller/attendanceController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/all', attendanceController.getAllAttendance)
router.get('/basic', authentication, attendanceController.getAttendanceBasic)
router.get('/crew/summary/:userId', authentication, attendanceController.getCrewAttendanceSummary)
router.get('/crew/:userId', authentication, attendanceController.getCrewAttendance)
router.get('/detail/:id', authentication, attendanceController.getAttendanceDetail)

router.post('/add', authentication, authorization, attendanceController.createNewAttendance)

router.patch('/checkin', authentication, authorization, attendanceController.patchCheckin)
router.patch('/checkout', authentication, authorization, attendanceController.patchCheckout)

router.put('/update/:attendanceId', authentication, authorization, attendanceController.updateAttendancePut)

router.delete('/delete/:attendanceId', authentication, authorization, attendanceController.deleteAttendance)

module.exports = router