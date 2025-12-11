const router = require('express').Router()
const visitController = require('../controller/visitController')
const { authentication , authorization } = require('../middleware/auth')

//visit
router.get('/admin', visitController.getAllVisit)

router.get('/detail/:id', authentication, visitController.getVisitDetail)

router.post('/add', authentication, authorization, visitController.createNewVisit)

router.patch('/update/:id', authentication, authorization, visitController.updateVisit)

router.delete('/delete/:id', authentication, authorization, visitController.deleteVisit)

//follow up
router.get('/:id/follow-up', authentication, visitController.getVisitFollowUp)

router.post('/:id/products-sold', authentication, authorization, visitController.createVisitFollowUp)

router.patch('/:id/follow-up/:followUpId', authentication, authorization, visitController.updateVisitFollowUp)

router.delete('/:id/products-sold/:productSoldId', authentication, authorization, visitController.deleteVisitFollowUp)

//product sold
router.get('/:id/products-sold', authentication, visitController.getVisitProductsSold)

router.post('/:id/products-sold', authentication, authorization, visitController.createVisitProductSold)

router.patch('/:id/products-sold/:productSoldId', authentication, authorization, visitController.updateVisitProductSold)

router.delete('/:id/products-sold/:productSoldId', authentication, authorization, visitController.deleteVisitProductSold)


//unit serviced
router.get('/:id/units-serviced', authentication, visitController.getVisitUnitsServiced)

router.post('/:id/units-serviced', authentication, authorization, visitController.createVisitUnitServiced)

router.patch('/:id/units-serviced/:unitServicedId', authentication, authorization, visitController.updateVisitUnitServiced)

router.delete('/:id/units-serviced/:unitServicedId', authentication, authorization, visitController.deleteVisitUnitServiced)

module.exports = router