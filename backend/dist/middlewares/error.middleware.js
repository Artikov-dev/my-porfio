"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.CustomError = void 0;
const logger_1 = require("../config/logger");
class CustomError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    // body-parser errors (malformed JSON, body over the 1mb limit) carry a 4xx status and a
    // `type`; they are the client's fault, not a server crash
    const bodyParserError = err;
    if ('statusCode' in err && err.isOperational) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (bodyParserError.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Malformed JSON body';
    }
    else if (bodyParserError.type === 'entity.too.large') {
        statusCode = 413;
        message = 'Request body is too large';
    }
    logger_1.logger.log(statusCode >= 500 ? 'error' : 'warn', `[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
