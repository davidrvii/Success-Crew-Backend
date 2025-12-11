const router = require('express').Router()
const visitController = require('../controller/visitController')
const { authentication , authorization } = require('../middleware/auth')
/*
router.get('/all', visitController.getAllVisit)

router.get('/detail/:id', authentication, visitController.getVisitDetail)

router.post('/add', authentication, authorization, visitController.createNewVisit)

router.patch('/update/:id', authentication, authorization, visitController.updateVisit)

router.delete('/delete/:id', authentication, authorization, visitController.deleteVisit)
*/
module.exports = router