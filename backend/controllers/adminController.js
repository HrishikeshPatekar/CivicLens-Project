const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Complaint = require("../models/Complaint");


// =====================================================
// ADMIN LOGIN
// =====================================================

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const admin = await User.findOne({
            email: email.toLowerCase(),
            role: {
                $in: [
                    "administrative_officer",
                    "collector",
                ],
            },
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid admin credentials",
            });
        }

        const passwordValid = await argon2.verify(
            admin.password,
            password
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Invalid admin credentials",
            });
        }

        const token = jwt.sign(
            {
                userId: admin._id,
                role: admin.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            message: "Admin login successful",

            token,

            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                mobile: admin.mobile,
                role: admin.role,
                profilePhoto: admin.profilePhoto,
            },
        });

    } catch (error) {
        console.error(
            "Admin login error:",
            error
        );

        return res.status(500).json({
            message: "Server error during admin login",
        });
    }
};


// =====================================================
// GET ALL COMPLAINTS
// =====================================================

const getAllComplaints = async (req, res) => {
    try {
        const {
            search,
            status,
            priority,
            department,
            from,
            to,
            sort,
        } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (department) {
            filter.department = department;
        }

        if (from || to) {
            filter.createdAt = {};

            if (from) {
                filter.createdAt.$gte =
                    new Date(`${from}T00:00:00`);
            }

            if (to) {
                filter.createdAt.$lte =
                    new Date(`${to}T23:59:59`);
            }
        }

        let complaints = await Complaint.find(filter)
            .populate(
                "citizen",
                "name email mobile profilePhoto"
            )
            .populate(
                "assignedOfficer",
                "name email mobile role"
            )
            .sort({
                createdAt:
                    sort === "oldest"
                        ? 1
                        : -1,
            });

        // Search after population so citizen name can also be searched
        if (search) {
            const searchText =
                search.toLowerCase().trim();

            complaints = complaints.filter(
                (complaint) => {

                    const citizenName =
                        complaint.citizen?.name ||
                        "";

                    const citizenEmail =
                        complaint.citizen?.email ||
                        "";

                    return (
                        complaint.complaintId
                            ?.toLowerCase()
                            .includes(searchText) ||

                        complaint.title
                            ?.toLowerCase()
                            .includes(searchText) ||

                        citizenName
                            .toLowerCase()
                            .includes(searchText) ||

                        citizenEmail
                            .toLowerCase()
                            .includes(searchText)
                    );
                }
            );
        }

        return res.json(complaints);

    } catch (error) {
        console.error(
            "Get all complaints error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while loading complaints",
        });
    }
};


// =====================================================
// GET DASHBOARD STATISTICS
// =====================================================

const getDashboardStats = async (req, res) => {
    try {
        const complaints =
            await Complaint.find();

        const stats = {
            total: complaints.length,

            reported:
                complaints.filter(
                    c => c.status === "Reported"
                ).length,

            inProgress:
                complaints.filter(
                    c => c.status === "In Progress"
                ).length,

            resolved:
                complaints.filter(
                    c => c.status === "Resolved"
                ).length,

            rejected:
                complaints.filter(
                    c => c.status === "Rejected"
                ).length,

            low:
                complaints.filter(
                    c => c.priority === "Low"
                ).length,

            medium:
                complaints.filter(
                    c => c.priority === "Medium"
                ).length,

            high:
                complaints.filter(
                    c => c.priority === "High"
                ).length,
        };

        return res.json(stats);

    } catch (error) {
        console.error(
            "Dashboard stats error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while loading dashboard",
        });
    }
};


// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

