const express = require("express");

const {
    registerUser,
    loginUser,
    sendPasswordResetOtp,
    verifyPasswordResetOtp,
    resetPassword,
} = require("../controllers/authController");

const protect =
    require("../middleware/authMiddleware");

const router =
    express.Router();


// =====================================================
// PUBLIC AUTH ROUTES
// =====================================================

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
    "/forgot-password/send-otp",
    sendPasswordResetOtp
);

router.post(
    "/forgot-password/verify-otp",
    verifyPasswordResetOtp
);

router.post(
    "/forgot-password/reset",
    resetPassword
);


// =====================================================
// PROTECTED TEST ROUTE
// =====================================================

router.get(
    "/protected",
    protect,
    (req, res) => {

        res.json({
            message:
                "You are authenticated",

            user:
                req.user,
        });
    }
);


module.exports = router;