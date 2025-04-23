const { Users, Profiles, Sessions } = require("../../models");

module.exports = {
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
