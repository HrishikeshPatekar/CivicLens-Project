<template>
    <div class="page-layout">

        <AdminSidebar />

        <main class="main-content">

            <div class="heading">
                <div>
                    <h1>
                        All Complaints
                    </h1>

                    <p>
                        View, search and manage citizen complaints.
                    </p>
                </div>

                <strong>
                    {{ filtered.length }} complaints
                </strong>
            </div>


            <div class="filters card">

                <input
                    v-model="search"
                    placeholder="Search ID, title or citizen..."
                />


                <select v-model="status">

                    <option value="">
                        All Status
                    </option>

                    <option value="Reported">
                        Reported
                    </option>

                    <option value="In Progress">
                        In Progress
                    </option>

                    <option value="Resolved">
                        Resolved
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>

                </select>


                <select v-model="priority">

                    <option value="">
                        All Priority
                    </option>

                    <option value="High">
                        High
                    </option>

                    <option value="Medium">
                        Medium
                    </option>

                    <option value="Low">
                        Low
                    </option>

                </select>


                <input
                    v-model="from"
                    type="date"
                />


                <input
                    v-model="to"
                    type="date"
                />


                <select v-model="sort">

                    <option value="newest">
                        Newest First
                    </option>

                    <option value="oldest">
                        Oldest First
                    </option>

                </select>


                <button
                    class="clear"
                    @click="clearFilters"
                >
                    Clear Filters
                </button>

            </div>


            <div
                v-if="loading"
                class="loading"
            >
                Loading complaints...
            </div>


            <div
                v-else-if="error"
                class="error"
            >
                {{ error }}
            </div>


            <div
                v-else-if="filtered.length === 0"
                class="empty card"
            >
                No complaints found.
            </div>


            <div
                v-else
                class="complaints"
            >

                <div
                    v-for="complaint in filtered"
                    :key="complaint._id"
                    class="complaint-card card"
                >

                    <div class="top">

                        <div>

                            <span class="complaint-id">
                                {{ complaint.complaintId }}
                            </span>

                            <h2>
                                {{ complaint.title }}
                            </h2>

                            <p>
                                {{ complaint.category }}
                            </p>

                        </div>


                        <div class="badges">

                            <span
                                class="priority"
                                :class="
                                    complaint.priority
                                        .toLowerCase()
                                "
                            >
                                {{ complaint.priority }}
                            </span>


                            <span class="status">
                                {{ complaint.status }}
                            </span>

                        </div>

                    </div>


                    <div class="information">

                        <div>
                            <small>Citizen</small>

                            <strong>
                                {{
                                    complaint.citizen?.name ||
                                    "Unknown"
                                }}
                            </strong>
                        </div>


                        <div>
                            <small>Location</small>

                            <strong>
                                {{
                                    complaint.location?.address ||
                                    "Not available"
                                }}
                            </strong>
                        </div>


                        <div>
                            <small>Reports</small>

                            <strong>
                                {{ complaint.similarReports }}
                            </strong>
                        </div>


                        <div>
                            <small>Date</small>

                            <strong>
                                {{
                                    formatDate(
                                        complaint.createdAt
                                    )
                                }}
                            </strong>
                        </div>

                    </div>


                    <div class="bottom">

                        <span>
                            Department:
                            {{
                                complaint.department ||
                                "Not assigned"
                            }}
                        </span>


                        <RouterLink
                            :to="
                                `/admin/complaints/${complaint.complaintId}`
                            "
                            class="view-button"
                        >
                            View Details
                        </RouterLink>

                    </div>

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

import AdminSidebar from
    "../../components/AdminSidebar.vue";

import api from
    "../../services/api";


const complaints =
    ref([]);

const loading =
    ref(true);

const error =
    ref("");


const search =
    ref("");

const status =
    ref("");

const priority =
    ref("");

const from =
    ref("");

const to =
    ref("");

const sort =
    ref("newest");


