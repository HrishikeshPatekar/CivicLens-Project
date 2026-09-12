<template>
    <div class="auth-page">
        <div class="auth-card">

            <h1>Forgot Password?</h1>

            <p>
                Reset your Civic Lens password.
            </p>

            <div v-if="error" class="error">
                {{ error }}
            </div>

            <div v-if="success" class="success">
                {{ success }}
            </div>

            <!-- ================================= -->
            <!-- STEP 1 - EMAIL / MOBILE -->
            <!-- ================================= -->

            <template v-if="step === 1">

                <div class="form-group">
                    <label>
                        Registered Email or Mobile
                    </label>

                    <input
                        v-model="identifier"
                        type="text"
                        placeholder="Enter email or mobile"
                        required
                    />
                </div>

                <button
                    class="btn-primary"
                    @click="sendOtp"
                    :disabled="loading"
                >
                    {{
                        loading
                            ? "Sending..."
                            : "Send OTP"
                    }}
                </button>

            </template>

            <!-- ================================= -->
            <!-- STEP 2 - OTP -->
            <!-- ================================= -->

            <template v-if="step === 2">

                <div class="form-group">
                    <label>OTP</label>

                    <input
                        v-model="otp"
                        type="text"
                        inputmode="numeric"
                        maxlength="6"
                        placeholder="Enter 6-digit OTP"
                        required
                    />

                    <small class="hint">
                        OTP is valid for 10 minutes.
                    </small>
                </div>

                <button
                    class="btn-primary"
                    @click="verifyOtp"
                    :disabled="loading"
                >
                    {{
                        loading
                            ? "Verifying..."
                            : "Verify OTP"
                    }}
                </button>

                <button
                    class="secondary-button"
                    @click="step = 1"
                    :disabled="loading"
                >
                    Change Email 
                </button>

            </template>

            <!-- ================================= -->
            <!-- STEP 3 - NEW PASSWORD -->
            <!-- ================================= -->

            <template v-if="step === 3">

                <div class="form-group">
                    <label>New Password</label>

                    <input
                        v-model="newPassword"
                        type="password"
                        minlength="8"
                        placeholder="Enter new password"
                        required
                    />

                    <small class="hint">
                        Password must be at least 8 characters.
                    </small>
                </div>

                <div class="form-group">
                    <label>Confirm Password</label>

                    <input
                        v-model="confirmPassword"
                        type="password"
                        minlength="8"
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                <button
                    class="btn-primary"
                    @click="resetPassword"
                    :disabled="loading"
                >
                    {{
                        loading
                            ? "Resetting..."
                            : "Reset Password"
                    }}
                </button>

            </template>

            <RouterLink
                to="/login"
                class="back"
            >
                Back to Login
            </RouterLink>

        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";

const router = useRouter();

const identifier = ref("");
const otp = ref("");

const newPassword = ref("");
const confirmPassword = ref("");

const resetToken = ref("");

const step = ref(1);

const error = ref("");
const success = ref("");
const loading = ref(false);

// ==============================================
// SEND OTP
// ==============================================

const sendOtp = async () => {
    error.value = "";
    success.value = "";

    if (!identifier.value.trim()) {
        error.value =
            "Please enter your email or mobile.";

        return;
    }

    loading.value = true;

    try {
        await api.post(
            "/auth/forgot-password/send-otp",
            {
                identifier:
                    identifier.value.trim(),
            }
        );

        success.value =
            "OTP sent successfully. Check your registered email.";

        step.value = 2;

    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Unable to send OTP. Please try again.";
    } finally {
        loading.value = false;
    }
};

// ==============================================
// VERIFY OTP
// ==============================================

const verifyOtp = async () => {
    error.value = "";
    success.value = "";

    if (!otp.value.trim()) {
        error.value = "Please enter the OTP.";

        return;
    }

    if (!/^\d{6}$/.test(otp.value.trim())) {
        error.value =
            "OTP must contain 6 digits.";

        return;
    }

    loading.value = true;

    try {
        const response = await api.post(
            "/auth/forgot-password/verify-otp",
            {
                identifier:
                    identifier.value.trim(),

                otp: otp.value.trim(),
            }
        );

        resetToken.value =
            response.data.resetToken;

        success.value =
            "OTP verified successfully.";

        step.value = 3;

    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Invalid OTP.";
    } finally {
        loading.value = false;
    }
};

// ==============================================
// RESET PASSWORD
// ==============================================

const resetPassword = async () => {
    error.value = "";
    success.value = "";

    // ==========================================
    // 8 CHARACTER VALIDATION
    // ==========================================

    if (newPassword.value.length < 8) {
        error.value =
            "Password must be at least 8 characters.";

        return;
    }

    if (confirmPassword.value.length < 8) {
        error.value =
            "Confirm password must be at least 8 characters.";

        return;
    }

    // ==========================================
    // PASSWORD MATCH
    // ==========================================

    if (
        newPassword.value !==
        confirmPassword.value
    ) {
        error.value =
            "Passwords do not match.";

        return;
    }

    loading.value = true;

    try {
        await api.post(
            "/auth/forgot-password/reset",
            {
                resetToken:
                    resetToken.value,

                newPassword:
                    newPassword.value,

                confirmPassword:
                    confirmPassword.value,
            }
        );

        success.value =
            "Password reset successfully. Redirecting to login...";

        setTimeout(() => {
            router.push("/login");
        }, 1500);

    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Unable to reset password.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.auth-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    background: linear-gradient(
        135deg,
        #eff6ff,
        #ecfeff
    );
    padding: 20px;
}

.auth-card {
    width: min(450px, 100%);
    background: white;
    padding: 35px;
    border-radius: 18px;
    box-shadow:
        0 15px 40px
        rgba(0, 0, 0, 0.1);
}

.auth-card h1 {
    margin-bottom: 5px;
}

.auth-card > p {
    color: #6b7280;
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 7px;
    font-weight: 600;
}

.form-group input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 13px;
    border: 1px solid #d1d5db;
    border-radius: 9px;
    font-size: 15px;
}

.form-group input:focus {
    outline: none;
    border-color: #0a5fc4;
}

.hint {
    display: block;
    margin-top: 6px;
    color: #6b7280;
    font-size: 13px;
}

.auth-card button {
    width: 100%;
}

.secondary-button {
    margin-top: 10px;
    padding: 12px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 8px;
    cursor: pointer;
}

.error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.success {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.back {
    display: block;
    margin-top: 20px;
    text-align: center;
    color: #0a5fc4;
}
</style>