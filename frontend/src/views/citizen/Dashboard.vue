<template>
    <div class="page-layout">
        <CitizenSidebar />

        <main class="main-content">
            <div class="welcome">
                <div>
                    <h1>
                        Hello, {{ user?.name || "Citizen" }} 👋
                    </h1>

                    <p>
                        Track and manage your civic complaints
                        in one place.
                    </p>
                </div>

                <RouterLink
                    to="/report"
                    class="btn-primary"
                >
                    + Report New Issue
                </RouterLink>
            </div>

            <div class="stats">
                <div class="card stat">
                    <span>Total Complaints</span>
                    <strong>{{ complaints.length }}</strong>
                </div>

                <div class="card stat">
                    <span>Pending</span>
                    <strong>{{ pending }}</strong>
                </div>

                <div class="card stat">
                    <span>In Progress</span>
                    <strong>{{ inProgress }}</strong>
                </div>

                <div class="card stat">
                    <span>Resolved</span>
                    <strong>{{ resolved }}</strong>
                </div>
            </div>

            <div class="card">
                <div class="section-title">
                    <h2>Recent Complaints</h2>

                    <RouterLink to="/reports">
                        View All
                    </RouterLink>
                </div>

                <div
                    v-if="complaints.length === 0"
                    class="empty"
                >
                    No complaints yet.
                </div>

                <div v-else class="complaints">
                    <div
                        v-for="complaint in complaints.slice(0, 5)"
                        :key="complaint._id"
                        class="complaint"
                    >
                        <div>
                            <strong>
                                {{ complaint.title }}
                            </strong>

                            <small>
                                {{ complaint.complaintId }}
                            </small>
                        </div>

                        <span :class="statusClass(complaint.status)">
                            {{ complaint.status }}
                        </span>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import CitizenSidebar from "../../components/CitizenSidebar.vue";
import api from "../../services/api";

const complaints = ref([]);

const user = JSON.parse(
    localStorage.getItem("user") || "null"
);

const pending = computed(() =>
    complaints.value.filter(
        c => c.status === "Reported"
    ).length
);

const inProgress = computed(() =>
    complaints.value.filter(
        c => c.status === "In Progress"
    ).length
);

const resolved = computed(() =>
    complaints.value.filter(
        c => c.status === "Resolved"
    ).length
);

const statusClass = (status) => {
    return status
        .toLowerCase()
        .replaceAll(" ", "-");
};

onMounted(async () => {
    try {
        const response = await api.get(
            "/complaints/my"
        );

        complaints.value = response.data;
    } catch (error) {
        console.error(error);
    }
});
</script>

<style scoped>
.welcome {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;
}

.welcome p {
    color: #6b7280;
    margin-top: 7px;
}

.stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
    margin-bottom: 25px;
}

.stat {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.stat span {
    color: #6b7280;
}

.stat strong {
    font-size: 32px;
}

.section-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.section-title a {
    color: #0a5fc4;
}

.complaints {
    display: flex;
    flex-direction: column;
}

.complaint {
    display: flex;
    justify-content: space-between;
    padding: 17px 0;
    border-bottom: 1px solid #eee;
}

.complaint div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.complaint small {
    color: #9ca3af;
}

.reported,
.in-progress,
.resolved,
.rejected {
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 12px;
}

.empty {
    color: #6b7280;
}

@media (max-width: 900px) {
    .stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .welcome {
        flex-direction: column;
        align-items: flex-start;
    }

    .stats {
        grid-template-columns: 1fr;
    }
}
</style>