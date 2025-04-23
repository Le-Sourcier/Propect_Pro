const router = require("express").Router();
const { userRegisterValidator } = require("./../../validators");
const userController = require("../../controllers/components/userController");

// Créer un utilisateur
router
  .post("/register", userRegisterValidator, userController.register)

  // Récupérer tous les utilisateurs
  .get("/", userController.getAllUsers)

  // Récupérer un utilisateur + son profil + ses sessions
  .get("/:id", userController.getUserWithDetails);

module.exports = router;