const filtered =
    computed(() => {

        let result =
            complaints.value.filter(
                (complaint) => {

                    const text =
                        `
                        ${complaint.complaintId || ""}
                        ${complaint.title || ""}
                        ${complaint.citizen?.name || ""}
                        `
                        .toLowerCase();

                    const matchesSearch =
                        text.includes(
                            search.value
                                .toLowerCase()
                        );


                    const matchesStatus =
                        !status.value ||
                        complaint.status ===
                            status.value;


                    const matchesPriority =
                        !priority.value ||
                        complaint.priority ===
                            priority.value;


                    const date =
                        new Date(
                            complaint.createdAt
                        );


                    const matchesFrom =
                        !from.value ||
                        date >=
                            new Date(
                                `${from.value}T00:00:00`
                            );


                    const matchesTo =
                        !to.value ||
                        date <=
                            new Date(
                                `${to.value}T23:59:59`
                            );


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesPriority &&
                        matchesFrom &&
                        matchesTo
                    );
                }
            );


        result.sort(
            (a, b) => {

                const dateA =
                    new Date(
                        a.createdAt
                    );

                const dateB =
                    new Date(
                        b.createdAt
                    );

                return sort.value === "oldest"
                    ? dateA - dateB
                    : dateB - dateA;
            }
        );


        return result;
    });


const loadComplaints =
    async () => {

        try {

            loading.value =
                true;

            const response =
                await api.get(
                    "/admin/complaints"
                );

            complaints.value =
                response.data;

        } catch (err) {

            console.error(err);

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to load complaints";

        } finally {

            loading.value =
                false;
        }
    };


const clearFilters =
    () => {

        search.value = "";
        status.value = "";
        priority.value = "";
        from.value = "";
        to.value = "";
        sort.value = "newest";
    };


const formatDate =
    (date) => {

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


onMounted(
    loadComplaints
);

</script>


<style scoped>

.heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.heading p {
    color: #6b7280;
}

.filters {
    display: grid;
    grid-template-columns:
        2fr 1fr 1fr 1fr 1fr 1fr auto;
    gap: 10px;
    margin-bottom: 25px;
}

.filters input,
.filters select {
    padding: 11px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
}

.clear {
    border: none;
    background: #111827;
    color: white;
    border-radius: 8px;
    padding: 0 15px;
    cursor: pointer;
}

.complaints {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.complaint-card {
    padding: 22px;
}

.top {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.complaint-id {
    font-size: 13px;
    color: #0a5fc4;
    font-weight: 700;
}

.top h2 {
    margin: 6px 0;
}

.top p {
    color: #6b7280;
}

.badges {
    display: flex;
    gap: 8px;
    align-items: flex-start;
}

.priority,
.status {
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
}

.priority.low {
    background: #dcfce7;
    color: #166534;
}

.priority.medium {
    background: #fef3c7;
    color: #92400e;
}

.priority.high {
    background: #fee2e2;
    color: #991b1b;
}

.status {
    background: #eff6ff;
    color: #1d4ed8;
}

.information {
    display: grid;
    grid-template-columns:
        repeat(4, 1fr);
    gap: 20px;
    padding: 18px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-top: 15px;
}

.information div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.information small {
    color: #6b7280;
}

.information strong {
    font-size: 14px;
}

.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 18px;
    color: #6b7280;
}

.view-button {
    background: #0a5fc4;
    color: white;
    padding: 9px 14px;
    border-radius: 8px;
}

.error {
    padding: 15px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 8px;
}

.loading,
.empty {
    padding: 40px;
    text-align: center;
}

@media (max-width: 1100px) {

    .filters {
        grid-template-columns:
            repeat(2, 1fr);
    }

    .information {
        grid-template-columns:
            repeat(2, 1fr);
    }
}

@media (max-width: 700px) {

    .top,
    .bottom {
        flex-direction: column;
    }

    .filters,
    .information {
        grid-template-columns: 1fr;
    }

}

</style>