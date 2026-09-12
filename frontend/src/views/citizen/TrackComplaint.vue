<template>
    <div class="page-layout">

        <CitizenSidebar />

        <main class="main-content">

            <!-- Loading -->
            <div
                v-if="loading"
                class="state-card"
            >
                <div class="loader"></div>

                <p>
                    Loading complaint...
                </p>
            </div>


            <!-- Error -->
            <div
                v-else-if="error"
                class="state-card error-card"
            >
                <h2>
                    Unable to load complaint
                </h2>

                <p>
                    {{ error }}
                </p>

                <button
                    @click="loadComplaint"
                >
                    Try Again
                </button>
            </div>


            <!-- Complaint -->
            <div
                v-else-if="complaint"
                class="track-container"
            >

                <div class="page-header">

                    <div>
                        <h1>
                            Track Complaint
                        </h1>

                        <p>
                            Track the current status
                            of your civic complaint.
                        </p>
                    </div>

                    <div
                        class="status-badge"
                        :class="statusClass"
                    >
                        {{ complaint.status }}
                    </div>

                </div>


                <!-- Complaint summary -->
                <div class="complaint-card">

                    <div class="complaint-header">

                        <div>

                            <span class="complaint-label">
                                Complaint ID
                            </span>

                            <h2>
                                {{ complaint.complaintId }}
                            </h2>

                        </div>

                        <div class="priority-box">

                            <span>
                                Priority
                            </span>

                            <strong
                                :class="
                                    priorityClass
                                "
                            >
                                {{ complaint.priority }}
                            </strong>

                        </div>

                    </div>


                    <div class="divider"></div>


                    <h2 class="title">
                        {{ complaint.title }}
                    </h2>


                    <div class="details-grid">

                        <div class="detail">

                            <span>
                                Category
                            </span>

                            <strong>
                                {{ complaint.category }}
                            </strong>

                        </div>


                        <div class="detail">

                            <span>
                                Department
                            </span>

                            <strong>
                                {{
                                    complaint.department ||
                                    "Not assigned"
                                }}
                            </strong>

                        </div>


                        <div class="detail full">

                            <span>
                                Location
                            </span>

                            <strong>
                                {{
                                    complaint.location
                                        ?.address ||
                                    "Location not available"
                                }}
                            </strong>

                        </div>


                        <div class="detail full">

                            <span>
                                Description
                            </span>

                            <strong>
                                {{
                                    complaint.description
                                }}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- Status timeline -->
                <div class="timeline-card">

                    <h2>
                        Complaint Progress
                    </h2>

                    <div
                        v-if="
                            complaint.statusHistory &&
                            complaint.statusHistory.length
                        "
                        class="timeline"
                    >

                        <div
                            v-for="
                                (item, index)
                                in complaint.statusHistory
                            "
                            :key="
                                item._id ||
                                index
                            "
                            class="timeline-item"
                        >

                            <div class="timeline-line">

                                <div
                                    class="timeline-dot"
                                ></div>

                            </div>


                            <div
                                class="timeline-content"
                            >

                                <div
                                    class="timeline-top"
                                >

                                    <strong>
                                        {{
                                            item.status
                                        }}
                                    </strong>

                                    <small>
                                        {{
                                            formatDate(
                                                item.changedAt
                                            )
                                        }}
                                    </small>

                                </div>


                                <p>
                                    {{
                                        item.comment ||
                                        "Status updated"
                                    }}
                                </p>

                            </div>

                        </div>

                    </div>


                    <div
                        v-else
                        class="empty-history"
                    >
                        No status history available.
                    </div>

                </div>


                <!-- Assigned information -->
                <div
                    v-if="
                        complaint.assignedOfficer ||
                        complaint.contractor?.name ||
                        complaint.contractor?.company
                    "
                    class="assignment-card"
                >

                    <h2>
                        Resolution Information
                    </h2>


                    <div
                        v-if="
                            complaint.assignedOfficer
                        "
                        class="assignment-section"
                    >

                        <span>
                            Assigned Officer
                        </span>

                        <strong>
                            {{
                                complaint
                                    .assignedOfficer
                                    ?.name ||
                                "Assigned"
                            }}
                        </strong>

                        <small>
                            {{
                                complaint
                                    .assignedOfficer
                                    ?.email ||
                                ""
                            }}
                        </small>

                    </div>


                    <div
                        v-if="
                            complaint.contractor?.name ||
                            complaint.contractor?.company
                        "
                        class="assignment-section"
                    >

                        <span>
                            Contractor
                        </span>

                        <strong>
                            {{
                                complaint
                                    .contractor
                                    ?.name ||
                                "Contractor"
                            }}
                        </strong>

                        <small>
                            {{
                                complaint
                                    .contractor
                                    ?.company ||
                                ""
                            }}
                        </small>

                    </div>

                </div>


                <!-- Back -->
                <div class="actions">

                    <button
                        class="back-button"
                        @click="
                            router.push('/reports')
                        "
                    >
                        ← Back to My Reports
                    </button>

                    <button
                        class="dashboard-button"
                        @click="
                            router.push('/dashboard')
                        "
                    >
                        Back to Dashboard
                    </button>

                </div>

            </div>

        </main>

    </div>
</template>


<script setup>

import {
    computed,
    onMounted,
    ref,
} from "vue";

import {
    useRoute,
    useRouter,
} from "vue-router";

import CitizenSidebar
    from "../../components/CitizenSidebar.vue";

import api
    from "../../services/api";


const route =
    useRoute();

const router =
    useRouter();


