const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
    loginAdmin,
    getAllComplaints,
    getDashboardStats,
    getAdminComplaintById,
    updateComplaint,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
} = require("../controllers/adminController");

const router = express.Router();


// Public admin login
router.post(
    "/login",
    loginAdmin
);


// Everything below requires admin authentication
router.use(
    protect,
    adminOnly
);


// Dashboard
router.get(
    "/dashboard",
    getDashboardStats
);


// Complaints
router.get(
    "/complaints",
    getAllComplaints
);

router.get(
    "/complaints/:id",
    getAdminComplaintById
);

router.put(
    "/complaints/:id",
    updateComplaint
);


// Profile
router.get(
    "/profile",
    getAdminProfile
);

router.put(
    "/profile",
    updateAdminProfile
);


// Password
router.put(
    "/change-password",
    changeAdminPassword
);


module.exports = router;