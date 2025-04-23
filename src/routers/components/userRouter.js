const router = require("express").Router();
const {
  userRegisterValidator,
  userAuthValidator,
} = require("./../../validators");
const userController = require("../../controllers/components/userController");

router
  .post("/register", userRegisterValidator, userController.register) // Créer un utilisateur
  .post("/login", userAuthValidator, userController.login) // Authentifier un utilisateur
  .delete("/delete-admin/:id", userController.delete) //Delete Admin
  .get("/", userController.getAllUsers) // Get all users
  .get("/:id", userController.getUserWithDetails); // Get user by id

module.exports = router;
