const games = require('../models/game')
const { readData, writeData } = require('../utils/data')

const getAllGames = async (req, res, next) => {
  const games = await readData('./data/games.json')
  if (!games) {
    res.status(400)
    res.send({
      status: 'error',
      message: 'Нет игр в базе данных. Добавь игру.'
    })
    return
  }
  req.games = games
  next()
}

const checkIsTitleInArray = (req, res, next) => {
  req.isNew = !req.games.find((item) => item.title === req.body.title)
  next()
}

const updateGamesArray = (req, res, next) => {
  if (req.isNew) {
    const inArray = req.games.map((item) => Number(item.id))
    let maximalId
    if (inArray.length > 0) {
      maximalId = Math.max(...inArray)
    } else {
      maximalId = 0
    }

    req.updatedObject = {
      id: maximalId + 1,
      title: req.body.title,
      image: req.body.image,
      link: req.body.link,
      description: req.body.description
    }
    req.games = [...req.games, req.updatedObject]
    next()
  } else {
    res.status(400)
    res.send({ status: 'error', message: 'Игра с таким именем уже есть.' })
  }
}

const updateGamesFile = async (req, res, next) => {
  await writeData('./data/games.json', req.games)
  next()
}

const findGameById = async (req, res, next) => {
  try {
    req.game = await games
      .findById(req.params.id)
      .populate('categories')
      .populate('user')
    next()
  } catch (error) {
    res.status(404).send({ message: 'Игра не найдена' })
  }
}

const findAllGames = async (req, res, next) => {
  if (req.query['categories.name']) {
    req.gamesArray = await games.findGameByCategory(req.query['categories.name'])
    next()
    return
  }
  req.gamesArray = await games
    .find({})
    .populate('categories')
    .populate({
      path: 'user',
      select: '-password'
    })
  next()
}

const createGame = async (req, res, next) => {
  try {
    req.game = await games.create(req.body)
    next()
  } catch (error) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).send(JSON.stringify({ message: 'Ошибка создания игры' }))
  }
}

const updateGame = async (req, res, next) => {
  try {
    req.game = await games.findByIdAndUpdate(req.params.id, req.body)
    next()
  } catch (error) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).send(JSON.stringify({ message: 'Ошибка обновления игры' }))
  }
}

const deleteGame = async (req, res, next) => {
  try {
    req.game = await games.findByIdAndDelete(req.params.id)
    next()
  } catch (error) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).send(JSON.stringify({ message: 'Ошибка удаления игры' }))
  }
}

const checkEmptyFields = async (req, res, next) => {
  if (req.isVoteRequest) {
    next()
    return
  }
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.image ||
    !req.body.link ||
    !req.body.developer
  ) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).send(JSON.stringify({ message: 'Заполните все поля' }))
  } else {
    next()
  }
}

const checkIfCategoriesAvaliable = async (req, res, next) => {
  if (!req.body.categories || req.body.categories.length === 0) {
    res.setHeader('Content-Type', 'application/json')
    res
      .status(400)
      .send(JSON.stringify({ message: 'Выбери хотя бы одну категорию' }))
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
    res.setHeader('Content-Type', 'application/json')
    res
      .status(400)
      .send(
        JSON.stringify({
          message:
            'Нельзя удалять пользователей или добавлять больше одного пользователя'
        })
      )
  }
}

const checkIsGameExists = async (req, res, next) => {
  const isInArray = req.gamesArray.find((game) => {
    return req.body.title === game.title
  })
  if (isInArray) {
    res.setHeader('Content-Type', 'application/json')
    res
      .status(400)
      .send(
        JSON.stringify({ message: 'Игра с таким названием уже существует' })
      )
  } else {
    next()
  }
}

const checkIsVoteRequest = async (req, res, next) => {
  if (Object.keys(req.body).length === 1 && req.body.users) {
    req.isVoteRequest = true
  }
  next()
}

module.exports = {
  getAllGames,
  checkIsTitleInArray,
  updateGamesArray,
  updateGamesFile,
  findGameById,
  deleteGame,
  findAllGames,
  createGame,
  updateGame,
  checkEmptyFields,
  checkIfCategoriesAvaliable,
  checkIfUsersAreSafe,
  checkIsGameExists,
  checkIsVoteRequest
}
