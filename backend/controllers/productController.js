

    const { restart } = require('nodemon');
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')

    // Create new product that will go to /api/v1/admin/products/new

    exports.newProduct = async (req,res,next) => {
        const product = await Product.create(req.body);
        res.status(201).json({
            success:true,
            product
        })
    }

    // get all products => /api/v1/products

    exports.getProducts =async (req, res, next) => {

        const products = await Product.find();

        res.status(200).json({
            success: true,
            count: products.length,
            products
        })
    }


    // get one product's details => api/v1/product/:id
    exports.getSingleProduct = async (req, res, next) => {
        const product = await Product.findById(req.params.id);

        // when enter wrong id, unpromise handle error occurs
        if(!product) { 
            return next(new ErrorHandler('Product not found',404))
        }
        res.status(200).json({
            success: true,
            product
        })
    }

        // update product => api/v1/admin/product/:id

        exports.updateProduct = async (req,res, next) => {
            let product = await Product.findById(req.params.id);

            if(!product) { 
                return res.status(404).json({
                    success: false,
                    message: 'product not found'
                })
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
        }

        // delete product => api/v1/admin/product/:findById
        exports.deleteProduct = async(req, res, next) => {

            const product = await Product.findById(req.params.id);

            if(!product) { 
                return res.status(404).json({
                    success: false,
                    message: 'product not found'
                })
            }

            await product.remove();

            res.status(200).json({
                success: true,
                message: 'Product is deleted.'
            })

        }