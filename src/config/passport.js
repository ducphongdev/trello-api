import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../models/userModel'
import { env } from './environment'

const jwtOptions = {
  secretOrKey: env.JWT_ACCESS_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const jwtVerify = async (payload, done) => {
  try {
    const user = await User.findById({ _id: payload.id })
    if (!user) {
      return done(null, false)
    }
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify)
