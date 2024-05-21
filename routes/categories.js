const categoriesRouter = require('express').Router()

const { findAllCategories, createCategory, findCategoryById, updateCategory, deleteCategory, checkIsCategoryExists, checkEmptyName } = require('../middlewares/categories')
const { sendAllCategories, sendCategoryCreated, sendCategoryById, sendCategoryUpdated, sendCategoryDeleted } = require('../controllers/categories')
const { checkAuth } = require('../middlewares/auth.js')

categoriesRouter.get('/categories', findAllCategories, sendAllCategories)
categoriesRouter.post(
  '/categories',
  checkAuth,
  findAllCategories,
  checkIsCategoryExists,
  checkEmptyName,
  createCategory,
  sendCategoryCreated
)
categoriesRouter.get('/categories/:id', findCategoryById, sendCategoryById)
categoriesRouter.put(
  '/categories/:id',
  checkAuth,
  findCategoryById,
  checkEmptyName,
  updateCategory,
  sendCategoryUpdated
)
categoriesRouter.delete('/categories/:id', checkAuth, deleteCategory, sendCategoryDeleted)
module.exports = categoriesRouter
