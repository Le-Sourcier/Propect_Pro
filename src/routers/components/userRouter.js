const router = require("express").Router();
const {
    userRegisterValidator,
    userAuthValidator,
} = require("../../validators");
const userController = require("../../controllers/components/userController");
const { loginLimiter } = require("../../middlewares/authMiddleware");

router
    .post("/register", userRegisterValidator, userController.register) // Créer un utilisateur
    .post("/login", loginLimiter, userAuthValidator, userController.login) // Authentifier un utilisateur
    .get("/me", userController.getMe) // Get current user
    .post("/refresh", userController.refresh) // Refresh token
    .put("/update/:id", userController.updateUser) //Update user by id
    .put("/reset-password", userController.updatePassword) // Reset user password by id
    .post("/send-password-otp", userController.sendResetCode) // Send reset code to user email address
    .post("/verify-otp", userController.verifyPasswordOTP) // Verify reset code
    .put("/forget-password", userController.resetPassword) // Recover user password by email address
    .delete("/delete/:id", userController.delete) //Delete user by id
    .get("/", userController.getAllUsers) // Get all users
    .get("/user/:id", userController.getUserWithDetails) // Get user by id
    .post("/activities", userController.getRecentActivities); // Get all activities of the user

module.exports = router;
