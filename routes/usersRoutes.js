const usersController = require('../controllers/usersController');
const UsersController = require('../controllers/usersController');
const passport = require('passport');


module.exports=(app,upload) =>{


    //Llama los datos de la BD
    app.get('/api/users/getAll', usersController.getAll);
    app.get('/api/users/findById/:id', passport.authenticate('jwt', {session: false}), usersController.findById);

    //Guarda los datos del usuario
    app.post('/api/users/create', upload.array('image',1), usersController.registerWithImage);
    app.post('/api/users/login', usersController.login);
    app.post('/api/users/logout', usersController.logout);

    //Actualizar Datos
    app.put('/api/users/update', passport.authenticate('jwt', {session: false}), upload.array('image',1), usersController.update);
}