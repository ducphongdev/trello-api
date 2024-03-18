/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { taskItemModel } from '~/models/taskItemModel'


const createNew = async (reqBody) => {
  try {
    const createdTaskItem = await taskItemModel.createNew(reqBody)
    const getTaskItem = await taskItemModel.findOneById(createdTaskItem.insertedId)

    return getTaskItem
  } catch (error) {
    throw error
  }
}


export const taskItemService = {
  createNew
}