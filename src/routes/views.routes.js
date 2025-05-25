const { Router } = require('express');
const viewsController = require('../controllers/views.controller');

const viewsRouter = Router();

viewsRouter.get('/', viewsController.MAIN);
viewsRouter.get('/register', viewsController.REGISTER_PAGE);
viewsRouter.get('/login', viewsController.LOGIN_PAGE);
viewsRouter.get('/admin', viewsController.ADMIN_PAGE);

module.exports = viewsRouter;