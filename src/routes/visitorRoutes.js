const router = require('express').Router()
const visitorController = require('../controller/visitorController')
const { authentication , authorization } = require('../middleware/auth')

router.get('/admin', visitorController.getAllVisitor)
router.get('/detail/:id', authentication, visitorController.getVisitorDetail)
router.post('/add', authentication, authorization, visitorController.createNewVisitor)

module.exports = router
