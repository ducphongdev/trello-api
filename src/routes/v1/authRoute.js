import express from 'express'
import { authController } from '~/controllers/authController'
import { authValidation } from '~/validations/authValidation'

const Router = express.Router()

Router.route('/login').post(authValidation.login, authController.login)
Router.route('/refresh').post(authController.refresh)

Router.route('/register').post(authValidation.register, authController.register)

Router.route('/logout').post(authController.logout)

export const authRoute = Router
