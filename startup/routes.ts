import express, { Application } from 'express'
import error from '../middleware/error'
import auth from '../routes/auth'
import users from '../routes/users'
import payments from '../routes/payments'

export default function(app: Application) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/api/auth', auth)
  app.use('/api/users', users)
  app.use('/api/payments', payments)
  app.use(error)
}
