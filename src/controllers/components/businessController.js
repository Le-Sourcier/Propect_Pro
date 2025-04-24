const { Users, Profiles, Sessions } = require("../../models");
const db = require("../../models");

const bcrypt = require("bcrypt");

module.exports = {
  // User registration
  register: async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
      const { email, password, fname, lname, phone } = req.body;

      const existingUser = await Users.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
      }
      // Check if the phone number already exists
      const existingPhone = await Profiles.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({ error: "Phone number already exists" });
      }

      const user = await Users.create({ email, password });
      const profile = await Profiles.create({
        user_id: user.id,
        fname,
        lname,
        phone,
      });

      const userPlain = user.get({ plain: true });
      const profilePlain = profile.get({ plain: true });

      // Remove createdAt/updatedAt from profile
      delete profilePlain.id;
      delete profilePlain.user_id;
      delete profilePlain.createdAt;
      delete profilePlain.updatedAt;

      await transaction.commit();

      return res.status(201).json({
        error: false,
        status: 201,
        message: "User created",
        data: {
          id: userPlain.id,
          email: userPlain.email,
          firstName: profilePlain.fname,
          lastName: profilePlain.lname,
          dateOfBirth: profilePlain.dob,
          address: profilePlain.address,
          phone: profilePlain.phone,
          role: userPlain.role,
          bio: profilePlain.bio,
          image: profilePlain.image,
          status: userPlain.status,
          createdAt: userPlain.createdAt,
          updatedAt: userPlain.updatedAt,
        },
      });
    } catch (error) {
      await transaction.rollback();
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

      //   Get user profile data
      const profile = await Profiles.findOne({ where: { user_id: user.id } });

      const userPlain = user.get({ plain: true });
      const profilePlain = profile.get({ plain: true });

      // Remove createdAt/updatedAt from profile
      delete userPlain.password;
      delete profilePlain.id;
      delete profilePlain.user_id;
      delete profilePlain.createdAt;
      delete profilePlain.updatedAt;

      return res.status(200).json({
        error: false,
        status: 202,
        message: "Login successful",
        data: {
          id: userPlain.id,
          email: userPlain.email,
          firstName: profilePlain.fname,
          lastName: profilePlain.lname,
          dateOfBirth: profilePlain.dob,
          address: profilePlain.address,
          phone: profilePlain.phone,
          role: userPlain.role,
          bio: profilePlain.bio,
          image: profilePlain.image,
          status: userPlain.status,
          accessToken,
          refreshToken,
          updatedAt: userPlain.updatedAt,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong during login" });
    }
  },
  // Update user data (excluding email)
  updateUser: async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
      const userId = req.params.id;
      const { fname, lname, phone } = req.body;

      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      user.fname = fname || user.fname;
      user.lname = lname || user.lname;
      user.phone = phone || user.phone;

      await user.save();
      await transaction.commit();

      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ error: "Something went wrong during update" });
    }
  },
  //   Reset password
  resetPassword: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const userId = req.params.id;
      const { oldPassword, newPassword } = req.body;

      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // OPTIONAL: Verify old password first
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      await user.save();
      await transaction.commit();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong during password reset" });
    }
  },

  // Delete user
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

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.findAll({ include: ["profile", "sessions"] });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch users" });
    }
  },

  // Get user by ID with details
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
