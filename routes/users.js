const usersRouter = require('express').Router()

const { findAllUsers, findUserById, createUser, updateUser, deleteUser, checkEmptyNameAndEmail, checkIsUserExists } = require('../middlewares/users')
const { sendAllUsers, sendUserById, sendUserCreated, sendUserUpdated, sendUserDeleted } = require('../controllers/users')

usersRouter.get('/users', findAllUsers, sendAllUsers)
usersRouter.get('/users/:id', findUserById, sendUserById)
usersRouter.post('/users', findAllUsers, checkIsUserExists, checkEmptyNameAndEmail, createUser, sendUserCreated)
usersRouter.put('/users/:id', checkEmptyNameAndEmail, updateUser, sendUserUpdated)
usersRouter.delete('/users/:id', deleteUser, sendUserDeleted)

module.exports = usersRouter
