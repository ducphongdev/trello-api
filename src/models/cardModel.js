import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { taskModel } from './taskModel'
import { taskItemModel } from './taskItemModel'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  slug: Joi.string().required().strict(),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().allow(null),
  comments: Joi.array().items(
    Joi.object({
      userId: Joi.string(),
      userEmail: Joi.string(),
      userAvatar: Joi.string(),
      userDisplayName: Joi.string(),
      content: Joi.string(),
      createAt: Joi.date().timestamp('javascript').default(Date.now)
    })
  ),

  start: Joi.string().allow(null).default(null),
  due: Joi.string().allow(null).default(null),
  dueComplete: Joi.boolean().default(false),

  taskOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['id', 'boardId', 'createdAt']
const UPDATE_FIELDS_BADGES = ['description', 'start', 'due', 'dueComplete']

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    // Biển đổi một số dữ liệu liên quan đến ObjectId
    const newCardToAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }

    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(newCardToAdd)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (cardId, updateData) => {
  try {
    // Lọc những field mà không cho phép cập nhật
    Object.keys(updateData).forEach((fileName) => {
      if (INVALID_UPDATE_FIELDS.includes(fileName)) {
        delete updateData[fileName]
      }
    })

    if (updateData.taskOrderIds) {
      updateData.taskOrderIds = updateData.taskOrderIds.map(
        (_id) => new ObjectId(_id)
      )
    }

    if (updateData.columnId)
      updateData.columnId = new ObjectId(updateData.columnId)

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: 'columnId',
            foreignField: '_id',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: taskModel.TASK_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'cardId',
            as: 'tasks'
          }
        },
        {
          $lookup: {
            from: taskItemModel.TASKITEM_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'cardId',
            as: 'taskItems'
          }
        },
        {
          // eslint-disable-next-line quotes
          $unwind: '$columns' // Giải phóng mảng 'columns' thành các bản ghi riêng lẻ
        },
        {
          $limit: 1 // Giới hạn kết quả trả về chỉ một bản ghi
        }
      ])
      .toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

// Push một taskId vào cuối bảng taskOrderIds
const pushTaskOrderIds = async (task) => {
  try {
    return (
      (await GET_DB()
        .collection(CARD_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(task.cardId) },
          { $push: { taskOrderIds: new ObjectId(task._id) } },
          { returnDocument: 'after' }
        ).value) || null
    )
  } catch (error) {
    throw new Error(error)
  }
}

const pullTaskOrderIds = async (task) => {
  try {
    return (
      (await GET_DB()
        .collection(CARD_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(task.cardId) },
          { $pull: { taskOrderIds: new ObjectId(task._id) } }
        ).value) || null
    )
  } catch (error) {
    throw new Error(error)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  getDetails,
  pushTaskOrderIds,
  pullTaskOrderIds
}
