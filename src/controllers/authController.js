import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'


const login = async (req, res, next) => {
  try {
    const authLogin = await authService.login(req.body, res)
    res.status(StatusCodes.OK).json(authLogin)
  } catch (error) {
    next(error)
  }
}


const register = async (req, res, next) => {
  try {
    const authRegister = await authService.register(req.body)
    res.status(StatusCodes.OK).json(authRegister)
  } catch (error) {
    next(error)
  }
}

export const authController = {
  login,
  register
}