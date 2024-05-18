const { writeData } = require('../utils/data')

const addGameController = async (req, res) => {
  req.isNew = !req.games.find((item) => item.title === req.body.title)
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
  } else {
    res.status(400)
    res.send({ status: 'error', message: 'Игра с таким именем уже есть.' })
    return
  }
  await writeData('./data/games.json', req.games)
  res.send({ games: req.games, updated: req.updatedObject })
}

const sendAllGames = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(req.gamesArray))
}

const deleteGame = async (req, res) => {
  const id = Number(req.params.id)
  req.game = req.games.find((item) => item.id === id)

  const index = req.games.findIndex((item) => item.id === req.game.id)
  req.games.splice(index, 1)

  await writeData('./data/games.json', req.games)

  res.send({
    games: req.games,
    updated: req.game
  })
}

const sendUpdatedGames = (req, res) => {
  res.send({
    games: req.games,
    updated: req.updatedObject
  })
}

const sendGameCreated = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(req.game))
}

const sendGameById = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(req.game))
}

const sendGameUpdated = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.status(200).send(JSON.stringify({ message: 'Игра обновлена' }))
}

const sendGameDeleted = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(req.game))
}

module.exports = {
  sendAllGames,
  deleteGame,
  addGameController,
  sendUpdatedGames,
  sendGameCreated,
  sendGameById,
  sendGameUpdated,
  sendGameDeleted
}
