import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { STATE_TASKITEM } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const TASKITEM_COLLECTION_NAME = 'taskItems'
const TASKITEM_COLLECTION_SCHEMA = Joi.object({
  cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  taskId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  name: Joi.string().required().min(3).max(50).trim().strict(),
  state: Joi.string().valid(STATE_TASKITEM.INCOMPLETE, STATE_TASKITEM.COMPLETE).default(STATE_TASKITEM.INCOMPLETE),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// const INVALID_UPDATE_FIELDS = ['id', 'boardId', 'cardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await TASKITEM_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newTaskItemAdd = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }

    return await GET_DB().collection(TASKITEM_COLLECTION_NAME).insertOne(newTaskItemAdd)
  } catch (error) {
    throw new Error(error)
  }
}


const findOneById = async (id) => {
  try {
    return await GET_DB().collection(TASKITEM_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const taskItemModel = {
  TASKITEM_COLLECTION_NAME,
  TASKITEM_COLLECTION_SCHEMA,
  createNew,
  findOneById
}