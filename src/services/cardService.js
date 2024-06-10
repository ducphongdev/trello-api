/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { getBadgeData } from '~/transformer/card'

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdCard = await cardModel.createNew(newCard)

    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    getNewCard.badges = await getBadgeData(getNewCard)
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

    const resCard = cloneDeep(card)
    resCard.badges = await getBadgeData(card)
    resCard.tasks.forEach((task) => {
      task.taskItems = resCard.taskItems.filter((taskItems) =>
        taskItems.taskId.equals(task._id)
      )
    })
    delete resCard.taskItems

    return resCard
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

    const updateCard = await cardModel.update(cardId, updateData)
    updateCard.badges = await getBadgeData(updateCard)

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
