
let bcrypt = require('bcryptjs');

let hashPassword = (password) => {
    let data = bcrypt.hashSync(password, 8)
    return data
}
let comparePassword = (password, hPassword) => {
    let data = bcrypt.compareSync(password, hPassword)
    return data
}


module.exports = {
    hashPassword,
    comparePassword
}