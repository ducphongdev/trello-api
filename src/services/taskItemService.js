/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import { taskItemModel } from '~/models/taskItemModel'
import { taskModel } from '~/models/taskModel'

const createNew = async (reqBody) => {
  try {
    const createdTaskItem = await taskItemModel.createNew(reqBody)
    const getTaskItem = await taskItemModel.findOneById(createdTaskItem.insertedId)
    if (getTaskItem) {
      await taskModel.pushTaskItemOrderIds(getTaskItem)
    }
    return getTaskItem
  } catch (error) {
    throw error
  }
}

const update = async (taskItemId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updateTaskItem = await taskItemModel.update(taskItemId, updateData)

    return updateTaskItem
  } catch (error) {
    throw error
  }
}

export const taskItemService = {
  createNew,
  update
}