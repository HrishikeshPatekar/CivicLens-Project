```vue
<template>

    <aside class="sidebar">

        <!-- BRAND -->
        <div class="brand">

            <div class="logo">
                CL
            </div>

            <div class="brand-text">
                <h2>Civic Lens</h2>

                <small>
                    Admin Portal
                </small>
            </div>

        </div>


        <!-- NAVIGATION -->
        <nav>

            <RouterLink
                to="/admin/dashboard"
            >
                <span class="nav-icon">🏠</span>
                <span>Dashboard</span>
            </RouterLink>


            <RouterLink
                to="/admin/complaints"
            >
                <span class="nav-icon">📋</span>
                <span>Complaints</span>
            </RouterLink>


            <RouterLink
                to="/admin/analytics"
            >
                <span class="nav-icon">📊</span>
                <span>Analytics</span>
            </RouterLink>


            <RouterLink
                to="/admin/maps"
            >
                <span class="nav-icon">🗺️</span>
                <span>Complaint Map</span>
            </RouterLink>


            <RouterLink
                to="/admin/profile"
            >
                <span class="nav-icon">👤</span>
                <span>Profile</span>
            </RouterLink>


            <!-- LOGOUT -->
            <button
                class="logout"
                @click="logout"
            >
                <span class="nav-icon">🚪</span>
                <span>Logout</span>
            </button>

        </nav>

    </aside>

</template>


<script setup>

import {
    computed
} from "vue";

import {
    useRouter
} from "vue-router";


const router = useRouter();


const user =
    JSON.parse(
        localStorage.getItem("user") || "{}"
    );


const adminName =
    computed(
        () =>
            user.name ||
            "Administrator"
    );


const roleName =
    computed(() => {

        if (
            user.role === "collector"
        ) {
            return "Collector";
        }

        return "Administrative Officer";

    });


const logout = () => {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "role"
    );

    localStorage.removeItem(
        "user"
    );

    router.push(
        "/admin/login"
    );

};

</script>


<style scoped>

/* =====================================================
   ADMIN SIDEBAR
===================================================== */

.sidebar {

    /*
     * IMPORTANT:
     * sticky keeps the sidebar in the normal page layout.
     * Therefore the right-side content will NEVER go
     * underneath the sidebar.
     */
    position: sticky;

    top: 0;

    align-self: flex-start;

    width: 255px;

    min-width: 255px;

    height: 100vh;

    min-height: 100vh;

    box-sizing: border-box;

    background: #111827;

    color: white;

    padding: 22px 15px;

    display: flex;

    flex-direction: column;

    flex-shrink: 0;

    overflow-y: auto;

    overflow-x: hidden;

    z-index: 100;

}


/* =====================================================
   BRAND
===================================================== */

.brand {

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 10px;

    margin-bottom: 35px;

    flex-shrink: 0;

}


.logo {

    width: 43px;

    height: 43px;

    min-width: 43px;

    border-radius: 10px;

    background: #0a5fc4;

    display: grid;

    place-items: center;

    font-weight: 800;

    font-size: 16px;

}


.brand-text {

    min-width: 0;

}


.brand h2 {

    margin: 0;

    font-size: 20px;

    line-height: 1.2;

    white-space: nowrap;

}


.brand small {

    display: block;

    margin-top: 3px;

    color: #9ca3af;

    white-space: nowrap;

}


/* =====================================================
   NAVIGATION
===================================================== */

nav {

    display: flex;

    flex-direction: column;

    gap: 6px;

    width: 100%;

}


/* =====================================================
   NAV LINKS
===================================================== */

nav a {

    width: 100%;

    display: flex;

    align-items: center;

    gap: 12px;

    padding: 13px;

    border-radius: 9px;

    color: #d1d5db;

    text-decoration: none;

    transition:
        background 0.2s ease,
        color 0.2s ease;

    box-sizing: border-box;

}


nav a:hover {

    background: #1f2937;

    color: white;

}


nav a.router-link-active {

    background: #1d4ed8;

    color: white;

}


/* =====================================================
   ICON
===================================================== */

.nav-icon {

    width: 22px;

    min-width: 22px;

    text-align: center;

    font-size: 17px;

}


/* =====================================================
   ADMIN INFORMATION
===================================================== */

.admin-info {

    border-top: 1px solid #374151;

    padding: 18px 10px;

    display: flex;

    flex-direction: column;

    gap: 5px;

}


.admin-info small {

    color: #9ca3af;

}


/* =====================================================
   LOGOUT
===================================================== */

.logout {

    width: 100%;

    border: none;

    background: transparent;

    color: #fca5a5;

    text-align: left;

    padding: 13px;

    cursor: pointer;

    border-radius: 8px;

    font-size: 15px;

    display: flex;

    align-items: center;

    gap: 12px;

    box-sizing: border-box;

}


.logout:hover {

    background: #1f2937;

}


/* =====================================================
   SIDEBAR SCROLLBAR
===================================================== */

.sidebar::-webkit-scrollbar {

    width: 5px;

}


.sidebar::-webkit-scrollbar-thumb {

    background: #374151;

    border-radius: 10px;

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 768px) {

    .sidebar {

        width: 220px;

        min-width: 220px;

        padding: 18px 10px;

    }

    .brand {

        margin-bottom: 25px;

    }

    .brand h2 {

        font-size: 18px;

    }

}

</style>

