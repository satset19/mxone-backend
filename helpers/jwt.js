let jwt = require('jsonwebtoken');

let createToken = (payload) => {
    let data = jwt.sign(payload, process.env.SECRET)
    return data
}
let verifyToken = (payload) => {
    let data = jwt.verify(payload, process.env.SECRET)
    return data
}

module.exports = {
    createToken,
    verifyToken
}