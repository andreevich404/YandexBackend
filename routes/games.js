const gamesRouter = require('express').Router()

const { findAllGames, findGameById, createGame, updateGame, deleteGame, checkEmptyFields, checkIfCategoriesAvaliable, checkIfUsersAreSafe, checkIsGameExists } = require('../middlewares/games')
const { sendAllGames, sendGameById, sendGameCreated, sendGameUpdated, sendGameDeleted } = require('../controllers/games')

gamesRouter.get('/games', findAllGames, sendAllGames)
gamesRouter.get('/games/:id', findGameById, sendGameById)
gamesRouter.post('/games', findAllGames, checkIsGameExists, checkIfCategoriesAvaliable, checkEmptyFields, createGame, sendGameCreated)
gamesRouter.put('/games/:id', findGameById, checkIfUsersAreSafe, checkIfCategoriesAvaliable, checkEmptyFields, updateGame, sendGameUpdated)
gamesRouter.delete('/games/:id', deleteGame, sendGameDeleted)

module.exports = gamesRouter
