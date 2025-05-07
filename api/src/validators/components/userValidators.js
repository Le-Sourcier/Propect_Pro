const Joi = require("joi");

const registerAdminValidator = async (req, res, next) => {
    const passwordPattern = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    try {
        await Joi.object({
            fname: Joi.string().required().messages({
                "any.required": "First name is required.",
            }),
            lname: Joi.string().required().messages({
                "any.required": "Last name is required.",
            }),
            email: Joi.string().email().required().messages({
                "string.email": "A valid email address is required.",
                "any.required": "Email is required.",
            }),
            phone: Joi.number().positive().required().messages({
                "number.base": "Phone number must be a valid positive number.",
                "any.required": "Phone number is required.",
            }),
            image: Joi.string().optional(),
            location: Joi.object().optional().messages({
                "object.base": "Location must be a valid JSON object.",
                "any.required": "Location is required.",
            }),
            password: Joi.string()
                .pattern(passwordPattern)
                .required()
                .messages({
                    "string.pattern.base":
                        "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.",
                    "any.required": "Password is required.",
                }),
        })
            .unknown(true) // Allow extra fields (optional, based on your needs)
            .validateAsync(req.body);

        return next(); // If validation passes, proceed to the next middleware
    } catch (error) {
        console.error("Validation error:", error.message);
        return res.status(400).json({
            //   message: "Validation error.",
            message: error.details
                ? error.details.map((detail) => detail.message)
                : error.message,
        });
    }
};

const loginAdminValidator = async (req, res, next) => {
    try {
        await Joi.object({
            email: Joi.string().email().required().messages({
                "string.email": "A valid email address is required.",
                "any.required": "Email is required.",
            }),
            password: Joi.string().required().messages({
                "any.required": "Password is required.",
            }),
            location: Joi.object().optional().messages({
                "any.required": "Location is required.",
                "object.base": "Location must be a valid JSON object.",
            }),
        })
            .unknown(false) // Disallow any additional fields
            .validateAsync(req.body);

        return next(); // Proceed to the next middleware/controller if validation passes
    } catch (error) {
        console.error("Validation error:", error.message);
        return res.status(400).json({
            // message: "Validation error.",
            message: error.details
                ? error.details.map((detail) => detail.message)
                : error.message,
        });
    }
};

const userRegisterValidator = async (req, res, next) => {
    const passwordPattern = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    try {
        await Joi.object({
            email: Joi.string().email().required().messages({
                "string.email": "A valid email address is required.",
                "any.required": "Email is required.",
            }),
            password: Joi.string()
                .pattern(passwordPattern)
                .required()
                .messages({
                    "string.pattern.base":
                        "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.",
                    "any.required": "Password is required.",
                }),
            fname: Joi.string().required().messages({
                "any.required": "First name is required.",
            }),
            lname: Joi.string().required().messages({
                "any.required": "Last name is required.",
            }),
            phone: Joi.number().positive().required().messages({
                "number.base": "Phone number must be a valid positive number.",
                "any.required": "Phone number is required.",
            }),
        })
            .unknown(true) // Disallow extra fields
            .validateAsync(req.body);

        return next(); // Proceed if validation passes
    } catch (error) {
        console.error("Validation error:", error.message);
        return res.status(400).json({
            // message: "Validation error.",
            message: error.details
                ? error.details.map((d) => d.message)
                : error.message,
        });
    }
};
const userAuthValidator = async (req, res, next) => {
    const passwordPattern = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );

    try {
        await Joi.object({
            email: Joi.string().email().required().messages({
                "string.email": "A valid email address is required.",
                "any.required": "Email is required.",
            }),
            password: Joi.string()
                .pattern(passwordPattern)
                .required()
                .messages({
                    "string.pattern.base":
                        "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.",
                    "any.required": "Password is required.",
                }),
        })
            .unknown(true) // Disallow extra fields
            .validateAsync(req.body);

        return next(); // Proceed if validation passes
    } catch (error) {
        console.error("Validation error:", error.message);
        return res.status(400).json({
            // message: "Validation error.",
            message: error.details
                ? error.details.map((d) => d.message)
                : error.message,
        });
    }
};

module.exports = {
    registerAdminValidator,
    loginAdminValidator,
    userRegisterValidator,
    userAuthValidator,
};
