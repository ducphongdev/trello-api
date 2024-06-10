import { StatusCodes } from 'http-status-codes'
import { taskService } from '~/services/taskService'

const createNew = async (req, res, next) => {
  try {
    const createTask = await taskService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createTask)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const taskId = req.params.id

    const updateTask = await taskService.update(taskId, req.body)
    res.status(StatusCodes.OK).json(updateTask)
  } catch (error) {
    next(error)
  }
}

const destroy = async (req, res, next) => {
  try {
    const taskId = req.params.id

    const updateTask = await taskService.destroy(taskId)
    res.status(StatusCodes.OK).json(updateTask)
  } catch (error) {
    next(error)
  }
}

export const taskController = {
  createNew,
  update,
  destroy
}
