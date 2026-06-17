const router = require('express').Router()
const visitorController = require('../controller/visitorController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/all', visitorController.getAllVisitor)
router.get('/detail/:id', authentication, visitorController.getVisitorDetail)
router.post('/add', authentication, authorization, visitorController.createNewVisitor)
router.put('/update/:visitorId', authentication, authorization, visitorController.updateVisitorPut)
router.delete('/delete/:visitorId', authentication, authorization, visitorController.deleteVisitor)

module.exports = router
