/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
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

const getDetails = async (cardId) => {
  try {
    const card = await cardModel.getDetails(cardId)

    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found')
    }

    return card
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updateCard = cardModel.update(cardId, updateData)

    return updateCard
  } catch (error) {
    throw error
  }
}

const partialUpdate = async (cardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updateCard = cardModel.partialUpdate(cardId, updateData)

    return updateCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  getDetails,
  update
}