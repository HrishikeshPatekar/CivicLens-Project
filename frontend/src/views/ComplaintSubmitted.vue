<template>
    <div class="page-layout">
        <CitizenSidebar />

        <main class="main-content">
            <div class="success-container">

                <div class="success-icon">
                    ✓
                </div>

                <h1>Complaint Submitted Successfully!</h1>

                <p class="success-text">
                    Thank you for reporting this issue.
                    Your complaint has been successfully submitted.
                </p>

                <div class="complaint-id-box">
                    <span>Complaint ID</span>

                    <strong>
                        {{ complaintId }}
                    </strong>
                </div>

                <p class="track-text">
                    Please save your complaint ID to track
                    the status of your complaint.
                </p>

                <div class="actions">
                    <button
                        class="btn-primary"
                        @click="goToDashboard"
                    >
                        Back to Dashboard
                    </button>

                    <button
                        class="btn-secondary"
                        @click="trackComplaint"
                    >
                        Track Complaint
                    </button>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import CitizenSidebar from "../components/CitizenSidebar.vue";

const route = useRoute();
const router = useRouter();

const complaintId = computed(() => {
    return route.params.id;
});

const goToDashboard = () => {
    router.push("/dashboard");
};

const trackComplaint = () => {
    router.push(`/track/${complaintId.value}`);
};
</script>

<style scoped>

.success-container {
    max-width: 650px;
    margin: 60px auto;
    padding: 45px;
    background: white;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.success-icon {
    width: 70px;
    height: 70px;
    margin: 0 auto 25px;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #dcfce7;
    color: #16a34a;

    border-radius: 50%;

    font-size: 38px;
    font-weight: bold;
}

h1 {
    margin-bottom: 15px;
    color: #166534;
}

.success-text {
    color: #6b7280;
    line-height: 1.6;
}

.complaint-id-box {
    margin: 30px auto 20px;
    padding: 20px;

    background: #f0fdf4;
    border: 1px solid #86efac;

    border-radius: 10px;

    display: flex;
    flex-direction: column;
    gap: 8px;
}

.complaint-id-box span {
    font-size: 13px;
    color: #6b7280;
}

.complaint-id-box strong {
    font-size: 24px;
    color: #166534;
    letter-spacing: 1px;
}

.track-text {
    color: #6b7280;
    font-size: 14px;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
}

.btn-primary,
.btn-secondary {
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.btn-primary {
    border: none;
    background: #0a5fc4;
    color: white;
}

.btn-secondary {
    border: 1px solid #0a5fc4;
    background: white;
    color: #0a5fc4;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-secondary:hover {
    background: #eff6ff;
}

@media (max-width: 600px) {
    .success-container {
        margin: 30px 15px;
        padding: 30px 20px;
    }

    .actions {
        flex-direction: column;
    }
}

</style>