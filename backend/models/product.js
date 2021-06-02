           
        const mongoose = require('mongoose');

        const {Schema} = mongoose;

        const productSchema = new Schema({
            name: {
                type: String,
                required: [true, 'Please enter product name'],
                trim: true,
                maxLength: [100, 'Proudct name cannot exceed 100 characters']
            },
            price: {
                type: Number,
                required: [true, 'Please enter product price'],
                trim: true,
                maxLength: [5, 'Proudct name cannot exceed 5 characters'],
                default: 0.0
            },
            description: {
                type: String,
                required: [true, 'Please enter product decription'],
              
            },
            ratings: {
                type: Number,
                default:0
            },
            images: [
                {
                    public_id: {
                        type: String,
                        required: true
                    },
                    url: {
                        type: String,
                        required: true
                    }
                }
            ],
            category: {
                type: String,
                required: [true, "Please enter category for this product"],
                enum: {
                    values: [
                        'Electronics',
                        'Cameras',
                        'Laptops',
                        'Accessories',
                        'Headphones',
                        'Food',
                        'Book',
                        'Clothes/Shoes',
                        'Beauty/Health',
                        'Sports',
                        'Outdoors',
                        'Home'
                    ],
                    message: "please select correct category for product"
                }
            },
            seller: {
                type: String,
                required: [true, 'please enter product seller']
            },
            stock: {
                type: Number,
                required: [true, 'please enter product stock '],
                maxLength: [5, "Proudct name cannot exceed 5 characters "],
                default: 0
            },
            numOfReviews : {
                type: Number,
                default:0
            }, 
            reviews : [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                    required: true
                },
                    name: {
                        type: String,
                        required: true,
                    },
                    rating: {
                        type: Number,
                        required: true
                    }, 
                    comment: {
                        type: String,
                        required: true
                    }
                }
            ],
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            createdAt: {
                type: Date, 
                default: Date.now
            }
        })
      

        module.exports = mongoose.model('Product',productSchema);