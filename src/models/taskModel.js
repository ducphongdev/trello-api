import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const TASK_COLLECTION_NAME = 'tasks'
const TASK_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  name: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé
  taskOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['id', 'boardId', 'cardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await TASK_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newTaskAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }

    return await GET_DB().collection(TASK_COLLECTION_NAME).insertOne(newTaskAdd)
  } catch (error) {
    throw new Error(error)
  }
}


const findOneById = async (id) => {
  try {
    return await GET_DB().collection(TASK_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (taskId, updateData) => {
  try {
    // Lọc những field mà không cho phép cập nhật
    Object.keys(updateData).forEach(fileName => {
      if (INVALID_UPDATE_FIELDS.includes(fileName)) {
        delete updateData[fileName]
      }
    })

    return await GET_DB().collection(TASK_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
  } catch (error) {
    throw new Error(error)
  }
}

const destroy = async (taskId) => {
  try {
    return await GET_DB().collection(TASK_COLLECTION_NAME).deleteOne(
      { _id: new ObjectId(taskId) }
    )
  } catch (error) {
    throw new Error(error)
  }
}

export const taskModel = {
  TASK_COLLECTION_NAME,
  TASK_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  destroy
}