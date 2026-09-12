<template>
    <div class="register-page">
        <section class="content">
            <!-- GUIDELINES CARD -->
            <div class="card guide-card">
                <div class="card-heading">
                    <span class="icon-badge icon-blue">
                        <i class="fa-solid fa-circle-info"></i>
                    </span>
                    <h2>Before You Register</h2>
                </div>

                <div class="info-banner">
                    <i class="fa-solid fa-circle-info"></i>
                    Keep the following details ready to create your Citizen account:
                </div>

                <div class="sub-heading">
                    <i class="fa-solid fa-file-lines"></i>
                    <strong>Required Details</strong>
                </div>

                <ol class="numbered-list">
                    <li><span>1</span> Full name as per your government ID</li>
                    <li><span>2</span> A valid, active email address</li>
                    <li><span>3</span> A 10-digit mobile number for OTP &amp; alerts</li>
                    <li><span>4</span> A password of at least 8 characters</li>
                </ol>

                <hr />

                <div class="sub-heading">
                    <i class="fa-solid fa-shield-halved"></i>
                    <strong>Why Register?</strong>
                </div>

                <ol class="numbered-list">
                    <li><span>1</span> Report civic issues in your area</li>
                    <li><span>2</span> Track the status of your complaints</li>
                    <li><span>3</span> Get notified when your issue is resolved</li>
                    <li><span>4</span> Help make your city better</li>
                </ol>
            </div>

            <!-- REGISTER CARD -->
            <div class="card auth-card">
                <div class="card-heading">
                    <span class="icon-badge icon-teal">
                        <i class="fa-solid fa-user-plus"></i>
                    </span>
                    <h2>Citizen Registration</h2>

                    <RouterLink to="/login" class="new-user">
                        <i class="fa-solid fa-right-to-bracket"></i>
                        Already Registered? Login
                    </RouterLink>
                </div>

                <hr />

                <div v-if="error" class="error">
                    {{ error }}
                </div>

                <form @submit.prevent="register">
                    <div class="form-group">
                        <label>Full Name <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-user"></i>
                            <input
                                v-model="form.name"
                                type="text"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Email <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-envelope"></i>
                            <input
                                v-model="form.email"
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Mobile Number <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-phone"></i>
                            <input
                                v-model="form.mobile"
                                type="tel"
                                placeholder="Enter your mobile number"
                                required
                            />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Password <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-lock"></i>
                            <input
                                v-model="form.password"
                                type="password"
                                placeholder="Enter password"
                                minlength="8"
                                required
                            />
                        </div>
                        <small class="hint">
                            Password must be at least 8 characters.
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Confirm Password <span class="req">*</span></label>
                        <div class="input-icon">
                            <i class="fa-solid fa-lock"></i>
                            <input
                                v-model="form.confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                minlength="8"
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
                            <i class="fa-solid fa-user-plus"></i>
                            {{ loading ? "Creating..." : "Create Account" }}
                        </button>
                    </div>
                </form>

                <p class="bottom">
                    Already have an account?
                    <RouterLink to="/login">
                        Login
                    </RouterLink>
                </p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const loading = ref(false);
const error = ref("");

const form = reactive({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
});

const clearForm = () => {
    form.name = "";
    form.email = "";
    form.mobile = "";
    form.password = "";
    form.confirmPassword = "";
    error.value = "";
};

const register = async () => {
    error.value = "";

    // ==========================================
    // FRONTEND PASSWORD VALIDATION
    // ==========================================

    if (form.password.length < 8) {
        error.value =
            "Password must be at least 8 characters.";

        return;
    }

    if (form.confirmPassword.length < 8) {
        error.value =
            "Confirm password must be at least 8 characters.";

        return;
    }

    if (
        form.password !==
        form.confirmPassword
    ) {
        error.value =
            "Passwords do not match.";

        return;
    }

    loading.value = true;

    try {
        await api.post("/auth/register", {
            name: form.name,
            email: form.email,
            mobile: form.mobile,
            password: form.password,
        });

        router.push("/login");

    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Registration failed";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.register-page {
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

.hint {
    display: block;
    margin-top: 6px;
    color: #6b7280;
    font-size: 13px;
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

.error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.bottom {
    text-align: center;
    margin-top: 20px;
}

.bottom a {
    color: #0a5fc4;
    font-weight: 700;
}

@media (max-width: 900px) {
    .content {
        grid-template-columns: 1fr;
    }
}
</style>
