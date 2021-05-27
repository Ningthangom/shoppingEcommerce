
    // error handler class 

    // Error is parent class and ErrorHandler is child class 
    // the class below inheritants class
    class ErrorHandler extends Error {
        constructor(message, statusCode){
            // super stands for contructor of parent class: meaning it represent Error (parent class)
            super(message);
            this.statusCode = statusCode;

            //the error function will create dotstack properties on this object
            // this is object and this.constructor is object contructor
            Error.captureStackTrace(this, this.constructor)
        }
    }

    module.exports = ErrorHandler;