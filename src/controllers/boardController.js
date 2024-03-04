import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'


const createNew = async (req, res, next) => {
  try {
    const createBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createBoard)
  } catch (error) {
    next(error)
  }
}

const getAll = async (req, res, next) => {
  try {
    const allBoard = await boardService.getAll(req.body)
    res.status(StatusCodes.OK).json(allBoard)
  } catch (error) {
    next(error)
  }
}

const getAllByName = async (req, res, next) => {
  try {
    const allBoardOfUser = await boardService.getAllByName(req.params.name)
    res.status(StatusCodes.OK).json(allBoardOfUser)
  } catch (error) {
    next(error)
  }
}


const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updateBoard = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) {
    next(error)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const updateBoard = await boardService.moveCardToDifferentColumn(req.body)
    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  getAll,
  getAllByName,
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}