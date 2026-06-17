const router = require('express').Router()
const notificationController = require('../controller/notificationController')
const { authentication, authorization } = require('../middleware/auth')

router.get('/all', notificationController.getAllNotification)
router.get('/basic/:notificationId', authentication, notificationController.getNotificationBasic)
router.get('/history/:id', authentication, notificationController.getHistoryNotification)
router.get('/detail/:id', authentication, notificationController.getNotificationDetail)

router.post('/add', authentication, authorization, notificationController.createNewNotification)

router.patch('/read/:id', authentication, authorization, notificationController.readNotification)
router.patch('/update/:id', authentication, authorization, notificationController.updateNotification)
router.put('/update/:notificationId', authentication, authorization, notificationController.updateNotificationPut)

router.delete('/delete/:notificationId', authentication, authorization, notificationController.deleteNotification)

module.exports = router