const { comparePassword } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
let { User } = require('../models/');

class userController {
    static async register(req, res, next) {
        try {
            let { username, email, password } = req.body
            console.log(req.body)
            let user = await User.create({ username, email, password })
            res.status(201).json({ id: user.id, email })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            let { email, password } = req.body

            let user = await User.findOne({ where: { email } })
            // console.log(user)
            if (!user) throw { name: 'InvalidCredentials' }

            let checkPassword = comparePassword(password, user.password)
            if (!checkPassword) throw { name: 'InvalidCredentials' }

            let payload = { id: user.id, email: user.email }
            let token = createToken(payload)
            res.status(200).json({ access_token: token })

        } catch (error) {
            // console.log(error)
            next(error)
        }
    }


}
module.exports = userController