const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        profilePhoto: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: [
                "citizen",
                "administrative_officer",
                "collector",
            ],
            default: "citizen",
        },

        // Password reset OTP
        resetOtpHash: {
            type: String,
            default: null,
        },

        resetOtpExpires: {
            type: Date,
            default: null,
        },

        resetOtpAttempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;