const getAdminComplaintById = async (
    req,
    res
) => {
    try {
        const complaint =
            await Complaint.findOne({
                complaintId: req.params.id,
            })
                .populate(
                    "citizen",
                    "name email mobile profilePhoto"
                )
                .populate(
                    "assignedOfficer",
                    "name email mobile role"
                );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found",
            });
        }

        return res.json(complaint);

    } catch (error) {
        console.error(
            "Get admin complaint error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// =====================================================
// UPDATE COMPLAINT
// =====================================================

const updateComplaint = async (
    req,
    res
) => {
    try {
        const {
            department,
            status,
            contractor,
            assignedOfficer,
        } = req.body;

        const complaint =
            await Complaint.findOne({
                complaintId: req.params.id,
            });

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found",
            });
        }

        const oldStatus =
            complaint.status;

        if (department !== undefined) {
            complaint.department =
                department;
        }

        if (status !== undefined) {
            complaint.status =
                status;
        }

        if (
            assignedOfficer !== undefined &&
            assignedOfficer !== ""
        ) {
            complaint.assignedOfficer =
                assignedOfficer;
        }

        if (contractor !== undefined) {
            complaint.contractor =
                contractor;
        }

        if (
            status &&
            status !== oldStatus
        ) {
            complaint.statusHistory.push({
                status,
                comment:
                    `Status changed from ${oldStatus} to ${status}`,
                changedBy:
                    req.user.userId,
                changedAt: new Date(),
            });
        }

        await complaint.save();

        const updatedComplaint =
            await Complaint.findOne({
                complaintId: req.params.id,
            })
                .populate(
                    "citizen",
                    "name email mobile profilePhoto"
                )
                .populate(
                    "assignedOfficer",
                    "name email mobile role"
                );

        return res.json({
            message:
                "Complaint updated successfully",

            complaint:
                updatedComplaint,
        });

    } catch (error) {
        console.error(
            "Update complaint error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while updating complaint",
        });
    }
};


// =====================================================
// GET ADMIN PROFILE
// =====================================================

const getAdminProfile = async (
    req,
    res
) => {
    try {
        const admin =
            await User.findById(
                req.user.userId
            ).select(
                "-password"
            );

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        return res.json(admin);

    } catch (error) {
        console.error(
            "Get admin profile error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
        });
    }
};


// =====================================================
// UPDATE ADMIN PROFILE
// =====================================================

const updateAdminProfile = async (
    req,
    res
) => {
    try {
        const {
            name,
            email,
            mobile,
        } = req.body;

        const admin =
            await User.findById(
                req.user.userId
            );

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }

        if (name) {
            admin.name = name;
        }

        if (email) {
            const existingEmail =
                await User.findOne({
                    email:
                        email.toLowerCase(),
                    _id: {
                        $ne:
                            admin._id,
                    },
                });

            if (existingEmail) {
                return res.status(409).json({
                    message:
                        "Email is already in use",
                });
            }

            admin.email =
                email.toLowerCase();
        }

        if (mobile) {
            const existingMobile =
                await User.findOne({
                    mobile,
                    _id: {
                        $ne:
                            admin._id,
                    },
                });

            if (existingMobile) {
                return res.status(409).json({
                    message:
                        "Mobile number is already in use",
                });
            }

            admin.mobile = mobile;
        }

        await admin.save();

        return res.json({
            message:
                "Profile updated successfully",

            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                mobile: admin.mobile,
                role: admin.role,
                profilePhoto:
                    admin.profilePhoto,
            },
        });

    } catch (error) {
        console.error(
            "Update admin profile error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while updating profile",
        });
    }
};


// =====================================================
// CHANGE ADMIN PASSWORD
// =====================================================

const changeAdminPassword = async (
    req,
    res
) => {
    try {
        const {
            oldPassword,
            newPassword,
        } = req.body;

        if (
            !oldPassword ||
            !newPassword
        ) {
            return res.status(400).json({
                message:
                    "Old password and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                message:
                    "New password must contain at least 8 characters",
            });
        }

        const admin =
            await User.findById(
                req.user.userId
            );

        if (!admin) {
            return res.status(404).json({
                message:
                    "Admin not found",
            });
        }

        const valid =
            await argon2.verify(
                admin.password,
                oldPassword
            );

        if (!valid) {
            return res.status(401).json({
                message:
                    "Old password is incorrect",
            });
        }

        admin.password =
            await argon2.hash(
                newPassword
            );

        await admin.save();

        return res.json({
            message:
                "Password changed successfully",
        });

    } catch (error) {
        console.error(
            "Change admin password error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while changing password",
        });
    }
};


module.exports = {
    loginAdmin,
    getAllComplaints,
    getDashboardStats,
    getAdminComplaintById,
    updateComplaint,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
};