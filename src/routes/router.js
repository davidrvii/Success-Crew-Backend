const router = require('express').Router();

const userRoutes = require('./userRoutes')
const notificationRoutes =  require('./notificationRoutes')
const attendanceRoutes = require('./attendanceRoutes')
const leaveRoutes = require('./leaveRoutes')
const overtimeRoutes = require('./overtimeRoutes')
const visitRoutes = require('./visitRoutes')

router.get('/', (req, res) => {
    res.send("Welcome to Success Crew <br><br> -Success Comp-")
});

router.use('/user', userRoutes)
router.use('/notification',notificationRoutes)
router.use('./attendance',attendanceRoutes)
router.use('./leave', leaveRoutes)
router.use('./overtime', overtimeRoutes)
router.use('./visit', visitRoutes)

module.exports = router;