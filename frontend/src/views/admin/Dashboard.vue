<template>
    <div class="page-layout">

        <AdminSidebar />

        <main class="main-content">

            <div class="header">
                <div>
                    <h1>
                        Administration Dashboard
                    </h1>

                    <p>
                        Monitor and manage citizen complaints.
                    </p>
                </div>
            </div>


            <div
                v-if="error"
                class="error"
            >
                {{ error }}
            </div>


            <div class="stats">

                <div class="stat-card">
                    <span>Total Complaints</span>
                    <strong>
                        {{ stats.total }}
                    </strong>
                </div>


                <div class="stat-card reported">
                    <span>Reported</span>
                    <strong>
                        {{ stats.reported }}
                    </strong>
                </div>


                <div class="stat-card progress">
                    <span>In Progress</span>
                    <strong>
                        {{ stats.inProgress }}
                    </strong>
                </div>


                <div class="stat-card resolved">
                    <span>Resolved</span>
                    <strong>
                        {{ stats.resolved }}
                    </strong>
                </div>


                <div class="stat-card high">
                    <span>High Priority</span>
                    <strong>
                        {{ stats.high }}
                    </strong>
                </div>


                <div class="stat-card medium">
                    <span>Medium Priority</span>
                    <strong>
                        {{ stats.medium }}
                    </strong>
                </div>

            </div>


            <div class="quick-section">

                <div class="section-card">

                    <h2>
                        Complaint Overview
                    </h2>

                    <div class="overview">

                        <div>
                            <span>Low</span>
                            <strong>
                                {{ stats.low }}
                            </strong>
                        </div>

                        <div>
                            <span>Medium</span>
                            <strong>
                                {{ stats.medium }}
                            </strong>
                        </div>

                        <div>
                            <span>High</span>
                            <strong>
                                {{ stats.high }}
                            </strong>
                        </div>

                    </div>

                </div>


                <div class="section-card">

                    <h2>
                        Quick Actions
                    </h2>

                    <div class="actions">

                        <RouterLink
                            to="/admin/complaints"
                            class="action"
                        >
                            View All Complaints
                        </RouterLink>

                        <RouterLink
                            to="/admin/maps"
                            class="action"
                        >
                            Open Complaint Map
                        </RouterLink>

                    </div>

                </div>

            </div>

        </main>

    </div>
</template>


<script setup>

import {
    onMounted,
    reactive,
    ref,
} from "vue";

import AdminSidebar from
    "../../components/AdminSidebar.vue";

import api from
    "../../services/api";


const error =
    ref("");


const stats =
    reactive({

        total: 0,

        reported: 0,

        inProgress: 0,

        resolved: 0,

        rejected: 0,

        low: 0,

        medium: 0,

        high: 0,

    });


const loadStats = async () => {

    try {

        const response =
            await api.get(
                "/admin/dashboard"
            );

        Object.assign(
            stats,
            response.data
        );

    } catch (err) {

        console.error(err);

        error.value =
            err.response?.data
                ?.message ||
            "Unable to load dashboard";

    }
};


onMounted(
    loadStats
);

</script>


<style scoped>

.header {
    margin-bottom: 30px;
}

.header p {
    color: #6b7280;
}

.stats {
    display: grid;
    grid-template-columns:
        repeat(3, 1fr);
    gap: 20px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    box-shadow:
        0 5px 20px
        rgba(0, 0, 0, .06);
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stat-card span {
    color: #6b7280;
}

.stat-card strong {
    font-size: 34px;
}

.reported {
    border-left: 5px solid #f59e0b;
}

.progress {
    border-left: 5px solid #0a5fc4;
}

.resolved {
    border-left: 5px solid #16a34a;
}

.high {
    border-left: 5px solid #dc2626;
}

.medium {
    border-left: 5px solid #f59e0b;
}

.quick-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 25px;
}

.section-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
}

.overview {
    display: flex;
    gap: 35px;
}

.overview div {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.overview span {
    color: #6b7280;
}

.overview strong {
    font-size: 26px;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action {
    padding: 13px;
    background: #eff6ff;
    color: #0a5fc4;
    border-radius: 9px;
}

.error {
    padding: 12px;
    background: #fee2e2;
    color: #b91c1c;
    border-radius: 8px;
    margin-bottom: 20px;
}

@media (max-width: 900px) {

    .stats,
    .quick-section {
        grid-template-columns: 1fr;
    }
}

</style>