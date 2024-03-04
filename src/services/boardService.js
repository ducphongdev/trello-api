/* eslint-disable no-useless-catch */
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'


const createNew = async (reqBody) => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getAll = async () => {
  try {
    const allBoard = await boardModel.getAll()

    return allBoard
  } catch (error) {
    throw error
  }
}

const getAllByName = async (userName) => {
  try {
    const allBoardOfUser = await boardModel.findAllByName(userName)

    return allBoardOfUser
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)

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

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updateAt: Date.now()
    }
    const updateBoard = boardModel.update(boardId, updateData)

    return updateBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    // Cập nhật mảng cardOrderIds của Column ban đầu chứa nó
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updateAt: Date.now()
    })
    // Cập nhật mảng cardOrderIds của Column mới chứ nó
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now()
    })
    // Cập nhật lại trường columnId mới của card đã kéo
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return {
      updateResult: 'Update Successfully'
    }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getAll,
  getAllByName,
  getDetails,
  update,
  moveCardToDifferentColumn
}