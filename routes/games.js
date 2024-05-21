const gamesRouter = require('express').Router()

const { findAllGames, createGame, findGameById, updateGame, deleteGame, checkEmptyFields, checkIfUsersAreSafe, checkIfCategoriesAvaliable, checkIsGameExists, checkIsVoteRequest } = require('../middlewares/games')
const { sendAllGames, sendGameCreated, sendGameById, sendGameUpdated, sendGameDeleted } = require('../controllers/games')
const { checkAuth } = require('../middlewares/auth.js')

gamesRouter.get('/games', findAllGames, sendAllGames)
gamesRouter.post(
  '/games',
  checkAuth,
  findAllGames,
  checkEmptyFields,
  checkIfCategoriesAvaliable,
  checkIsGameExists,
  createGame,
  sendGameCreated
)
gamesRouter.get('/games/:id', findGameById, sendGameById)
gamesRouter.put(
  '/games/:id',
  checkAuth,
  findGameById,
  checkIsVoteRequest,
  checkIfUsersAreSafe,
  checkIfCategoriesAvaliable,
  checkEmptyFields,
  updateGame,
  sendGameUpdated
)
gamesRouter.delete('/games/:id', checkAuth, deleteGame, sendGameDeleted)
module.exports = gamesRouter
