import express from 'express'
import { boardRoutes } from './boardRoutes'

const Router = express.Router()

Router.use('/boards', boardRoutes)

export const APIs_VI = Router