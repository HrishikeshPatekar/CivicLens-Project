const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            unique: true,
            required: true,
        },

        citizen: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
        },

        issueGroup: {
        type: String,
        index: true,
        },
        
        description: {
            type: String,
            required: true,
        },

        location: {
            address: {
                type: String,
                required: true,
            },

            latitude: {
                type: Number,
                required: true,
            },

            longitude: {
                type: Number,
                required: true,
            },
        },

        media: [
            {
                type: {
                    type: String,
                    enum: ["image", "video"],
                },

                url: String,

                originalName: String,
            },
        ],

        status: {
            type: String,
            enum: [
                "Reported",
                "In Progress",
                "Resolved",
                "Rejected",
            ],
            default: "Reported",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low",
        },

        similarReports: {
            type: Number,
            default: 1,
        },

        department: {
            type: String,
            default: null,
        },

        assignedOfficer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        contractor: {
            name: String,
            company: String,
            phone: String,
            email: String,
            contractNumber: String,
        },

        statusHistory: [
            {
                status: String,
                comment: String,
                changedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                changedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);