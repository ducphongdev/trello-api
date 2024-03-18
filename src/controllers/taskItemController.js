import { StatusCodes } from 'http-status-codes'
import { taskItemService } from '~/services/taskItemService'

const createNew = async (req, res, next) => {
  try {
    const cardId = req.params.cardId
    const taskId = req.params.taskId
    const dataCreate = {
      ...req.body,
      cardId,
      taskId
    }
    const createTaskItem = await taskItemService.createNew(dataCreate)
    res.status(StatusCodes.CREATED).json(createTaskItem)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const taskItemId = req.params.taskItemId
    const cardId = req.params.cardId
    const taskId = req.params.taskId

    const updateTaskItem = await taskItemService.update(taskItemId, req.body)
    res.status(StatusCodes.OK).json(updateTaskItem)
  } catch (error) {
    next(error)
  }
}

export const taskItemController = {
  createNew,
  update
}