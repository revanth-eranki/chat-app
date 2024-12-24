const UserModel = require("../models/UserModel")
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function checkPassword(request,response){
    try {
        const { password, userId } = request.body;


            if (!userId) {
            return response.status(400).json({
                message: "User ID is required",
                error: true,
            });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
            });
            }

        const checkPassword = await bcryptjs.compare(password,user.password)
        

        if(!checkPassword){
            return response.status(400).json({
                message : "Password doesnot matched",
                error : true,
            })
        }

        const tokenData  = {
            id : user._id,
            email : user.email
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
        const cookieOptions = {
            http:true,
            secure:true
        }

        return response.cookie('token',token,cookieOptions).status(200).json({
            message : "Login successfull",
            token : token,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error:true
        })
    }
}
module.exports = checkPassword

