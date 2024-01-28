/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'
import bcrypt from 'bcrypt'
import { jwtToken } from '~/utils/jwt'
import { TOKEN_TIME } from '~/utils/constants'


const login = async (reqBody, res) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Thông tin đăng nhập không đúng')
    }

    const validPassword = bcrypt.compareSync(
      reqBody.password,
      user.password
    )

    if (!validPassword) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Thông tin đăng nhập không đúng')
    }

    jwtToken.attachCookiesToResponse(res, user, TOKEN_TIME.ACCESS_TOKE)
    jwtToken.attachCookiesToResponse(res, user, TOKEN_TIME.REFRESH_TOKE)

    // eslint-disable-next-line no-unused-vars
    const { password, ...infoUser } = user
    return infoUser
  } catch (error) {
    throw error
  }
}

const register = async (reqBody) => {
  try {
    const checkEmail = await userModel.findOneByEmail(reqBody.email)
    if (checkEmail) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Email đã tồn tại')
    }

    const name = reqBody.email.substring(0, reqBody.email.lastIndexOf('@'))

    const newUser = {
      ...reqBody,
      displayName: name,
      role: 'client',
      isActive: false
    }
    const userData = await userModel.createUser(newUser)
    return userData
  } catch (error) {
    throw error
  }
}

export const authService = {
  login,
  register
}