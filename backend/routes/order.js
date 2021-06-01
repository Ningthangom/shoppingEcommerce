
    const express = require('express');
    const router = express.Router();

    const { 
        newOrder, 
        getSingleOrder,
        myOrders,
        allOrders,
        updateOrder
    
    } = require('../controllers/orderController');

    const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


    router.route('/order/new').post(isAuthenticatedUser, newOrder);
    // router/me has to come first before /:id as it will mess up the id request in controller if put opposit
    router.route('/orders/me').get(isAuthenticatedUser, myOrders );
    router.route('/orders/:id').get(isAuthenticatedUser, getSingleOrder );

    router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), allOrders );
    router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder );





    module.exports = router;
