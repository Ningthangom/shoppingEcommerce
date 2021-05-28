

const { restart } = require('nodemon');
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

    // Create new product that will go to /api/v1/admin/products/new

    exports.newProduct = catchAsyncErrors (async (req,res,next) => {

        
        const product = await Product.create(req.body);
        res.status(201).json({
            success:true,
            product
        })
    })

    // get all products => /api/v1/products?keyword=apple

    exports.getProducts = catchAsyncErrors (async (req, res, next) => {

        // paging the products => 
        // result per page 
        const resPerPage = 4;

        // this will be used in front end and this will show the total number of products
        const productCount = await Product.countDocuments();

        // this will find products with keywords
        const apiFeatures = new APIFeatures(Product.find(),req.query)
                                                .search()
                                                .filter()
                                                .pagination(resPerPage);

        const products = await apiFeatures.query;

        res.status(200).json({
            success: true,
            count: products.length,
            productCount,
            products
        })
    })


    // get one product's details => api/v1/product/:id
    exports.getSingleProduct = catchAsyncErrors (async (req, res, next) => {
       
        const product = await Product.findById(req.params.id);

        // when enter wrong id, unpromise handle error occurs
        if(!product) { 
            return next(new ErrorHandler('Product not found',404))
        }
        res.status(200).json({
            success: true,
            product
        })
    })

        // update product => api/v1/admin/product/:id

        exports.updateProduct = catchAsyncErrors (async (req,res, next) => {
            let product = await Product.findById(req.params.id);

            if(!product) { 
                return next(new ErrorHandler('Product not found',404))
            }
            
            product = await Product.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });

            res.status(200).json({
                success: true,
                product
            })
        })

        // delete product => api/v1/admin/product/:findById
        exports.deleteProduct =catchAsyncErrors(async(req, res, next) => {

            const product = await Product.findById(req.params.id);

            if(!product) { 
                return next(new ErrorHandler('Product not found',404))
            }

            await product.remove();

            res.status(200).json({
                success: true,
                message: 'Product is deleted.'
            })

        })