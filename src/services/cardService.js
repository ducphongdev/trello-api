/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      getNewCard.cards = []
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}