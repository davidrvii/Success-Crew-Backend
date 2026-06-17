const router = require('express').Router();

const userRoutes = require('./userRoutes')
const notificationRoutes =  require('./notificationRoutes')
const attendanceRoutes = require('./attendanceRoutes')
const leaveRoutes = require('./leaveRoutes')
const overtimeRoutes = require('./overtimeRoutes')
const visitRoutes = require('./visitRoutes')
const visitorRoutes = require('./visitorRoutes')
const outOfOfficeRoutes = require('./outOfOfficeRoutes')
const followUpRoutes = require('./followUpRoutes')
const productSoldRoutes = require('./productSoldRoutes')
const unitServicedRoutes = require('./unitServicedRoutes')

router.get('/', (req, res) => {
    res.send("Welcome to Success Crew <br><br> -Success Comp-")
});

router.use('/user', userRoutes)
router.use('/notification',notificationRoutes)
router.use('/attendance',attendanceRoutes)
router.use('/leave', leaveRoutes)
router.use('/leaves', leaveRoutes)
router.use('/overtime', overtimeRoutes)
router.use('/visit', visitRoutes)
router.use('/visitor', visitorRoutes)
router.use('/out-of-office', outOfOfficeRoutes)
router.use('/outofoffice', outOfOfficeRoutes)
router.use('/follow-up', followUpRoutes)
router.use('/product-sold', productSoldRoutes)
router.use('/unit-serviced', unitServicedRoutes)

module.exports = router;