<template>
    <div class="admin-login-page">
        <section class="content">
            <!-- INFO CARD -->
            <div class="card guide-card">
                <div class="card-heading">
                    <span class="icon-badge icon-navy">
                        <i class="fa-solid fa-shield-halved"></i>
                    </span>
                    <h2>Administrative Access</h2>
                </div>

                <div class="info-banner">
                    <i class="fa-solid fa-circle-info"></i>
                    This portal is restricted to authorised administrative officers
                    and collectors of Civic Lens.
                </div>

                <div class="sub-heading">
                    <i class="fa-solid fa-list-check"></i>
                    <strong>Officer Responsibilities</strong>
                </div>

                <ol class="numbered-list">
                    <li><span>1</span> Review and verify citizen-reported complaints</li>
                    <li><span>2</span> Assign complaints to the concerned department</li>
                    <li><span>3</span> Update complaint status &amp; resolution progress</li>
                    <li><span>4</span> Monitor city-wide analytics and resolution SLAs</li>
                </ol>

                <hr />

                <div class="sub-heading">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <strong>Security Notice</strong>
                </div>

                <ol class="numbered-list">
                    <li><span>1</span> Never share your login credentials with anyone</li>
                    <li><span>2</span> Always log out after completing your session</li>
                    <li><span>3</span> Report suspicious activity to the IT helpdesk</li>
                </ol>
            </div>

            <!-- LOGIN CARD -->
            <div class="card auth-card">
                <div class="card-heading">
                    <span class="icon-badge icon-teal">
                        <i class="fa-solid fa-user-shield"></i>
                    </span>
                    <h2>Admin Login</h2>
                </div>

                <p class="subtitle">Sign in to the Civic Lens administration portal</p>

                <hr />

                <div v-if="error" class="error">
                    {{ error }}
                </div>

                <form @submit.prevent="login">
                    <div class="form-group">
                        <label>Email Address <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-envelope"></i>
                            <input
                                v-model="email"
                                type="email"
                                placeholder="admin@civiclens.com"
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
                                placeholder="Enter password"
                                required
                            />
                        </div>
                    </div>

                    <div class="forgot">
                        <RouterLink to="/forgot-password">
                            Forgot Password? &gt;
                        </RouterLink>
                    </div>

                    <div class="btn-row">
                        <button type="button" class="btn-clear" @click="clearForm">
                            <i class="fa-solid fa-xmark"></i>
                            Clear
                        </button>

                        <button type="submit" class="btn-submit" :disabled="loading">
                            <i class="fa-solid fa-right-to-bracket"></i>
                            {{ loading ? "Signing in..." : "Admin Login" }}
                        </button>
                    </div>
                </form>

                <RouterLink
                    to="/login"
                    class="citizen-link"
                >
                    Citizen Login
                </RouterLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../../services/api";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const clearForm = () => {
    email.value = "";
    password.value = "";
    error.value = "";
};

const login = async () => {
    loading.value = true;
    error.value = "";

    try {
        const response = await api.post(
            "/admin/login",
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
            "admin"
        );

        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        router.push("/admin/dashboard");

    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Admin login failed";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.admin-login-page {
    min-height: 100vh;
    background:
        linear-gradient(180deg, #eaf4ff 0%, #f5f7fa 30%),
        linear-gradient(160deg, #dbeeff, #eafffb);
}

.content {
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

.subtitle {
    color: #6b7280;
    margin-bottom: 4px;
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

.icon-navy { background: #123a8c; }
.icon-teal { background: #00b39a; }

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
    color: #123a8c;
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
    background: #123a8c;
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

.forgot {
    text-align: right;
    margin-bottom: 20px;
}

.forgot a {
    color: #4338ca;
    font-weight: 600;
}

.btn-row {
    display: flex;
    gap: 14px;
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
    background: linear-gradient(135deg, #123a8c, #0a5fc4);
    color: white;
}

.btn-submit:disabled {
    opacity: 0.7;
}

.error {
    background: #fee2e2;
    color: #b91c1c;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.citizen-link {
    display: block;
    text-align: center;
    margin-top: 20px;
    color: #0a5fc4;
    font-weight: 600;
}

@media (max-width: 900px) {
    .content {
        grid-template-columns: 1fr;
    }
}
</style>
