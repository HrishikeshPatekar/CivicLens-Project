const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const { sendOtpEmail } = require("../services/emailService");

// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            password,
        } = req.body || {};

        // Required fields
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // ==============================================
        // PASSWORD LENGTH VALIDATION
        // ==============================================

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check email
        const existingEmail = await User.findOne({
            email: normalizedEmail,
        });

        if (existingEmail) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        // Check mobile
        const existingMobile = await User.findOne({
            mobile: mobile.trim(),
        });

        if (existingMobile) {
            return res.status(409).json({
                message: "Mobile number is already registered",
            });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            mobile: mobile.trim(),
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "Registration successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Server error during registration",
        });
    }
};

// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const passwordValid = await argon2.verify(
            user.password,
            password
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error during login",
        });
    }
};

// =====================================================
// SEND PASSWORD RESET OTP
// =====================================================

const sendPasswordResetOtp = async (req, res) => {
    try {
        const {
            identifier,
        } = req.body || {};

        if (!identifier) {
            return res.status(400).json({
                message: "Please enter your email or mobile number",
            });
        }

        const value = identifier.trim();

        // Find by email OR mobile
        const user = await User.findOne({
            $or: [
                {
                    email: value.toLowerCase(),
                },
                {
                    mobile: value,
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email or mobile number",
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        // Hash OTP before storing
        const otpHash = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // OTP valid for 10 minutes
        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.resetOtpHash = otpHash;
        user.resetOtpExpires = otpExpires;
        user.resetOtpAttempts = 0;

        await user.save();

        // OTP can only be sent to registered email
        await sendOtpEmail(user.email, otp);

        return res.status(200).json({
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error(
            "Send password reset OTP error:",
            error
        );

        return res.status(500).json({
            message: "Unable to send OTP. Please try again.",
        });
    }
};

// =====================================================
// VERIFY PASSWORD RESET OTP
// =====================================================

const verifyPasswordResetOtp = async (req, res) => {
    try {
        const {
            identifier,
            otp,
        } = req.body || {};

        if (!identifier || !otp) {
            return res.status(400).json({
                message: "Email/mobile and OTP are required",
            });
        }

        const value = identifier.trim();

        const user = await User.findOne({
            $or: [
                {
                    email: value.toLowerCase(),
                },
                {
                    mobile: value,
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check OTP attempts
        if (user.resetOtpAttempts >= 5) {
            return res.status(429).json({
                message:
                    "Too many incorrect attempts. Please request a new OTP.",
            });
        }

        // Check expiration
        if (
            !user.resetOtpExpires ||
            user.resetOtpExpires < new Date()
        ) {
            return res.status(400).json({
                message:
                    "OTP has expired. Please request a new OTP.",
            });
        }

        const otpHash = crypto
            .createHash("sha256")
            .update(otp.toString())
            .digest("hex");

        if (otpHash !== user.resetOtpHash) {
            user.resetOtpAttempts += 1;

            await user.save();

            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // Create short-lived reset token
        const resetToken = jwt.sign(
            {
                userId: user._id,
                purpose: "password-reset",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );

        return res.status(200).json({
            message: "OTP verified successfully",
            resetToken,
        });

    } catch (error) {
        console.error(
            "Verify password reset OTP error:",
            error
        );

        return res.status(500).json({
            message: "Unable to verify OTP",
        });
    }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
    try {
        const {
            resetToken,
            newPassword,
            confirmPassword,
        } = req.body || {};

        if (
            !resetToken ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // ==============================================
        // PASSWORD LENGTH VALIDATION
        // ==============================================

        if (newPassword.length < 8) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters",
            });
        }

        // Confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        // Verify reset token
        let decoded;

        try {
            decoded = jwt.verify(
                resetToken,
                process.env.JWT_SECRET
            );
        } catch (tokenError) {
            return res.status(401).json({
                message:
                    "Password reset session expired. Please request a new OTP.",
            });
        }

        if (decoded.purpose !== "password-reset") {
            return res.status(401).json({
                message: "Invalid password reset token",
            });
        }

        const user = await User.findById(
            decoded.userId
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Hash new password
        const hashedPassword = await argon2.hash(
            newPassword
        );

        user.password = hashedPassword;

        // Clear OTP information
        user.resetOtpHash = null;
        user.resetOtpExpires = null;
        user.resetOtpAttempts = 0;

        await user.save();

        return res.status(200).json({
            message:
                "Password reset successfully",
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to reset password",
        });
    }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
    registerUser,
    loginUser,
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
};