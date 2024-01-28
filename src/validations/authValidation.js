import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const register = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().strict()
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const authValidation = {
  login,
  register
}