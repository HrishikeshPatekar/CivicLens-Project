const Complaint = require("../models/Complaint");
const User = require("../models/User");


// =====================================================
// GENERATE COMPLAINT ID
// =====================================================

const generateComplaintId = () => {
    const year = new Date().getFullYear();

    const random =
        Math.floor(
            10000 +
            Math.random() * 90000
        );

    return `CL-${year}-${random}`;
};


// =====================================================
// CREATE LOCATION GROUP
// =====================================================

const getLocationGroup = (
    latitude,
    longitude
) => {

    const lat =
        Number(latitude).toFixed(3);

    const lng =
        Number(longitude).toFixed(3);

    return `${lat}_${lng}`;
};


// =====================================================
// CREATE COMPLAINT
// =====================================================

const createComplaint = async (
    req,
    res
) => {

    try {

        // req.body || {} prevents destructuring errors
        // if no body is received.
        const {
            title,
            category,
            description,
            address,
            latitude,
            longitude,
        } = req.body || {};


        // =================================================
        // VALIDATE REQUIRED FIELDS
        // =================================================

        if (
            !title ||
            !category ||
            !description ||
            !address ||
            !latitude ||
            !longitude
        ) {

            return res.status(400).json({
                message:
                    "All complaint fields are required",
            });
        }


        // =================================================
        // CREATE ISSUE GROUP
        // =================================================

        const issueGroup =
            `${category}_${getLocationGroup(
                latitude,
                longitude
            )}`;


        // =================================================
        // FIND SIMILAR COMPLAINTS
        // =================================================

        const similarComplaints =
            await Complaint.find({
                category,
                issueGroup,
            });


        const reportCount =
            similarComplaints.length + 1;


        // =================================================
        // CALCULATE PRIORITY
        // =================================================

        let priority = "Low";


        if (reportCount >= 100) {

            priority = "High";

        } else if (reportCount >= 3) {

            priority = "Medium";
        }


        // =================================================
        // UPDATE EXISTING SIMILAR COMPLAINTS
        // =================================================

        if (
            similarComplaints.length > 0
        ) {

            await Complaint.updateMany(
                {
                    category,
                    issueGroup,
                },
                {
                    $set: {
                        similarReports:
                            reportCount,

                        priority:
                            priority,
                    },
                }
            );
        }


        // =================================================
        // PROCESS UPLOADED MEDIA
        // =================================================

        const media =
            req.files
                ? req.files.map(
                    (file) => ({

                        type:
                            file.mimetype.startsWith(
                                "video"
                            )
                                ? "video"
                                : "image",

                        url:
                            `/uploads/${file.filename}`,

                        originalName:
                            file.originalname,
                    })
                )
                : [];


        // =================================================
        // CREATE COMPLAINT
        // =================================================

        const complaint =
            await Complaint.create({

                complaintId:
                    generateComplaintId(),

                citizen:
                    req.user.userId,

                title:
                    title.trim(),

                category:
                    category.trim(),

                description:
                    description.trim(),

                location: {

                    address:
                        address.trim(),

                    latitude:
                        Number(latitude),

                    longitude:
                        Number(longitude),
                },

                media,

                status:
                    "Reported",

                priority,

                similarReports:
                    reportCount,

                issueGroup,

                statusHistory: [

                    {
                        status:
                            "Reported",

                        comment:
                            "Complaint submitted",

                        changedBy:
                            req.user.userId,

                        changedAt:
                            new Date(),
                    },

                ],
            });


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        return res.status(201).json({

            message:
                "Complaint submitted successfully",

            complaint,
        });


    } catch (error) {

        console.error(
            "Create complaint error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while submitting complaint",
        });
    }
};


// =====================================================
// GET MY COMPLAINTS
// =====================================================

const getMyComplaints = async (
    req,
    res
) => {

    try {

        const complaints =
            await Complaint.find({

                citizen:
                    req.user.userId,

            })
                .sort({
                    createdAt: -1,
                })
                .populate(
                    "assignedOfficer",
                    "name email"
                );


        return res.json(
            complaints
        );


    } catch (error) {

        console.error(
            "Get my complaints error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while loading complaints",
        });
    }
};


