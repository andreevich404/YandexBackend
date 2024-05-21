const usersRouter = require('express').Router()

const { findAllUsers, createUser, findUserById, updateUser, deleteUser, checkIsUserExists, checkEmptyNameAndEmailAndPassword, checkEmptyNameAndEmail, hashPassword, filterPassword } = require('../middlewares/users')
const { sendAllUsers, sendUserCreated, sendUserById, sendUserUpdated, sendUserDeleted, sendMe } = require('../controllers/users')
const { checkAuth } = require('../middlewares/auth.js')

usersRouter.get('/users', findAllUsers, filterPassword, sendAllUsers)
usersRouter.get('/me', checkAuth, sendMe)
usersRouter.post(
  '/users',
  checkAuth,
  findAllUsers,
  checkEmptyNameAndEmailAndPassword,
  checkIsUserExists,
  hashPassword,
  createUser,
  sendUserCreated
)
usersRouter.get('/users/:id', findUserById, filterPassword, sendUserById)
usersRouter.put(
  '/users/:id',
  checkAuth,
  findUserById,
  checkEmptyNameAndEmail,
  updateUser,
  sendUserUpdated
)
usersRouter.delete('/users/:id', checkAuth, deleteUser, sendUserDeleted)
module.exports = usersRouter
