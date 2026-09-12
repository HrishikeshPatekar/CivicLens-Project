<template>
    <div class="site-header">
        <!-- TOP GOVERNMENT STRIP -->
        <div class="gov-strip">
            <div class="gov-brand">
                <svg
                    class="emblem"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                >
                    <circle cx="32" cy="32" r="30" fill="#ffffff" opacity="0.15" />
                    <circle cx="32" cy="32" r="24" fill="none" stroke="#ffffff" stroke-width="2" />
                    <circle cx="32" cy="32" r="3" fill="#ffffff" />
                    <g stroke="#ffffff" stroke-width="1.4">
                        <line
                            v-for="n in 24"
                            :key="n"
                            x1="32"
                            y1="32"
                            :x2="32 + 24 * Math.cos((n * Math.PI) / 12)"
                            :y2="32 + 24 * Math.sin((n * Math.PI) / 12)"
                        />
                    </g>
                </svg>
                <div class="gov-text">
                    <strong>भारत सरकार</strong>
                    <span>Government of India</span>
                </div>
            </div>

            <button type="button" class="lang-btn">
                <i class="fa-solid fa-globe"></i>
                Language
            </button>
        </div>

        <!-- SITE TITLE -->
        <div class="title-bar">
            <RouterLink to="/" class="title-link">
                Civic Lens - National Platform for Reporting Issue &amp; Resolution
            </RouterLink>
        </div>

        <!-- MAIN NAV -->
        <nav class="nav-bar">
            <div class="nav-links">
                <RouterLink to="/" exact-active-class="active">Home</RouterLink>
                <RouterLink to="/explore" active-class="active">Explore More</RouterLink>
                <RouterLink to="/about" active-class="active">About US</RouterLink>
                <RouterLink to="/contact" active-class="active">Contact US</RouterLink>
                <RouterLink to="/help" active-class="active">Help</RouterLink>
            </div>

            <div v-if="showAuthButtons" class="nav-actions">
                <RouterLink to="/login" class="pill pill-outline">Login</RouterLink>
                <RouterLink to="/register" class="pill pill-solid">Register</RouterLink>
            </div>
        </nav>

        <!-- BREADCRUMB -->
        <div v-if="breadcrumb && breadcrumb.length" class="breadcrumb-bar">
            <i class="fa-solid fa-house"></i>

            <template v-for="(crumb, idx) in breadcrumb" :key="idx">
                <span class="sep">&gt;</span>
                <RouterLink v-if="crumb.to" :to="crumb.to">
                    {{ crumb.label }}
                </RouterLink>
                <span v-else class="current">{{ crumb.label }}</span>
            </template>
        </div>
    </div>
</template>

<script setup>
defineProps({
    showAuthButtons: {
        type: Boolean,
        default: true,
    },
    breadcrumb: {
        type: Array,
        default: () => [],
    },
});
</script>

<style scoped>
.site-header {
    width: 100%;
    background: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* GOV STRIP */
.gov-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 5%;
    background: linear-gradient(90deg, #0a5fc4, #00c9b1);
    color: white;
}

.gov-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.emblem {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
}

.gov-text {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
}

.gov-text strong {
    font-size: 13px;
}

.gov-text span {
    font-size: 11px;
    opacity: 0.9;
}

.lang-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    color: white;
    font-weight: 600;
    font-size: 13px;
}

/* TITLE */
.title-bar {
    padding: 18px 5%;
    text-align: center;
}

.title-link {
    font-size: clamp(18px, 2.6vw, 30px);
    font-weight: 700;
    color: #123a8c;
}

/* NAV */
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 5%;
    background: linear-gradient(90deg, #0f7bd8, #00c9b1);
    flex-wrap: wrap;
    gap: 12px;
}

.nav-links {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
}

.nav-links a {
    color: white;
    font-weight: 700;
    font-size: 15px;
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;
}

.nav-links a.active,
.nav-links a:hover {
    border-bottom-color: white;
}

.nav-actions {
    display: flex;
    gap: 10px;
}

.pill {
    padding: 8px 20px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 14px;
}

.pill-outline {
    background: white;
    color: #0a5fc4;
}

.pill-solid {
    background: #123a8c;
    color: white;
}

/* BREADCRUMB */
.breadcrumb-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 5%;
    background: #f3f4f6;
    color: #4b5563;
    font-size: 14px;
}

.breadcrumb-bar a {
    color: #0f7bd8;
}

.breadcrumb-bar .current {
    color: #111827;
    font-weight: 600;
}

.breadcrumb-bar .sep {
    color: #9ca3af;
}

@media (max-width: 768px) {
    .nav-links {
        gap: 14px;
        font-size: 13px;
    }

    .title-bar {
        padding: 14px 5%;
    }
}
</style>
