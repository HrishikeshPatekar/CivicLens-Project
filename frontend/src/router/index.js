import {
    createRouter,
    createWebHistory,
} from "vue-router";


import Home
    from "../views/Home.vue";

import Login
    from "../views/Login.vue";

import Register
    from "../views/Register.vue";

import ForgotPassword
    from "../views/ForgotPassword.vue";

import ComplaintSubmitted
    from "../views/ComplaintSubmitted.vue";

import ExploreMore
    from "../views/info/ExploreMore.vue";

import AboutUs
    from "../views/info/AboutUs.vue";

import ContactUs
    from "../views/info/ContactUs.vue";

import Help
    from "../views/info/Help.vue";


import CitizenDashboard
    from "../views/citizen/Dashboard.vue";

import ReportIssue
    from "../views/citizen/ReportIssue.vue";

import MyReports
    from "../views/citizen/MyReports.vue";

import TrackComplaint
    from "../views/citizen/TrackComplaint.vue";

import CitizenMaps
    from "../views/citizen/Maps.vue";

import CitizenProfile
    from "../views/citizen/Profile.vue";


import AdminLogin
    from "../views/admin/Login.vue";

import AdminDashboard
    from "../views/admin/Dashboard.vue";

import AdminComplaints
    from "../views/admin/Complaints.vue";

import ComplaintDetails
    from "../views/admin/ComplaintDetails.vue";

import AdminAnalytics
    from "../views/admin/Analytics.vue";

import AdminMaps
    from "../views/admin/Maps.vue";

import AdminProfile
    from "../views/admin/Profile.vue";


const routes = [

    // ==========================================
    // CITIZEN
    // ==========================================

    {
        path: "/",
        component: Home,
    },

    {
        path: "/explore",
        component: ExploreMore,

        meta: {
            breadcrumb: "Explore More",
        },
    },

    {
        path: "/about",
        component: AboutUs,

        meta: {
            breadcrumb: "About US",
        },
    },

    {
        path: "/contact",
        component: ContactUs,

        meta: {
            breadcrumb: "Contact US",
        },
    },

    {
        path: "/help",
        component: Help,

        meta: {
            breadcrumb: "Help",
        },
    },

    {
        path: "/login",
        component: Login,

        meta: {
            breadcrumb: "Login",
        },
    },

    {
        path: "/register",
        component: Register,

        meta: {
            breadcrumb: "Register",
        },
    },

    {
        path: "/forgot-password",
        component: ForgotPassword,

        meta: {
            breadcrumb: "Forgot Password",
        },
    },

    {
        path: "/complaint-submitted/:id",
        component: ComplaintSubmitted,

        meta: {
            requiresAuth: true,
            role: "citizen",
            breadcrumb: "Complaint Submitted",
        },
    },

    {
        path: "/dashboard",
        component: CitizenDashboard,

        meta: {
            requiresAuth: true,
            role: "citizen",
            breadcrumb: "Dashboard",
        },
    },

    {
        path: "/report",
        component: ReportIssue,

        meta: {
            requiresAuth: true,
            role: "citizen",
            breadcrumb: "Report Issue",
        },
    },

    {
        path: "/reports",
        component: MyReports,

        meta: {
            requiresAuth: true,
            role: "citizen",
            breadcrumb: "My Reports",
        },
    },

    {
        path: "/track/:id",
        component: TrackComplaint,

        meta: {
            requiresAuth: true,
            role: "citizen",
            breadcrumb: "Track Complaint",
        },
    },

    {
        path: "/maps",
        component: CitizenMaps,

        meta: {
            requiresAuth: true,
            role: "citizen",
            breadcrumb: "Maps",
        },
    },

    {
        path: "/profile",
        component: CitizenProfile,

        meta: {
            requiresAuth: true,
            role: "citizen",
            breadcrumb: "Profile",
        },
    },


    // ==========================================
    // ADMIN
    // ==========================================

    {
        path: "/admin/login",

        name: "AdminLogin",

        component: AdminLogin,

        meta: {
            breadcrumb: "Administrative Login",
        },
    },


    {
        path: "/admin/dashboard",

        name: "AdminDashboard",

        component: AdminDashboard,

        meta: {
            requiresAuth: true,
            role: "admin",
            breadcrumb: "Admin Dashboard",
        },
    },


    {
        path: "/admin/complaints",

        name: "AdminComplaints",

        component: AdminComplaints,

        meta: {
            requiresAuth: true,
            role: "admin",
            breadcrumb: "Complaints",
        },
    },


    {
        path: "/admin/complaints/:id",

        name: "ComplaintDetails",

        component: ComplaintDetails,

        meta: {
            requiresAuth: true,
            role: "admin",
            breadcrumb: "Complaint Details",
        },
    },


    // ==========================================
    // ADMIN ANALYTICS
    // ==========================================

    {
        path: "/admin/analytics",

        name: "AdminAnalytics",

        component: AdminAnalytics,

        meta: {
            requiresAuth: true,
            role: "admin",
            breadcrumb: "Analytics",
        },
    },


    {
        path: "/admin/maps",

        name: "AdminMaps",

        component: AdminMaps,

        meta: {
            requiresAuth: true,
            role: "admin",
            breadcrumb: "Maps",
        },
    },


    {
        path: "/admin/profile",

        name: "AdminProfile",

        component: AdminProfile,

        meta: {
            requiresAuth: true,
            role: "admin",
            breadcrumb: "Profile",
        },
    },

];


const router =
    createRouter({

        history:
            createWebHistory(),

        routes,

    });


router.beforeEach(
    (to) => {

        const token =
            localStorage.getItem(
                "token"
            );

        const role =
            localStorage.getItem(
                "role"
            );


        // ==========================================
        // PROTECTED ROUTE WITHOUT LOGIN
        // ==========================================

        if (
            to.meta.requiresAuth &&
            !token
        ) {

            if (
                to.meta.role ===
                "admin"
            ) {

                return "/admin/login";

            }

            return "/login";

        }


        // ==========================================
        // WRONG ROLE
        // ==========================================

        if (
            to.meta.requiresAuth &&
            to.meta.role &&
            role !== to.meta.role
        ) {

            if (
                role === "admin"
            ) {

                return "/admin/dashboard";

            }


            if (
                role === "citizen"
            ) {

                return "/dashboard";

            }


            return "/login";

        }


        // ==========================================
        // LOGGED-IN USER VISITS LOGIN
        // ==========================================

        if (
            (
                to.path === "/login" ||
                to.path === "/register"
            ) &&
            token
        ) {

            if (
                role === "admin"
            ) {

                return "/admin/dashboard";

            }


            if (
                role === "citizen"
            ) {

                return "/dashboard";

            }

        }


        // ==========================================
        // ADMIN LOGIN
        // ==========================================

        if (
            to.path ===
                "/admin/login" &&
            token &&
            role === "admin"
        ) {

            return "/admin/dashboard";

        }


        return true;

    }
);


export default router;