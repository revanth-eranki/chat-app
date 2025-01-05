const getUSerDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

async function updateUserDetails(request, response) {
    try {
        const token = request.cookies.token || "";
        const user = await getUSerDetailsFromToken(token);
        if (!user) {
            throw new Error("User not found.");
        }
        if (!user._id) {
            throw new Error("Invalid user token.");
        }
        const { name, profile_pic } = request.body;
        const updateUser = await UserModel.updateOne(
            { _id: user._id },
            { name, profile_pic }
        );
        const userInfo = await UserModel.findById(user._id);
        console.log("update user details",userInfo)
        return response.json({
            message: "Updated user details",
            data: userInfo,
            success: true,
        });
    } catch (error) {
        console.error("Error updating user details:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}

module.exports = updateUserDetails