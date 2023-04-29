
const categoriesController = require('../controllers/categoriesControllers');
const passport = require('passport');

module.exports =(app) =>{


    /*
    * POST ROUTES 
    */

    app.post('/api/categories/create',passport.authenticate('jwt', {session:false}), categoriesController.create);


}

