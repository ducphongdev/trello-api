import express from 'express'
import { cardController } from '~/controllers/cardController'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()


Router.route('/')
  .get((req, res) => {})
  .post(cardValidation.createNew, cardController.createNew)

// Router.route('/:id')
//   .get(boardController.getDetails)
//   .put()

export const cardRoute = Router