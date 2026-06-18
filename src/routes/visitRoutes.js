const router = require('express').Router()
const visitController = require('../controller/visitController')
const { authentication , authorization } = require('../middleware/auth')

//visit
router.get('/all', visitController.getAllVisit)
router.get('/list', visitController.getVisitList)
router.get('/stats', visitController.getVisitStats)
router.get('/count/daily', visitController.getVisitStats)
router.get('/count/weekly', visitController.getVisitStats)
router.get('/rushhour', visitController.getVisitStats)
router.get('/detail/:visitId', authentication, visitController.getVisitDetail)

router.post('/add', authentication, authorization, visitController.createNewVisit)

router.put('/update/:visitId', authentication, authorization, visitController.updateVisitPut)
router.patch('/update/:visitId', authentication, authorization, visitController.updateVisitPut)

router.delete('/delete/:visitId', authentication, authorization, visitController.deleteVisit)
module.exports = router