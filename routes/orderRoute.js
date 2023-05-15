
const ordersController = require('../controllers/ordersController');

const passport = require('passport');

module.exports =(app) =>{


    /*
    * GET ROUTES 
    */
   app.get('/api/orders/findBystatus/:status',passport.authenticate('jwt', {session:false}), ordersController.findByStatus);
   app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status',passport.authenticate('jwt', {session:false}), ordersController.findByDeliveryAndStatus);
   app.get('/api/orders/findByClientAndStatus/:idClient/:status',passport.authenticate('jwt', {session:false}), ordersController.findByClientAndStatus);

    /*
    * POST ROUTES 
    */

    app.post('/api/orders/create',passport.authenticate('jwt', {session:false}), ordersController.create);
    
    
    /*
    * PUT ROUTES 
    */
   
   app.put('/api/orders/updateToDispatched',passport.authenticate('jwt', {session:false}), ordersController.updateToDispatched);
   app.put('/api/orders/updateToOnTheWay',passport.authenticate('jwt', {session:false}), ordersController.updateToOnTheWay);
   app.put('/api/orders/updateTodelivery',passport.authenticate('jwt', {session:false}), ordersController.updateTodelivery);

}

