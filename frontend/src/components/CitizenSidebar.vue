```vue
<template>

    <aside class="sidebar">

        <!-- BRAND -->
        <div class="logo">

            <div class="logo-icon">
                CL
            </div>

            <div class="brand-text">

                <h2>
                    Civic Lens
                </h2>

                <small>
                    Citizen Portal
                </small>

            </div>

        </div>


        <!-- NAVIGATION -->
        <nav>

            <RouterLink
                to="/dashboard"
            >
                <span class="nav-icon">🏠</span>
                <span>Dashboard</span>
            </RouterLink>


            <RouterLink
                to="/report"
            >
                <span class="nav-icon">📝</span>
                <span>Report Issue</span>
            </RouterLink>


            <RouterLink
                to="/reports"
            >
                <span class="nav-icon">📋</span>
                <span>My Reports</span>
            </RouterLink>


            <RouterLink
                to="/maps"
            >
                <span class="nav-icon">🗺️</span>
                <span>Maps</span>
            </RouterLink>


            <RouterLink
                to="/profile"
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
    useRouter
} from "vue-router";


const router = useRouter();


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

    router.push("/");

};

</script>


<style scoped>

/* =====================================================
   CITIZEN SIDEBAR
===================================================== */

.sidebar {

    /*
     * STICKY instead of FIXED.
     *
     * This is important because the sidebar remains
     * inside the flex layout and therefore reserves
     * its own 250px space.
     *
     * Result:
     * - sidebar stays visible
     * - main content never goes underneath it
     * - no overlap
     */

    position: sticky;

    top: 0;

    align-self: flex-start;

    width: 250px;

    min-width: 250px;

    height: 100vh;

    min-height: 100vh;

    box-sizing: border-box;

    background: white;

    border-right: 1px solid #e5e7eb;

    padding: 25px 15px;

    display: flex;

    flex-direction: column;

    flex-shrink: 0;

    overflow-y: auto;

    overflow-x: hidden;

    z-index: 100;

}


/* =====================================================
   LOGO / BRAND
===================================================== */

.logo {

    display: flex;

    align-items: center;

    gap: 10px;

    padding: 10px;

    margin-bottom: 35px;

    flex-shrink: 0;

}


.logo-icon {

    width: 42px;

    height: 42px;

    min-width: 42px;

    border-radius: 10px;

    background: #0a5fc4;

    color: white;

    display: grid;

    place-items: center;

    font-weight: bold;

}


.brand-text {

    min-width: 0;

}


.logo h2 {

    margin: 0;

    font-size: 19px;

    line-height: 1.2;

    color: #172033;

    white-space: nowrap;

}


.logo small {

    display: block;

    margin-top: 3px;

    color: #6b7280;

    white-space: nowrap;

}


/* =====================================================
   NAVIGATION
===================================================== */

nav {

    display: flex;

    flex-direction: column;

    gap: 7px;

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

    color: #374151;

    text-decoration: none;

    box-sizing: border-box;

    transition:
        background 0.2s ease,
        color 0.2s ease;

}


nav a:hover {

    background: #f3f6fa;

}


nav a.router-link-active {

    background: #eaf2ff;

    color: #0a5fc4;

    font-weight: 600;

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
   LOGOUT
===================================================== */

.logout {

    width: 100%;

    margin-top: auto;

    border: none;

    background: transparent;

    padding: 13px;

    text-align: left;

    color: #dc2626;

    cursor: pointer;

    border-radius: 9px;

    font-size: 15px;

    display: flex;

    align-items: center;

    gap: 12px;

    box-sizing: border-box;

}


.logout:hover {

    background: #fef2f2;

}


/* =====================================================
   SIDEBAR SCROLLBAR
===================================================== */

.sidebar::-webkit-scrollbar {

    width: 5px;

}


.sidebar::-webkit-scrollbar-thumb {

    background: #d1d5db;

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

    .logo {

        margin-bottom: 25px;

    }

}

</style>
```
