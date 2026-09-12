<template>
    <div class="page-layout">
        <CitizenSidebar />

        <main class="main-content">
            <h1>My Profile</h1>

            <div class="card profile">
                <div class="avatar">
                    {{ initials }}
                </div>

                <div class="form-group">
                    <label>Name</label>
                    <input v-model="form.name" />
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input
                        v-model="form.email"
                        type="email"
                    />
                </div>

                <div class="form-group">
                    <label>Mobile</label>
                    <input
                        v-model="form.mobile"
                    />
                </div>

                <h2>Change Password</h2>

                <div class="form-group">
                    <label>Old Password</label>
                    <input
                        v-model="password.oldPassword"
                        type="password"
                    />
                </div>

                <div class="form-group">
                    <label>New Password</label>
                    <input
                        v-model="password.newPassword"
                        type="password"
                    />
                </div>

                <div class="form-group">
                    <label>Confirm Password</label>
                    <input
                        v-model="password.confirmPassword"
                        type="password"
                    />
                </div>

                <button class="btn-primary">
                    Save Changes
                </button>
            </div>
        </main>
    </div>
</template>

<script setup>
import {
    computed,
    reactive,
} from "vue";

import CitizenSidebar from "../../components/CitizenSidebar.vue";

const user = JSON.parse(
    localStorage.getItem("user") || "{}"
);

const form = reactive({
    name: user.name || "",
    email: user.email || "",
    mobile: user.mobile || "",
});

const password = reactive({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
});

const initials = computed(() => {
    return form.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
});
</script>

<style scoped>
.profile {
    max-width: 700px;
    margin-top: 25px;
}

.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #0a5fc4;
    color: white;
    display: grid;
    place-items: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
}

h2 {
    margin: 30px 0 20px;
}
</style>