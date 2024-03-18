import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const INVALID_UPDATE_FIELDS = ['description', 'start', 'due']
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().strict(),
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().optional()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string(),
    boardId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    columnId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().allow(null).default(null),
    start: Joi.string().allow(null),
    due: Joi.string().allow(null),
    dueComplete: Joi.boolean().default(false),
  })
  try {
    const sanitizedData = processFormData(req.body)

    await correctCondition.validateAsync(sanitizedData, { abortEarly: false, allowUnknown: true })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

function processFormData(formData) {
  for (const key in formData) {
    if (INVALID_UPDATE_FIELDS.includes(key)) {
      if (formData[key].trim() === '') {
        formData[key] = null
      }
    }
  }
  return formData
}

export const cardValidation = {
  createNew,
  update
}