const complaint =
    ref(null);

const loading =
    ref(true);

const error =
    ref("");


const loadComplaint =
    async () => {

        loading.value =
            true;

        error.value =
            "";

        complaint.value =
            null;


        try {

            const response =
                await api.get(
                    `/complaints/${route.params.id}`
                );


            complaint.value =
                response.data;


        } catch (err) {

            console.error(
                "Track complaint error:",
                err
            );


            error.value =
                err.response
                    ?.data
                    ?.message ||
                "Complaint could not be loaded.";

        } finally {

            loading.value =
                false;

        }

    };


const formatDate =
    (date) => {

        if (!date) {
            return "Date unavailable";
        }

        return new Date(
            date
        ).toLocaleString(
            "en-IN",
            {
                dateStyle:
                    "medium",
                timeStyle:
                    "short",
            }
        );

    };


const statusClass =
    computed(() => {

        switch (
            complaint.value?.status
        ) {

            case "Resolved":
                return "resolved";

            case "In Progress":
                return "in-progress";

            case "Rejected":
                return "rejected";

            default:
                return "reported";

        }

    });


const priorityClass =
    computed(() => {

        switch (
            complaint.value?.priority
        ) {

            case "High":
                return "high";

            case "Medium":
                return "medium";

            default:
                return "low";

        }

    });


onMounted(
    loadComplaint
);

</script>


<style scoped>

.page-layout {
    display: flex;
    min-height: 100vh;
    background: #f5f7fb;
}

.main-content {
    flex: 1;
    padding: 35px;
    box-sizing: border-box;
}

.track-container {
    max-width: 1050px;
    margin: auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
}

.page-header h1 {
    margin: 0;
    font-size: 32px;
}

.page-header p {
    margin-top: 8px;
    color: #6b7280;
}

.status-badge {
    padding: 10px 18px;
    border-radius: 30px;
    font-weight: 700;
}

.status-badge.reported {
    background: #dbeafe;
    color: #1d4ed8;
}

.status-badge.in-progress {
    background: #fef3c7;
    color: #b45309;
}

.status-badge.resolved {
    background: #dcfce7;
    color: #15803d;
}

.status-badge.rejected {
    background: #fee2e2;
    color: #b91c1c;
}

.complaint-card,
.timeline-card,
.assignment-card,
.state-card {
    background: white;
    border-radius: 18px;
    padding: 28px;
    box-shadow:
        0 5px 20px
        rgba(0, 0, 0, 0.06);
    margin-bottom: 22px;
}

.complaint-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}

.complaint-label {
    color: #6b7280;
    font-size: 14px;
}

.complaint-header h2 {
    margin: 5px 0 0;
}

.priority-box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.priority-box span {
    color: #6b7280;
    font-size: 14px;
}

.priority-box strong.low {
    color: #16a34a;
}

.priority-box strong.medium {
    color: #d97706;
}

.priority-box strong.high {
    color: #dc2626;
}

.divider {
    height: 1px;
    background: #e5e7eb;
    margin: 22px 0;
}

.title {
    margin-bottom: 22px;
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.detail {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.detail.full {
    grid-column: 1 / -1;
}

.detail span {
    color: #6b7280;
    font-size: 14px;
}

.detail strong {
    color: #111827;
    font-weight: 500;
    line-height: 1.5;
}

.timeline-card h2,
.assignment-card h2 {
    margin-top: 0;
}

.timeline {
    margin-top: 25px;
}

.timeline-item {
    display: flex;
    min-height: 90px;
}

.timeline-line {
    width: 35px;
    position: relative;
    display: flex;
    justify-content: center;
}

.timeline-dot {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #0a5fc4;
    margin-top: 5px;
    z-index: 2;
}

.timeline-item:not(:last-child)
.timeline-line::after {
    content: "";
    position: absolute;
    width: 2px;
    background: #dbeafe;
    top: 20px;
    bottom: 0;
}

.timeline-content {
    flex: 1;
    padding-left: 10px;
    padding-bottom: 25px;
}

.timeline-top {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.timeline-top small {
    color: #6b7280;
}

.timeline-content p {
    color: #6b7280;
    margin: 8px 0 0;
}

.assignment-section {
    padding: 16px 0;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.assignment-section:last-child {
    border-bottom: none;
}

.assignment-section span {
    color: #6b7280;
    font-size: 14px;
}

.assignment-section small {
    color: #6b7280;
}

.actions {
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.actions button,
.state-card button {
    border: none;
    padding: 13px 22px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
}

.back-button {
    background: #e5e7eb;
    color: #111827;
}

.dashboard-button {
    background: #0a5fc4;
    color: white;
}

.state-card {
    max-width: 500px;
    margin: 80px auto;
    text-align: center;
}

.state-card p {
    color: #6b7280;
}

.error-card {
    border-left: 5px solid #dc2626;
}

.error-card button {
    background: #0a5fc4;
    color: white;
    margin-top: 15px;
}

.loader {
    width: 35px;
    height: 35px;
    border: 4px solid #e5e7eb;
    border-top-color: #0a5fc4;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: auto;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.empty-history {
    color: #6b7280;
    padding: 20px 0;
}

@media (max-width: 800px) {

    .main-content {
        padding: 20px;
    }

    .page-header,
    .complaint-header,
    .actions {
        flex-direction: column;
        align-items: flex-start;
    }

    .priority-box {
        align-items: flex-start;
    }

    .details-grid {
        grid-template-columns: 1fr;
    }

    .detail.full {
        grid-column: auto;
    }

}

</style>