const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')

const getUSerDetailsFromToken  = async(token) => {

    if (!token) {
        return {
            message  : "session out",
            logout: true,
        }
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const user = await UserModel.findById(decode.id).select('-password')
    return user

}

module.exports = getUSerDetailsFromToken