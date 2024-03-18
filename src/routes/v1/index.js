import express from 'express'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { authRoute } from './authRoute'
import { taskRoute } from './taskRoute'

const Router = express.Router()

Router.use('/boards', boardRoute)
Router.use('/columns', columnRoute)
Router.use('/cards', cardRoute)
Router.use('/tasks', taskRoute)

Router.use('/auth', authRoute)

export const APIs_VI = Router