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
    // .put("/reset-password", userController.updatePassword) // Update user password by id
    .put("/reset-password", userController.resetPassword) // Reset user password by id
    .post("/verify-token", userController.verifyPasswordToken) // Verify reset token
    .put("/forget-password", loginLimiter, userController.forgetPassword) // Recover user password by email address
    .delete("/delete/:id", userController.delete) //Delete user by id
    .get("/all", userController.getAllUsers) // Get all users
    .get("/user/:id", userController.getUserWithDetails) // Get user by id
    .post("/activities", userController.getRecentActivities); // Get all activities of the user

module.exports = router;
