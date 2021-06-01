
    const Order = require('../models/order');
    const Product = require('../models/product');

    const ErrorHandler = require('../utils/errorHandler');
    const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const order = require('../models/order');


    // create a new order => /api/v1/order/new
    exports.newOrder = catchAsyncErrors (async (req, res, next) => {
        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo
        } = req.body;

        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            paidAt:Date.now(),
            user: req.user._id
        })

        res.status(200).json({
            success: true,
            order
        })
    })


    // get single order => /api/v1/order/:id
    exports.getSingleOrder = catchAsyncErrors (async (req, res, next) => {
        const order = await Order.findById(req.params.id).populate('user', 'name email')

        if(!order){
            return next(new ErrorHandler('No order found with this Id', 404))

        }

        res.status(200).json({
            success: true,
            order
        })
    })

        // get login user order => /api/v1/order/me
        exports.myOrders = catchAsyncErrors (async (req, res, next) => {
            const orders = await Order.find({user: req.user.id})
       
            res.status(200).json({
                success: true,
                orders
            })
        })

        // get all orders=> /api/v1/admin/orders
        exports.allOrders = catchAsyncErrors (async (req, res, next) => {
            const orders = await Order.find( )
            let totalOrderAmonunt = 0;
            orders.forEach( order => {
                totalOrderAmonunt += order.totalPrice
            })
       
            res.status(200).json({
                success: true,
                totalOrderAmonunt,
                orders
            })
        })


// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false })
}
