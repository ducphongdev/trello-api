/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import cors from 'cors'
import passport from 'passport'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_VI } from '~/routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorMiddleware'
import { corsOptions } from './config/cors'
import { jwtStrategy } from './config/passport'

const START_SERVER = () => {
  const app = express()

  app.use(cors(corsOptions))

  app.use(express.json())

  // jwt authentication
  app.use(passport.initialize({}))
  passport.use('jwt', jwtStrategy)

  app.use('/v1', APIs_VI)

  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Hello Duc Phong Dev, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
    )
  })

  exitHook(() => {
    console.log('EXIT APP')
    CLOSE_DB()
  })
}

CONNECT_DB()
  .then(() => console.log('Connect DB To Success'))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(error)
    console.exit(0)
  })
