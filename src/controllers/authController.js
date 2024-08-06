import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'

const login = async (req, res, next) => {
  try {
    const authLogin = await authService.login(req.body, res)
    res.status(StatusCodes.OK).json(authLogin)
  } catch (error) {
    next(error)
  }
}

const refresh = async (req, res, next) => {
  try {
    const refresh_token = req.body.refresh_token
    if (!refresh_token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid refresh token')
    }
    const response = await authService.processNewToken(refresh_token)
    res.status(StatusCodes.OK).json({
      ...response
    })
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

const logout = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully!' })
  } catch (error) {
    next(error)
  }
}

export const authController = {
  login,
  refresh,
  register,
  logout
}
