/* eslint-disable no-useless-catch */
import lodash, { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'
import { boardModal } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModal.createNew(newBoard)

    const getNewBoard = await boardModal.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModal.getDetails(boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    // resBoard.columns.forEach((column) => {
    //   column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    // })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}