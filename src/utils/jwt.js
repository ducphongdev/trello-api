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

const createAccessToken = (res, user, expiresIn) => {
  const accessToken = createJwt(user, env.JWT_ACCESS_KEY, expiresIn)

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: env.BUILD_MODE === 'dev' ? 'lax' : 'none',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: env.BUILD_MODE === 'production'
  })

  return accessToken
}

const createRefreshToken = (res, user, expiresIn) => {
  const refreshToken = createJwt(user, env.JWT_REFRESH_KEY, expiresIn)

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: env.BUILD_MODE === 'dev' ? 'lax' : 'none',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    secure: env.BUILD_MODE === 'production'
  })

  return refreshToken
}

const requestRefreshToken = async (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, env.JWT_REFRESH_KEY, (error, user) => {
      if (error) {
        reject(new ApiError(StatusCodes.UNAUTHORIZED, error.message))
      }
      const access_token = createJwt(
        user,
        env.JWT_ACCESS_KEY,
        TOKEN_TIME.ACCESS_TOKEN
      )
      const refresh_token = createJwt(
        user,
        env.JWT_REFRESH_KEY,
        TOKEN_TIME.REFRESH_TOKEN
      )
      resolve({
        access_token,
        refresh_token
      })
    })
  })
}

export const jwtToken = {
  createJwt,
  requestRefreshToken,
  createAccessToken,
  createRefreshToken
}
