const express = require('express')
var router = express.Router();
const getRegistration = require('../controller/auth.js');
const getApi = require('../controller/controller.js');
const { checkToken } = require('../auth/tokenValidation')

router.get('/', getRegistration.homepage);
router.get('/register', getRegistration.registraion);
router.get('/login', getRegistration.login);
router.post('/login', getRegistration.handlelogin);
router.post('/post', getRegistration.addNewUser);


//CRUD API
router.post('/api/create', getApi.createNewuser);
router.post('/api/login', getApi.loginApi);
router.get('/api/list', checkToken, getApi.getAll);
router.get('/api/list/:userId', checkToken, getApi.getUserById);
router.put('/api/update/:userId', checkToken, getApi.updateUser);
router.delete('/api/delete/:userId', checkToken, getApi.deleteUser);

module.exports = router;