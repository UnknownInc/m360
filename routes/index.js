const Router = require('express').Router;
const checkAuth = require('../checkAuth');
//import controllers
const userController = require('../controllers/userController.js')
const teamController = require('../controllers/teamController.js')
const questionController = require('../controllers/questionController.js')

const routes = Router();
//routes.get('/', SomeController.getSomeThings);
//routes.get('/:id', SomeController.getSomeThing);
routes.post('/api/register', userController.register);
routes.post('/api/verify', userController.verify);
routes.get('/api/profile', checkAuth, userController.getProfile);


routes.get('/api/team', checkAuth, teamController.getTeam)
routes.post('/api/team', checkAuth, teamController.createTeam)
routes.put('/api/team/:id', checkAuth, teamController.updateTeam)


routes.get('/api/currentquestion', checkAuth, questionController.getCurrentQuestion);
routes.get('/api/questions', checkAuth, questionController.getQuestions)
routes.post('/api/questions', checkAuth, questionController.addQuestions)
routes.put('/api/questions', checkAuth, questionController.updateQuestions)
module.exports = routes;
