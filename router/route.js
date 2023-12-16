import { Router } from "express";

import * as controller from '../controllers/appController.js'

import Auth,{localVariable} from "../middleware/auth.js";

import registermail from "../controllers/mailer.js"

const router = Router()

router.route('/register').post(controller.register)

router.route('/registerMail').post(registermail)

router.route('/authenticate').post(controller.verifyUser,(req,res)=>
{
    res.end()
})

router.route('/login').post(controller.verifyUser, controller.login)


router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get(controller.verifyUser,localVariable,controller.generateOTP)
router.route('/verifyOTP').get(controller.verifyUser ,controller.verifyOTP)
router.route('/createResetSession').get(controller.createResetSession)



router.route('/updateUser').put(Auth,controller.updateUser)
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword)



export default router