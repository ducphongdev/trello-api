import express from 'express'
import { columnController } from '~/controllers/columnController'
import { columnValidation } from '~/validations/columnValidation'

const Router = express.Router()


Router.route('/')
  .get((req, res) => {})
  .post(columnValidation.createNew, columnController.createNew)

// Router.route('/:id')
//   .get(boardController.getDetails)
//   .put()

export const columnRoute = Router