<template>
    <div class="page-layout">

        <AdminSidebar />

        <main class="main-content">

            <h1>
                Administrator Profile
            </h1>

            <p class="subtitle">
                Manage your administrator account.
            </p>


            <div
                v-if="error"
                class="error"
            >
                {{ error }}
            </div>


            <div
                v-if="message"
                class="success"
            >
                {{ message }}
            </div>


            <div class="card profile-card">

                <div class="profile-header">

                    <div class="avatar">

                        {{
                            initials
                        }}

                    </div>

                    <div>
                        <h2>
                            {{ form.name }}
                        </h2>

                        <p>
                            {{ roleName }}
                        </p>
                    </div>

                </div>


                <div class="form-grid">

                    <div class="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            v-model="form.name"
                            type="text"
                        />

                    </div>


                    <div class="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            v-model="form.email"
                            type="email"
                        />

                    </div>


                    <div class="form-group">

                        <label>
                            Mobile Number
                        </label>

                        <input
                            v-model="form.mobile"
                            type="tel"
                        />

                    </div>

                </div>


                <button
                    class="save"
                    @click="saveProfile"
                    :disabled="saving"
                >
                    {{
                        saving
                            ? "Saving..."
                            : "Save Profile"
                    }}
                </button>

            </div>


            <div class="card password-card">

                <h2>
                    Change Password
                </h2>

                <p>
                    Use your old password to create a new password.
                </p>


                <div class="form-group">

                    <label>
                        Old Password
                    </label>

                    <input
                        v-model="
                            password.oldPassword
                        "
                        type="password"
                    />

                </div>


                <div class="form-group">

                    <label>
                        New Password
                    </label>

                    <input
                        v-model="
                            password.newPassword
                        "
                        type="password"
                    />

                </div>


                <button
                    class="save"
                    @click="changePassword"
                    :disabled="changingPassword"
                >
                    {{
                        changingPassword
                            ? "Changing..."
                            : "Change Password"
                    }}
                </button>

            </div>

        </main>

    </div>
</template>


<script setup>

import {
    computed,
    onMounted,
    reactive,
    ref,
} from "vue";

import AdminSidebar from
    "../../components/AdminSidebar.vue";

import api from
    "../../services/api";


const form =
    reactive({

        name: "",

        email: "",

        mobile: "",

    });


const password =
    reactive({

        oldPassword: "",

        newPassword: "",

    });


const role =
    ref("");


const saving =
    ref(false);

const changingPassword =
    ref(false);

const error =
    ref("");

const message =
    ref("");


const initials =
    computed(() => {

        return form.name
            .split(" ")
            .filter(Boolean)
            .map(
                word =>
                    word[0]
            )
            .join("")
            .slice(0, 2)
            .toUpperCase();

    });


const roleName =
    computed(() => {

        if (
            role.value ===
            "collector"
        ) {
            return "Collector";
        }

        return "Administrative Officer";
    });


const loadProfile =
    async () => {

        try {

            const response =
                await api.get(
                    "/admin/profile"
                );


            form.name =
                response.data.name ||
                "";

            form.email =
                response.data.email ||
                "";

            form.mobile =
                response.data.mobile ||
                "";

            role.value =
                response.data.role ||
                "";


        } catch (err) {

            console.error(err);

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to load profile";
        }
    };


const saveProfile =
    async () => {

        try {

            saving.value =
                true;

            error.value =
                "";

            message.value =
                "";


            const response =
                await api.put(
                    "/admin/profile",
                    {
                        name:
                            form.name,

                        email:
                            form.email,

                        mobile:
                            form.mobile,
                    }
                );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );


            message.value =
                "Profile updated successfully.";

        } catch (err) {

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to update profile";

        } finally {

            saving.value =
                false;
        }
    };


const changePassword =
    async () => {

        try {

            changingPassword.value =
                true;

            error.value =
                "";

            message.value =
                "";


            const response =
                await api.put(
                    "/admin/change-password",
                    {
                        oldPassword:
                            password.oldPassword,

                        newPassword:
                            password.newPassword,
                    }
                );


            message.value =
                response.data.message;


            password.oldPassword =
                "";

            password.newPassword =
                "";

        } catch (err) {

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to change password";

        } finally {

            changingPassword.value =
                false;
        }
    };


onMounted(
    loadProfile
);

</script>


<style scoped>

.subtitle {
    color: #6b7280;
    margin-top: 5px;
}

.profile-card,
.password-card {
    max-width: 800px;
    margin-top: 25px;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.profile-header p {
    color: #6b7280;
}

.avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #0a5fc4;
    color: white;
    font-size: 28px;
    font-weight: 800;
}

.form-grid {
    display: grid;
    grid-template-columns:
        repeat(2, 1fr);
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.form-group label {
    font-weight: 600;
}

input {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
}

.save {
    border: none;
    padding: 13px 20px;
    border-radius: 8px;
    background: #0a5fc4;
    color: white;
    cursor: pointer;
}

.save:disabled {
    opacity: .6;
}

.success {
    max-width: 800px;
    margin-top: 15px;
    padding: 12px;
    background: #dcfce7;
    color: #166534;
    border-radius: 8px;
}

.error {
    max-width: 800px;
    margin-top: 15px;
    padding: 12px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 8px;
}

.password-card {
    margin-bottom: 30px;
}

.password-card p {
    color: #6b7280;
}

@media (max-width: 700px) {

    .form-grid {
        grid-template-columns: 1fr;
    }

}

</style>