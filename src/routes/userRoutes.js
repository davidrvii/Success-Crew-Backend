const router = require('express').Router()
const userController = require('../controller/userController')
const { authentication , authorization } = require('../middleware/auth')
const upload = require('../middleware/multer')

router.get('/all', userController.getAllUser)
router.get('/crew/all', userController.getAllCrew)
router.get('/basic/:userId', authentication, userController.getUserBasic)
router.get('/crew/:userId', authentication, userController.getCrewUserDetail)
router.get('/detail/:userId', authentication, userController.getUserDetail)

router.post('/register', userController.userRegister)
router.post('/login', userController.userLogin)
router.post('/crew/add', authentication, authorization, userController.createCrewUser)

router.patch('/crew/update/:userId', authentication, authorization, userController.updateCrewUser)
router.patch('/update/:userId', authentication, authorization, upload.single('user_image'), userController.updateUser)
router.put('/update/:userId', authentication, authorization, upload.single('user_image'), userController.updateUserPut)

router.delete('/delete/:userId', authentication, authorization, userController.deleteUser)

module.exports = router