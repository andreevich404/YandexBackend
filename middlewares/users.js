const users = require('../models/user')

const findAllUsers = async (req, res, next) => {
  req.usersArray = await users.find({})
  next()
}

const findUserById = async (req, res, next) => {
  console.log('GET /users/:id')
  try {
    req.user = await users.findById(req.params.id)
    next()
  } catch (error) {
    res.status(404).send({ message: 'User not found' })
  }
}

const createUser = async (req, res, next) => {
  console.log('POST /users')
  try {
    console.log(req.body)
    req.user = await users.create(req.body)
    next()
  } catch (error) {
    res.status(400).send('Error creating user')
  }
}

const updateUser = async (req, res, next) => {
  try {
    req.user = await users.findByIdAndUpdate(req.params.id, req.body)
    next()
  } catch (error) {
    res.status(400).send({ message: 'Ошибка обновления пользователя' })
  }
}

const deleteUser = async (req, res, next) => {
  console.log('DELETE /users/:id')
  try {
    req.user = await users.findByIdAndDelete(req.params.id)
    next()
  } catch (error) {
    res.status(400).send({ message: 'Error deleting user' })
  }
}

const checkEmptyNameAndEmail = async (req, res, next) => {
  if (!req.body.username || !req.body.email) {
    res.status(400).send({ message: 'Введите имя и email' })
  } else {
    next()
  }
}

const checkIsUserExists = async (req, res, next) => {
  const isInArray = req.usersArray.find((user) => {
    return req.body.email === user.email
  })
  if (isInArray) {
    res.status(400).send({ message: 'Пользователь с таким email уже существует' })
  } else {
    next()
  }
}

module.exports = { findAllUsers, findUserById, createUser, updateUser, deleteUser, checkEmptyNameAndEmail, checkIsUserExists }
