
    const express = require("express")
    const router = express.Router();


    const {
        getProducts,
        newProduct, 
        getSingleProduct,
        updateProduct, 
        deleteProduct
    } =require('../controllers/productController');




    router.route('/products').get(getProducts);

    //get single product
    router.route('/product/:id').get(getSingleProduct);

     //get single product and update it 
     router.route('/admin/product/:id')
         .put(updateProduct)
         .delete(deleteProduct) ;

    // post  newProduct
    router.route('/admin/product/new').post(newProduct);

    module.exports = router;