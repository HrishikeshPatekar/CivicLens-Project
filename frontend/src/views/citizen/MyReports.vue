<template>
    <div class="page-layout">
        <CitizenSidebar />

        <main class="main-content">
            <h1>My Reports</h1>

            <div class="filters card">
                <input
                    v-model="search"
                    placeholder="Search complaints..."
                />

                <select v-model="status">
                    <option value="">All Status</option>
                    <option>Reported</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Rejected</option>
                </select>
            </div>

            <div class="reports">
                <div
                    v-for="complaint in filteredComplaints"
                    :key="complaint._id"
                    class="card report"
                >
                    <div>
                        <small>
                            {{ complaint.complaintId }}
                        </small>

                        <h2>
                            {{ complaint.title }}
                        </h2>

                        <p>
                            {{ complaint.category }}
                        </p>

                        <p>
                            {{ complaint.location?.address }}
                        </p>
                    </div>

                    <div class="right">
                        
                        <span>
                            {{ complaint.status }}
                        </span>

                        <RouterLink
                            :to="`/track/${complaint.complaintId}`"
                            class="btn-primary"
                        >
                            Track
                        </RouterLink>
                    </div>
                </div>

                <div
                    v-if="filteredComplaints.length === 0"
                    class="card"
                >
                    No complaints found.
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

import CitizenSidebar from "../../components/CitizenSidebar.vue";
import api from "../../services/api";

const complaints = ref([]);
const search = ref("");
const status = ref("");

const filteredComplaints = computed(() => {
    return complaints.value.filter((c) => {
        const text =
            `${c.title} ${c.complaintId}`.toLowerCase();

        const matchesSearch =
            text.includes(search.value.toLowerCase());

        const matchesStatus =
            !status.value ||
            c.status === status.value;

        return matchesSearch && matchesStatus;
    });
});

onMounted(async () => {
    const response = await api.get(
        "/complaints/my"
    );

    complaints.value = response.data;
});
</script>

<style scoped>
.filters {
    display: flex;
    gap: 15px;
    margin: 25px 0;
}

.filters input,
.filters select {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.filters input {
    flex: 1;
}

.reports {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.report {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.report small {
    color: #6b7280;
}

.report h2 {
    margin: 7px 0;
}

.report p {
    color: #6b7280;
    margin: 5px 0;
}

.right {
    display: flex;
    align-items: center;
    gap: 15px;
}

@media (max-width: 700px) {
    .filters,
    .report,
    .right {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>