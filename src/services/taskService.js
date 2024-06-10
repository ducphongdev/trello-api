/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { taskModel } from '~/models/taskModel'
import { cardModel } from '~/models/cardModel'
import { taskItemModel } from '~/models/taskItemModel'

const createNew = async (reqBody) => {
  try {
    const newTask = {
      ...reqBody,
      slug: slugify(reqBody.name)
    }
    const createdTask = await taskModel.createNew(newTask)

    const getTask = await taskModel.findOneById(createdTask.insertedId)

    if (getTask) {
      await cardModel.pushTaskOrderIds(getTask)
    }

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
    const updateTask = await taskModel.update(taskId, updateData)

    return updateTask
  } catch (error) {
    throw error
  }
}

const destroy = async (taskId) => {
  try {
    const getTask = await taskModel.findOneById(taskId)

    if (getTask) {
      await cardModel.pullTaskOrderIds(getTask)
    }

    await taskModel.destroy(taskId)
    await taskItemModel.destroyMany(taskId)

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
