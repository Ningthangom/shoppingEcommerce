

const { restart } = require('nodemon');
const Product = require('../models/product')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')
const cloudinary = require('cloudinary')

    // Create new product that will go to /api/v1/admin/products/new

    exports.newProduct = catchAsyncErrors (async (req,res,next) => {

        let images =  []

        // the following if statement will check if the user upload only one image or more 
        // push an image into images 
        if(typeof req.body.images === 'string'){
            images.push(req.body.images)
        }else{
            images = req.body.images
        }
        let imagesLinks = [];
        for(let i = 0; i < images.length; i++) { 
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder:'products'
            })
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

        req.body.user = req.user.id;
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
        const resPerPage = 8;

        // this will be used in front end and this will show the total number of products
        const productsCount = await Product.countDocuments();

        // this will find products with keywords
        const apiFeatures = new APIFeatures(Product.find(),req.query)
                                                .search()
                                                .filter()
                                                

        let products = await apiFeatures.query;
        let filteredProductsCount = products.length;

        apiFeatures.pagination(resPerPage);

     products = await apiFeatures.query;

       
            res.status(200).json({
                success: true,
                productsCount,
                resPerPage,
                filteredProductsCount,
                products
            })
   
    })

        // get all products for admin=> /api/v1/admin/products

        exports.getAdminProducts = catchAsyncErrors (async (req, res, next) => {
       const   products = await Product.find();
                res.status(200).json({
                    success: true,
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
            let images =  []

            // the following if statement will check if the user upload only one image or more 
            // push an image into images 
            if(typeof req.body.images === 'string'){
                images.push(req.body.images)
            }else{
                images = req.body.images
            }
            if(images !== undefined){
                   // deleting images associated with the products 
            for(let i = 0; i <product.images.length; i++) {
                const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            }
            
            let imagesLinks = [];
            for(let i = 0; i < images.length; i++) { 
                const result = await cloudinary.v2.uploader.upload(images[i], {
                    folder:'products'
                })
                imagesLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            }
    
            req.body.images = imagesLinks
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

            // deleting images associated with the products 
            for(let i = 0; i <product.images.length; i++) {
                const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
            }

            await product.remove();

            res.status(200).json({
                success: true,
                message: 'Product is deleted.'
            })

        })


// Create new review   =>   /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

        // get product reviews => /api/v1/reviews

        exports.getProductReviews = catchAsyncErrors (async (req, res, next) => {
            const product = await Product.findById(req.query.id);

            res.status(200).json({
                success: true,
                reviews: product.reviews
            })
        })  

             // delete product reviews => /api/v1/reviews

    exports.deleteProductReviews = catchAsyncErrors (async (req, res, next) => {
                const product = await Product.findById(req.query.productId);
                
            
               const reqid = req.query;
               /*  console.log(reviews); */


                const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
                
                const numOfReviews = reviews.length;
              
                const ratings = product.reviews.reduce((acc, item)=> item.rating+acc, 0)/reviews.length;
                
                await Product.findByIdAndUpdate(req.query.productId, {
                    reviews,
                    ratings,
                    numOfReviews
                },{
                    new: true,
                    runValidators: true,
                    useFindAndModify: false
                })
                res.status(200).json({
                    success: true,
                })
            })  