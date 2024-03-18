/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { taskModel } from '~/models/taskModel'


const createNew = async (reqBody) => {
  try {
    const newTask = {
      ...reqBody,
      slug: slugify(reqBody.name)
    }
    const createdTask = await taskModel.createNew(newTask)

    const getTask = await taskModel.findOneById(createdTask.insertedId)

    return getTask
  } catch (error) {
    throw error
  }
}

const update = async (taskId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
      slug: slugify(reqBody.name)
    }

    const updateTask = taskModel.update(taskId, updateData)

    return updateTask
  } catch (error) {
    throw error
  }
}

const destroy = async (taskId) => {
  try {
    await taskModel.destroy(taskId)

    return {
      deleteResult: 'delete Successfully'
    }
  } catch (error) {
    throw error
  }
}


export const taskService = {
  createNew,
  update,
  destroy
}