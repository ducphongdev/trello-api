import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import ApiError from './ApiError'
import { TOKEN_TIME } from './constants'

const createJwt = (user, key, expiresIn) => {
  return jwt.sign(
    {
      id: user?._id,
      name: user?.displayName,
      role: user?.role
    },
    key,
    {
      expiresIn
    }
  )
}

const attachCookiesToResponse = (res, user, expiresIn) => {
  const accessToken = createJwt(user, env.JWT_ACCESS_KEY, expiresIn)
  const refreshToken = createJwt(user, env.JWT_REFRESH_KEY, expiresIn)

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: env.BUILD_MODE === 'dev' ? 'lax' : 'none',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: env.BUILD_MODE === 'production'
  })
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: env.BUILD_MODE === 'dev' ? 'lax' : 'none',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: env.BUILD_MODE === 'production'
  })
}

const requestRefreshToken = async (refreshToken) => {
  try {
    jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (error, user) => {
      if (error) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, error.message)
      }
      const newAccessToken = createJwt(
        user,
        env.JWT_ACCESS_KEY,
        TOKEN_TIME.ACCESS_TOKE
      )
      const newRefreshToken = createJwt(
        user,
        env.JWT_REFRESH_KEY,
        TOKEN_TIME.REFRESH_TOKE
      )

      return {
        newAccessToken,
        newRefreshToken
      }
    })
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, error.message)
  }
}

export const jwtToken = {
  createJwt,
  attachCookiesToResponse,
  requestRefreshToken
}
