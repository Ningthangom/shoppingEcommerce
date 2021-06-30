
    const express = require("express")
    const router = express.Router();


    const {
        getProducts,
        getAdminProducts,
        newProduct, 
        getSingleProduct,
        updateProduct, 
        deleteProduct,
        createProductReview,
        getProductReviews,
        deleteProductReviews
    } =require('../controllers/productController');

    const {isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');





    router.route('/products').get(getProducts);
    router.route('/admin/products').get(getAdminProducts);

    //get single product
    router.route('/product/:id').get(getSingleProduct);

     //get single product and update it 
     router.route('/admin/product/:id')
         .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
         .delete(isAuthenticatedUser, authorizeRoles('admin'),  deleteProduct) ;

    // post  newProduct
    router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'),  newProduct);

    //rating product
    router.route('/reviews').get(isAuthenticatedUser,getProductReviews)
                                        .delete(isAuthenticatedUser, deleteProductReviews)
    router.route('/review').put(isAuthenticatedUser, createProductReview)
 

  

    module.exports = router;