import Joi from 'joi'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { GET_DB } from '~/config/mongodb'
import { USER_ROLES } from '~/utils/constants'
import { PASSWORD_REGEX } from '~/utils/validators'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(PASSWORD_REGEX).min(8).required(),
  displayName: Joi.string(),
  avatar: Joi.any(),
  role: Joi.string().valid(USER_ROLES.ADMIN, USER_ROLES.CLIENT).default(USER_ROLES.CLIENT).required(),
  isActive: Joi.bool().default(false).required(),
  verifyToken: Joi.string().token()
})

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createUser = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(validData.password, salt)

    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne({
      ...validData,
      password: hashPassword
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (email) => {
  try {
    return await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email
    })
  } catch (error) {
    throw new Error(error)
  }
}


export const userModel = {
  createUser,
  findOneById,
  findOneByEmail
}