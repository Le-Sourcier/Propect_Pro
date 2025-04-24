const router = require("express").Router();
const {
  userRegisterValidator,
  userAuthValidator,
} = require("./../../validators");
const userController = require("../../controllers/components/userController");

router
  .post("/register", userRegisterValidator, userController.register) // Créer un utilisateur
  .post("/login", userAuthValidator, userController.login) // Authentifier un utilisateur
  .put("/update/:id", userController.updateUser) //Update user by id
  .put("/reset-password", userController.resetPassword) // Reset user password by id
  .delete("/delete/:id", userController.delete) //Delete user by id
  .get("/", userController.getAllUsers) // Get all users
  .get("/user/:id", userController.getUserWithDetails); // Get user by id

module.exports = router;
