<template>
    <SiteHeader
        :breadcrumb="breadcrumb"
        :show-auth-buttons="showAuthButtons()"
    />

    <router-view />

    <SiteFooter />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";

const route = useRoute();

const AUTH_PAGES = ["/login", "/register", "/admin/login"];

// Re-evaluated on every render (route change, login, logout)
// rather than cached, since localStorage isn't reactive.
const showAuthButtons = () => {
    const isLoggedIn = !!localStorage.getItem("token");
    return !isLoggedIn && !AUTH_PAGES.includes(route.path);
};

const breadcrumb = computed(() => {
    const label = route.meta?.breadcrumb;
    return label ? [{ label }] : [];
});
</script>
