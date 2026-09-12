<template>
    <div class="login-page">
        <section class="content">
            <!-- CHECKLIST CARD -->
            <div class="card checklist-card">
                <div class="card-heading">
                    <span class="icon-badge icon-blue">
                        <i class="fa-solid fa-clipboard-check"></i>
                    </span>
                    <h2>Check list for Complaint</h2>
                </div>

                <div class="info-banner">
                    <i class="fa-solid fa-circle-info"></i>
                    Please keep this information ready before filing your complaint:
                </div>

                <div class="sub-heading">
                    <i class="fa-solid fa-file-lines"></i>
                    <strong>Mandatory Information</strong>
                </div>

                <ol class="numbered-list">
                    <li><span>1</span> Incident Date and Time</li>
                    <li><span>2</span> Incident details (minimum 100 characters) without any special character (@#!%^&amp;*)</li>
                </ol>

                <hr />

                <div class="sub-heading">
                    <i class="fa-solid fa-circle-info"></i>
                    <strong>Complaining Instructions</strong>
                </div>

                <ol class="numbered-list">
                    <li><span>1</span> Please provide accurate information to help us process your complaint faster</li>
                    <li><span>2</span> A clear description of issue</li>
                    <li><span>3</span> Exact or nearby location of the issue</li>
                    <li><span>4</span> A photo/video showing the issue</li>
                    <li><span>5</span> Date and approximate time when you noticed it</li>
                    <li><span>6</span> Any additional information that may help resolve it</li>
                </ol>
            </div>

            <!-- LOGIN CARD -->
            <div class="card auth-card">
                <div class="card-heading">
                    <span class="icon-badge icon-teal">
                        <i class="fa-solid fa-user"></i>
                    </span>
                    <h2>Citizen Login</h2>

                    <RouterLink to="/register" class="new-user">
                        <i class="fa-solid fa-user-plus"></i>
                        Click Here for New User
                    </RouterLink>
                </div>

                <hr />

                <div v-if="error" class="error">
                    {{ error }}
                </div>

                <form @submit.prevent="login">
                    <div class="form-group">
                        <label>Login ID <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-user"></i>
                            <input
                                v-model="email"
                                type="email"
                                placeholder="Enter your Login ID"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Password <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-lock"></i>
                            <input
                                v-model="password"
                                type="password"
                                placeholder="Enter your Password"
                                required
                            />
                        </div>
                    </div>

                    <div class="btn-row">
                        <button type="button" class="btn-clear" @click="clearForm">
                            <i class="fa-solid fa-xmark"></i>
                            Clear
                        </button>

                        <button type="submit" class="btn-submit" :disabled="loading">
                            <i class="fa-solid fa-right-to-bracket"></i>
                            {{ loading ? "Logging in..." : "Submit" }}
                        </button>
                    </div>
                </form>

                <div class="forgot">
                    <RouterLink to="/forgot-password">
                        Forgot User ID ? &gt;
                    </RouterLink>
                </div>

                <p class="bottom">
                    Don't have an account?
                    <RouterLink to="/register">
                        Register
                    </RouterLink>
                </p>

                <RouterLink
                    to="/admin/login"
                    class="admin-link"
                >
                    Administrative Login
                </RouterLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const login = async () => {
    error.value = "";
    loading.value = true;

    try {
        const response = await api.post(
            "/auth/login",
            {
                email: email.value,
                password: password.value,
            }
        );

        localStorage.setItem(
            "token",
            response.data.token
        );

        localStorage.setItem(
            "role",
            response.data.user.role
        );

        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        router.push(
            response.data.user.role === "admin"
                ? "/admin/dashboard"
                : "/dashboard"
        );

    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Login failed";
    } finally {
        loading.value = false;
    }
};

const clearForm = () => {
    email.value = "";
    password.value = "";
    error.value = "";
};
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background:
        linear-gradient(180deg, #eaf4ff 0%, #f5f7fa 30%),
        linear-gradient(160deg, #dbeeff, #eafffb);
}

.content {
    flex: 1;
    max-width: 1300px;
    width: 100%;
    margin: 0 auto;
    padding: 30px 5% 60px;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 24px;
    align-items: start;
}

.card {
    background: white;
    border-radius: 14px;
    padding: 26px 28px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.card-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 6px;
}

.card-heading h2 {
    font-size: 20px;
    color: #111827;
}

.icon-badge {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: white;
    font-size: 15px;
    flex-shrink: 0;
}

.icon-blue { background: #0a5fc4; }
.icon-teal { background: #00b39a; }

.new-user {
    margin-left: auto;
    color: #4338ca;
    font-weight: 600;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.info-banner {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #eaf4ff;
    color: #123a8c;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    margin: 16px 0 18px;
}

.sub-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0a5fc4;
    margin: 14px 0 10px;
}

.numbered-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.numbered-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 14px;
    color: #374151;
}

.numbered-list li span {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0a5fc4;
    color: white;
    font-size: 11px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
    margin-top: 1px;
}

hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 18px 0;
}

/* LOGIN FORM */
.req {
    color: #dc2626;
}

.input-icon {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon i {
    position: absolute;
    left: 14px;
    color: #9ca3af;
}

.input-icon input {
    padding-left: 38px;
}

.btn-row {
    display: flex;
    gap: 14px;
    margin-top: 8px;
}

.btn-clear,
.btn-submit {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 10px;
    padding: 12px 20px;
    font-weight: 700;
    border: none;
}

.btn-clear {
    background: white;
    border: 1px solid #111827;
    color: #111827;
}

.btn-submit {
    background: linear-gradient(135deg, #16a34a, #15803d);
    color: white;
}

.btn-submit:disabled {
    opacity: 0.7;
}

.forgot {
    margin-top: 18px;
}

.forgot a {
    color: #4338ca;
    font-weight: 600;
}

.bottom {
    text-align: center;
    margin-top: 20px;
}

.bottom a,
.admin-link {
    color: #0a5fc4;
    font-weight: 600;
}

.admin-link {
    display: block;
    text-align: center;
    margin-top: 16px;
}

@media (max-width: 900px) {
    .content {
        grid-template-columns: 1fr;
    }
}
</style>
