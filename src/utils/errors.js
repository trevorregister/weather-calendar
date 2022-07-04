const codes = require('./httpStatusCodes')

class BaseError extends Error {
    constructor (name, statusCode, isOperational, description) {
    super(description)
   
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = name
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this)

    }
}
   
class api400 extends BaseError {
    constructor (
        name,
        statusCode = codes.BAD_REQUEST,
        description = 'Bad request',
        isOperational = true
    )

    {super (name, statusCode, isOperational, description)}
}

class api401 extends BaseError {
    constructor (
        name,
        statusCode = codes.UNAUTHORIZED,
        description = 'Unauthorized',
        isOperational = true
    )

    {super (name, statusCode, isOperational, description)}
}

class api403 extends BaseError {
    constructor (
        name,
        statusCode = codes.FORBIDDEN,
        description = 'Forbidden',
        isOperational = true
    )

    {super (name, statusCode, isOperational, description)}
}

class api404 extends BaseError {
    constructor (
        name,
        statusCode = codes.NOT_FOUND,
        description = 'Not found',
        isOperational = true
    )

    {super (name, statusCode, isOperational, description)}
}

class api500 extends BaseError {
    constructor (
        name,
        statusCode = codes.INTERNAL_SERVER,
        description = 'Internal server error',
        isOperational = true
    )

    {super ( name, statusCode, isOperational, description)}
}

module.exports = {
    api400,
    api401, 
    api403, 
    api404, 
    api500
}
