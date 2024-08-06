/* eslint-disable indent */
import passport from 'passport'

export const middlewareController = {
  verifyToken: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
      if (info && !error) {
        let message
        switch (info.message) {
          case 'No auth token':
            message = 'Please authenticate'
            break
          case 'jwt expired':
            message = 'The token has expired'
            break
          default:
            message = 'The token is invalid'
        }
        return res.status(401).json({ message })
      }
      req.user = user
      next()
    })(req, res, next)
  },

  authAdminMiddleWare: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next()
      } else {
        // eslint-disable-next-line quotes
        return res.status(403).json("You're not allowed to do that!")
      }
    })
  }
}
