
const addressController = require('../controllers/addressController');
const categoriesController = require('../controllers/addressController');
const passport = require('passport');

module.exports =(app) =>{


    /*
    * GET ROUTES 
    */
    app.get('/api/address/findByUser/:id_user',passport.authenticate('jwt', {session:false}), addressController.findByUser);

    /*
    * POST ROUTES 
    */

    app.post('/api/address/create',passport.authenticate('jwt', {session:false}), addressController.create);


}

