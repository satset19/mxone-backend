function errorHandler(err, req, res, next) {
    console.log(err)
    let { name } = err
    let code = null
    let message = ''


    switch (name) {
        case "InvalidCredentials":
            code = 401
            message = 'invalid email or password'
            break
        case "SequelizeUniqueConstraintError":
            code = 400
            message = err.errors[0].message
            break
        case "SequelizeValidationError":
            code = 400
            message = err.errors[0].message
            break
        case "Unauthorized":
            code = 401
            message = 'Please login first'
            break
        case "JsonWebTokenError":
            code = 401
            message = 'Auth'
            break

        default:
            code = 500
            message = 'Internal server error'
    }
    res.status(code).json({ message })
}

module.exports = errorHandler