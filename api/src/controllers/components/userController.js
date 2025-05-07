const { Users, Profiles, Sessions } = require("../../models");
const { serverMessage } = require("../../utils");
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
                return serverMessage(res, "ACCOUNT_ALREADY_EXISTS");
            }
            // Check if the phone number already exists
            const existingPhone = await Profiles.findOne({ where: { phone } });
            if (existingPhone) {
                return serverMessage(res, "PHONE_ALREADY_EXISTS");
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

            const data = {
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
            };
            return serverMessage(res, "ACCOUNT_CREATED", data);
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return serverMessage(res);
        }
    },

    // User login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Users.findOne({ where: { email } });
            if (!user) {
                return serverMessage(res, "PROFILE_NOT_FOUND");
            }

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return serverMessage(res, "INVALID_CREDENTIALS");
            }

            //   Check if the user account is verified
            if (user.status === "UNVERIFIED") {
                return serverMessage(res, "ACCOUNT_UNVERIFIED");
            }
            // Check if the user account is blocked
            if (user.status === "BLOCKED") {
                return serverMessage(res, "ACCOUNT_BLOKED");
            }
            //   Check if the user account is archived
            if (user.status === "ARCHIVED") {
                return serverMessage(res, "ACCOUNT_ARCHIVED");
            }

            // Generate access and refresh tokens (assuming method exists in your model)
            const { accessToken, refreshToken } = user.generateTokens();
            const expiresAt = new Date();
            // expiresAt.setDate(expiresAt.getDate() + 7); // expire in 7 days
            expiresAt.setMinutes(expiresAt.getMinutes() + 1);

            // Save the refresh token in session
            await Sessions.create({
                user_id: user.id,
                token: refreshToken,
                expires_at: expiresAt,
            });

            // [2] Set refreshToken as secure cookie
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                // secure: true, // à activer uniquement en HTTPS
                secure: process.env.NODE_ENV === "production", // active en prod HTTPS
                sameSite: "Strict",
                maxAge: 7 * 24 * 3600 * 1000, // 7 jours
            });

            //   Get user profile data
            const profile = await Profiles.findOne({
                where: { user_id: user.id },
            });

            const userPlain = user.get({ plain: true });
            const profilePlain = profile.get({ plain: true });

            // Remove createdAt/updatedAt from profile
            delete userPlain.password;
            delete profilePlain.id;
            delete profilePlain.user_id;
            delete profilePlain.createdAt;
            delete profilePlain.updatedAt;

            const data = {
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
            };

            return serverMessage(res, "LOGIN_SUCCESS", data);
        } catch (error) {
            console.error(error);
            return serverMessage(res);
        }
    },
    // Get current user data
    getMe: async (req, res) => {
        try {
            const user = req.user;
            const profile = user.profile;

            const data = {
                id: user.id,
                email: user.email,
                fname: profile.fname,
                lname: profile.lname,
                phone: profile.phone,
            };

            return res.json(data);
        } catch (error) {
            return serverMessage(res);
        }
    },
    // controllers/auth.js
    refresh: async (req, res) => {
        try {
            const token = req.cookies.refreshToken;

            if (!token) return res.status(401).json({ error: "No token" });
            // Vérifier et extraire userId
            const payload = jwt.verify(token, process.env.REFRESH_SECRET);
            // Vérifier que le token existe en base et n’est pas expiré
            const session = await Sessions.findOne({ where: { token } });
            if (!session || session.expires_at < new Date()) {
                return res
                    .status(403)
                    .json({ error: "Token expiré ou invalide" });
            }
            // Générer un nouvel accessToken
            const accessToken = generateAccessToken({ id: payload.id });
            // (Optionnel) rotation : générer aussi un nouveau refresh, mettre à jour la session et le cookie
            return res.json({ accessToken });
        } catch (err) {
            return res.status(403).json({ error: "Invalid token" });
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
                return serverMessage(res, "PROFILE_NOT_FOUND");
            }

            user.fname = fname || user.fname;
            user.lname = lname || user.lname;
            user.phone = phone || user.phone;

            await user.save();
            await transaction.commit();

            // res.status(200).json({ message: "User updated successfully", user });
            return serverMessage(res, "PROFILE_UPDATED", user);
        } catch (error) {
            await transaction.rollback();
            // console.error(error);
            // res.status(500).json({ error: "Something went wrong during update" });
            return serverMessage(res);
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
                return serverMessage(res, "PROFILE_NOT_FOUND");
            }

            // OPTIONAL: Verify old password first
            const isPasswordValid = await bcrypt.compare(
                oldPassword,
                user.password
            );
            if (!isPasswordValid) {
                return serverMessage(res, "OLD_PASSWORD_INVALID");
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;

            await user.save();
            await transaction.commit();

            return serverMessage(res, "PASSWORD_RESET_SUCCESS");
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return serverMessage(res);
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
            const users = await Users.findAll({
                include: ["profile", "sessions"],
            });
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
