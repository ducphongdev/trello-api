import express from 'express'
import { taskController } from '~/controllers/taskController'
import { taskValidation } from '~/validations/taskValidation'

const Router = express.Router()


Router.route('/')
  .post(taskValidation.createNew, taskController.createNew)

Router.route('/:id')
  // .get(taskController.getDetails)
  .put(taskValidation.update, taskController.update)
  .delete(taskController.destroy)

export const taskRoute = Router