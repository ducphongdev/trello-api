import express from 'express'
import { cardController } from '~/controllers/cardController'
import { taskItemController } from '~/controllers/taskItemController'
import { cardValidation } from '~/validations/cardValidation'
import { taskItemValidation } from '~/validations/taskItemValidation'

const Router = express.Router()

Router.route('/').post(cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .get(cardController.getDetails)
  .put(cardValidation.update, cardController.update)

Router.route('/:cardId/task/:taskId/taskItem').post(
  taskItemValidation.createNew,
  taskItemController.createNew
)

Router.route('/:cardId/task/:taskId/taskItem/:taskItemId').put(
  taskItemValidation.update,
  taskItemController.update
)

export const cardRoute = Router
