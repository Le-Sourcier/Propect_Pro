const { Users, Profiles, Sessions } = require("../../models");
const db = require("./../../models");

const bcrypt = require("bcrypt");

module.exports = {
  // User registration
  register: async (req, res) => {
    try {
      const { email, password, fname, lname, phone } = req.body;

      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      // Check if the phone number already exists
      //   const existingPhone = await Profiles.findOne({ where: { phone } });
      //   if (existingPhone) {
      //     return res.status(400).json({ error: "Phone number already exists" });
      //   }

      const user = await Users.create({
        email,
        password,
        fname,
        lname,
        phone,
      });

      await Profiles.create({ user_id: user.id });

      res.status(201).json({ message: "User created", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      //   Check if the user account is verified
      if (user.status === "UNVERIFIED") {
        return res.status(401).json({ error: "User account is not verified" });
      }
      // Check if the user account is blocked
      if (user.status === "BLOCKED") {
        return res.status(401).json({ error: "User account is blocked" });
      }
      //   Check if the user account is archived
      if (user.status === "ARCHIVED") {
        return res.status(401).json({ error: "User account is archived" });
      }

      // Generate access and refresh tokens (assuming method exists in your model)
      const { accessToken, refreshToken } = user.generateTokens();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // expire in 7 days

      // Save the refresh token in session
      await Sessions.create({
        user_id: user.id,
        token: refreshToken,
        expires_at: expiresAt,
      });

      res.status(200).json({
        message: "Login successful",
        user,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong during login" });
    }
  },
  //   Delete user
  delete: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const { id } = req.params;

      const user = await Users.findByPk(id);
      if (!user) {
        throw new Error("User not found.");
      }

      await user.destroy({ transaction });
      await transaction.commit();

      return res.status(200).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({ error: "Error deleting user" });
      //   return handleError(res, error, "Failed to delete user.");
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await Users.findAll({ include: ["profile", "sessions"] });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch users" });
    }
  },

  getUserWithDetails: async (req, res) => {
    try {
      const user = await Users.findByPk(req.params.id, {
        include: ["profile", "sessions"],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  },
};
