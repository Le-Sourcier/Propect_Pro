const dayjs = require("dayjs");

const {
    Users,
    Profiles,
    Sessions,
    enrich_jobs: EnrichJob,
    scraping_jobs: ScrapingJobs,
} = require("../../models");

const { serverMessage } = require("../../utils");
const db = require("../../models");

const bcrypt = require("bcrypt");
const sendMail = require("../../functions/components/sendMail");
const resetPasswordTemplate = require("../../../lib/resetPasswordTemplate");

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

            return serverMessage(res, "SUCCESS", data);
        } catch (error) {
            return serverMessage(res);
        }
    },
    // controllers/auth.js
    refresh: async (req, res) => {
        try {
            // const token = req.cookies.refreshToken;
            const token = req.body.refreshToken;
            console.log(token);

            if (!token) return serverMessage(res, "UNAUTHORIZED_ACCESS");
            // Vérifier et extraire userId
            const payload = jwt.verify(token, process.env.REFRESH_SECRET);
            // Vérifier que le token existe en base et n’est pas expiré
            const session = await Sessions.findOne({ where: { token } });
            if (!session || session.expires_at < new Date()) {
                return serverMessage(res, "TOKEN_EXPIRED");
            }
            // Générer un nouvel accessToken
            const accessToken = generateAccessToken({ id: payload.id });
            // (Optionnel) rotation : générer aussi un nouveau refresh, mettre à jour la session et le cookie
            return serverMessage(res, "SUCCES", { token: accessToken });
        } catch (err) {
            return serverMessage(res, "TOKEN_INVALID");
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
    updatePassword: async (req, res) => {
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
    sendResetCode: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await Users.findOne({ where: { email } });
            if (!user) return serverMessage(res, "PROFILE_NOT_FOUND");

            const resetCode = Math.floor(
                100000 + Math.random() * 900000
            ).toString(); // 6-digit code
            const expiresAt = dayjs().add(15, "minutes").toDate();
            user.reset_code = resetCode;
            user.reset_code_expires_at = expiresAt;
            console.log("expiresAt: ", expiresAt);
            await user.save();

            const mailTemplate = resetPasswordTemplate(resetCode);

            await sendMail({
                to: "suport.darksite@gmail.com",
                subject: "Votre code de réinitialisation",
                text: `Votre code de réinitialisation de votre compte Prospect Pro est : ${resetCode}
Ce code expirera après 15 minutes.
Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer ce message.`,
                html: mailTemplate,
            });

            return serverMessage(res, "RESET_CODE_SENT"); // ne pas inclure le code en prod
        } catch (err) {
            console.error(err);
            return serverMessage(res);
        }
    },

    verifyPasswordOTP: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { email, code } = req.body;
            console.log("EMAIN & CODE: ", email, code);

            if (!email || !code)
                return serverMessage(res, "REQUIRED_FIELDS_MISSING");

            const user = await Users.findOne({ where: { email } });
            if (!user) return serverMessage(res, "PROFILE_NOT_FOUND");

            const isCodeValid =
                user.reset_code === code &&
                user.reset_code_expires_at &&
                new Date(user.reset_code_expires_at) > new Date();

            if (!isCodeValid)
                return serverMessage(res, "INVALID_OR_EXPIRED_CODE");

            // Supprime le code pour éviter réutilisation
            user.reset_code = null;
            user.reset_code_expires_at = null;

            await user.save();
            await transaction.commit();

            return serverMessage(res, "NEXT_STEP");
        } catch (error) {
            await transaction.rollback();
            console.error(error);
            return serverMessage(res);
        }
    },
    resetPassword: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { email, password } = req.body;

            if (!email || !password)
                return serverMessage(res, "REQUIRED_FIELDS_MISSING");

            const user = await Users.findOne({ where: { email } });
            if (!user) return serverMessage(res, "PROFILE_NOT_FOUND");

            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;

            await user.save();
            await transaction.commit();

            return serverMessage(res, "PASSWORD_RECOVERED_SUCCESS");
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

    // controllers/activityController.js
    getRecentActivities: async (req, res) => {
        try {
            const userId = req.body.id;
            const [enriches, scrapings] = await Promise.all([
                EnrichJob.findAll({
                    where: { user_id: userId },
                    attributes: ["id", "createdAt", "user_id", "name"],
                    order: [["createdAt", "DESC"]],
                    limit: 10,
                }),
                ScrapingJobs.findAll({
                    where: { user_id: userId },
                    attributes: [
                        "id",
                        "createdAt",
                        "user_id",
                        "query",
                        "source",
                    ],
                    order: [["createdAt", "DESC"]],
                    limit: 10,
                }),
            ]);

            const enrichActivities = enriches.map((e) => ({
                id: e.id,
                type: "enrich_job",
                label: e.name,
                createdAt: dayjs(e.createdAt).format("ddd MMM YYYY HH:mm"),
            }));

            const scrapeActivities = scrapings.map((s) => ({
                id: s.id,
                type: "scraping_job",
                label: `${s.query} - ${s.source}`,
                createdAt: dayjs(s.createdAt).format("ddd MMM YYYY HH:mm"),
            }));

            const all = [...enrichActivities, ...scrapeActivities].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            console.log("DATA: ", all);

            return serverMessage(res, "SUCCESS", all.slice(0, 20)); // Limite finale
        } catch (err) {
            console.error(err);
            return serverMessage(res);
        }
    },
};
