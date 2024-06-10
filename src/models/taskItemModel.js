import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { STATE_TASKITEM } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { cardModel } from './cardModel'

// Define Collection (name & schema)
const TASKITEM_COLLECTION_NAME = 'taskItems'
const TASKITEM_COLLECTION_SCHEMA = Joi.object({
  cardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  taskId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().trim().strict(),
  state: Joi.string()
    .valid(STATE_TASKITEM.INCOMPLETE, STATE_TASKITEM.COMPLETE)
    .default(STATE_TASKITEM.INCOMPLETE),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const INVALID_UPDATE_FIELDS = ['id', 'taskId', 'cardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await TASKITEM_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newTaskItemAdd = {
      ...validData,
      cardId: new ObjectId(validData.cardId),
      taskId: new ObjectId(validData.taskId)
    }

    const result = await GET_DB()
      .collection(TASKITEM_COLLECTION_NAME)
      .insertOne(newTaskItemAdd)

    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(TASKITEM_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id)
      })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (taskItemId, updateData) => {
  try {
    // Lọc những field mà không cho phép cập nhật
    Object.keys(updateData).forEach((fileName) => {
      if (INVALID_UPDATE_FIELDS.includes(fileName)) {
        delete updateData[fileName]
      }
    })

    const result = await GET_DB()
      .collection(TASKITEM_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(taskItemId) },
        { $set: updateData },
        { returnDocument: 'after' }
      )
    if (result.state === STATE_TASKITEM.COMPLETE) {
      await GET_DB()
        .collection(cardModel.CARD_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(result.cardId) },
          {
            $inc: {
              'badges.taskItemsChecked': +1
            }
          }
        )
    } else {
      await GET_DB()
        .collection(cardModel.CARD_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(result.cardId) },
          {
            $inc: {
              'badges.taskItemsChecked': -1
            }
          }
        )
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const countDocument = async (cardId) => {
  try {
    return await GET_DB()
      .collection(TASKITEM_COLLECTION_NAME)
      .countDocuments({
        cardId: new ObjectId(cardId)
      })
  } catch (error) {
    throw new Error(error)
  }
}

const countDocumentComplete = async (cardId) => {
  try {
    return await GET_DB()
      .collection(TASKITEM_COLLECTION_NAME)
      .countDocuments({
        cardId: new ObjectId(cardId),
        state: STATE_TASKITEM.COMPLETE
      })
  } catch (error) {
    throw new Error(error)
  }
}

const destroyMany = async (taskId) => {
  try {
    return await GET_DB()
      .collection(TASKITEM_COLLECTION_NAME)
      .deleteMany({ taskId: new ObjectId(taskId) })
  } catch (error) {
    throw new Error(error)
  }
}

export const taskItemModel = {
  TASKITEM_COLLECTION_NAME,
  TASKITEM_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  countDocument,
  countDocumentComplete,
  destroyMany
}
