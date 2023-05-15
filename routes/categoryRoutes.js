
const categoriesController = require('../controllers/categoriesControllers');
const passport = require('passport');

module.exports =(app) =>{


    /*
    * GET ROUTES 
    */
   app.get('/api/categories/getAll',passport.authenticate('jwt', {session:false}), categoriesController.getAll);

    /*
    * POST ROUTES 
    */

    app.post('/api/categories/create',passport.authenticate('jwt', {session:false}), categoriesController.create);


}

