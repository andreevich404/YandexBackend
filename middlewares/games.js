const games = require('../models/game')

const findAllGames = async (req, res, next) => {
  console.log('GET /games')
  req.gamesArray = await games.find({}).populate('categories')
    .populate({
      path: 'users',
      select: '-password'
    })
  next()
}

const findGameById = async (req, res, next) => {
  try {
    req.game = await games
      .findById(req.params.id)
      .populate('categories')
      .populate('users')
    next()
  } catch (error) {
    res.status(404).send({ message: 'Игра не найдена' })
  }
}

const createGame = async (req, res, next) => {
  console.log('POST /games')
  try {
    console.log(req.body)
    req.game = await games.create(req.body)
    next()
  } catch (error) {
    res.status(400).send('Error creating game')
  }
}

const updateGame = async (req, res, next) => {
  try {
    req.game = await games.findByIdAndUpdate(req.params.id, req.body)
    next()
  } catch (error) {
    res.status(400).send({ message: 'Ошибка обновления игры' })
  }
}

const deleteGame = async (req, res, next) => {
  try {
    req.game = await games.findByIdAndDelete(req.params.id)
    next()
  } catch (error) {
    res.status(400).send({ message: 'Error deleting game' })
  }
}

const checkEmptyFields = async (req, res, next) => {
  if (!req.body.title || !req.body.description || !req.body.image || !req.body.link || !req.body.developer) {
    res.status(400).send({ message: 'Заполни все поля' })
  } else {
    next()
  }
}

const checkIfCategoriesAvaliable = async (req, res, next) => {
  if (!req.body.categories || req.body.categories.length === 0) {
    res.headers = { 'Content-Type': 'application/json' }
    res.status(400).send({ message: 'Выбери хотя бы одну категорию' })
  } else {
    next()
  }
}

const checkIfUsersAreSafe = async (req, res, next) => {
  if (!req.body.users) {
    next()
    return
  }
  if (req.body.users.length - 1 === req.game.users.length) {
    next()
  } else {
    res.status(400).send('Нельзя удалять пользователей или добавлять больше одного пользователя')
  }
}

const checkIsGameExists = async (req, res, next) => {
  const isInArray = req.gamesArray.find((game) => {
    return req.body.title === game.title
  })
  if (isInArray) {
    res.status(400).send({ message: 'Игра с таким названием уже существует' })
  } else {
    next()
  }
}

module.exports = { findAllGames, findGameById, createGame, updateGame, deleteGame, checkEmptyFields, checkIfCategoriesAvaliable, checkIfUsersAreSafe, checkIsGameExists }
