
    const express = require("express")
    const router = express.Router();


    const {
        getProducts,
        newProduct, 
        getSingleProduct,
        updateProduct, 
        deleteProduct
    } =require('../controllers/productController');

    const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');





    router.route('/products').get( isAuthenticatedUser, getProducts);

    //get single product
    router.route('/product/:id').get(getSingleProduct);

     //get single product and update it 
     router.route('/admin/product/:id')
         .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
         .delete(isAuthenticatedUser, authorizeRoles('admin'),  deleteProduct) ;

    // post  newProduct
    router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'),  newProduct);

    module.exports = router;