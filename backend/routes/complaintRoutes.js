const express = require("express");

const router = express.Router();

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus,
    getPublicStats,
} = require("../controllers/complaintController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// =====================================================
// PUBLIC
// =====================================================

// Platform-wide stats shown on the public homepage
router.get(
    "/public-stats",
    getPublicStats
);


// =====================================================
// CITIZEN
// =====================================================

// Create complaint
// Multer is required because the complaint contains
// text fields + optional images/videos.
router.post(
    "/",
    protect,
    upload.array("media", 10),
    createComplaint
);


// Get citizen's complaints
router.get(
    "/my",
    protect,
    getMyComplaints
);


// Get one complaint
router.get(
    "/:id",
    protect,
    getComplaintById
);


// =====================================================
// ADMIN
// =====================================================

// Get all complaints
router.get(
    "/admin/complaints",
    protect,
    getAllComplaints
);


// Update complaint status
router.put(
    "/admin/:id/status",
    protect,
    updateComplaintStatus
);


module.exports = router;