// =====================================================
// GET SINGLE CITIZEN COMPLAINT
// =====================================================

const getComplaintById = async (
    req,
    res
) => {

    try {

        const complaint =
            await Complaint.findOne({

                complaintId:
                    req.params.id,

                citizen:
                    req.user.userId,

            })
                .populate(
                    "assignedOfficer",
                    "name email"
                );


        if (!complaint) {

            return res.status(404).json({

                message:
                    "Complaint not found",
            });
        }


        return res.json(
            complaint
        );


    } catch (error) {

        console.error(
            "Get complaint error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error",
        });
    }
};


// =====================================================
// GET ALL COMPLAINTS
// =====================================================

const getAllComplaints = async (
    req,
    res
) => {

    try {

        const complaints =
            await Complaint.find()
                .sort({
                    createdAt: -1,
                })
                .populate(
                    "citizen",
                    "name email mobile profilePhoto"
                )
                .populate(
                    "assignedOfficer",
                    "name email mobile role"
                );


        return res.status(200).json(
            complaints
        );


    } catch (error) {

        console.error(
            "Get all complaints error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while fetching complaints",
        });
    }
};


// =====================================================
// UPDATE COMPLAINT STATUS
// =====================================================

const updateComplaintStatus = async (
    req,
    res
) => {

    try {

        const {
            status,
        } = req.body || {};


        const {
            id,
        } = req.params;


        const allowedStatuses = [

            "Reported",

            "In Progress",

            "Resolved",

            "Rejected",

        ];


        if (!status) {

            return res.status(400).json({

                message:
                    "Status is required",
            });
        }


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid complaint status",
            });
        }


        const complaint =
            await Complaint.findOne({

                $or: [

                    {
                        _id: id,
                    },

                    {
                        complaintId: id,
                    },

                ],
            });


        if (!complaint) {

            return res.status(404).json({

                message:
                    "Complaint not found",
            });
        }


        const oldStatus =
            complaint.status;


        complaint.status =
            status;


        // Add status history
        if (
            oldStatus !== status
        ) {

            complaint.statusHistory.push({

                status,

                comment:
                    `Status changed from ${oldStatus} to ${status}`,

                changedBy:
                    req.user.userId,

                changedAt:
                    new Date(),
            });
        }


        await complaint.save();


        return res.status(200).json({

            message:
                "Complaint status updated successfully",

            complaint,
        });


    } catch (error) {

        console.error(
            "Update complaint status error:",
            error
        );

        return res.status(500).json({

            message:
                "Server error while updating complaint status",
        });
    }
};


// =====================================================
// PUBLIC PLATFORM STATS (for homepage)
// =====================================================

const getPublicStats = async (req, res) => {
    try {
        const [
            totalReported,
            totalResolved,
            activeCitizens,
            resolvedComplaints,
        ] = await Promise.all([
            Complaint.countDocuments(),

            Complaint.countDocuments({
                status: "Resolved",
            }),

            User.countDocuments({
                role: "citizen",
            }),

            Complaint.find({
                status: "Resolved",
            }).select("createdAt updatedAt"),
        ]);

        let avgResolutionDays = 0;

        if (resolvedComplaints.length > 0) {
            const totalDays = resolvedComplaints.reduce(
                (sum, complaint) => {
                    const created = new Date(
                        complaint.createdAt
                    );

                    const resolved = new Date(
                        complaint.updatedAt
                    );

                    const days =
                        (resolved - created) /
                        (1000 * 60 * 60 * 24);

                    return sum + Math.max(days, 0);
                },
                0
            );

            avgResolutionDays =
                totalDays / resolvedComplaints.length;
        }

        return res.json({
            issuesReported: totalReported,
            issuesResolved: totalResolved,
            activeCitizens,
            avgResolutionDays:
                Math.round(avgResolutionDays * 10) / 10,
        });

    } catch (error) {
        console.error(
            "Public stats error:",
            error
        );

        return res.status(500).json({
            message:
                "Server error while loading platform stats",
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createComplaint,

    getMyComplaints,

    getComplaintById,

    getAllComplaints,

    updateComplaintStatus,

    getPublicStats,
};