import Joi from 'joi'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().strict(),
  slug: Joi.string().required().strict(),
  description: Joi.string().required().strict(),

  columnOrderIds: Joi.array().items(Joi.string()).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  destroy: Joi.boolean().default(false)
})

const boardModal = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA
}