<template>

    <div class="page-layout">

        <AdminSidebar />


        <main class="main-content">

            <!-- HEADER -->

            <div class="header">

                <div>

                    <h1>
                        Analytics
                    </h1>

                    <p>
                        Understand complaint trends and resolution performance.
                    </p>

                </div>


                <button
                    class="refresh-btn"
                    @click="loadAnalytics"
                    :disabled="loading"
                >

                    {{ loading ? "Loading..." : "↻ Refresh" }}

                </button>

            </div>


            <!-- ERROR -->

            <div
                v-if="error"
                class="error"
            >
                {{ error }}
            </div>


            <!-- LOADING -->

            <div
                v-if="loading"
                class="loading"
            >
                Loading analytics...
            </div>


            <template v-else>

                <!-- =========================
                     SUMMARY CARDS
                ========================== -->

                <section class="summary-grid">


                    <div class="summary-card">

                        <div class="icon blue">
                            📋
                        </div>

                        <div>

                            <span>
                                Total Complaints
                            </span>

                            <strong>
                                {{ total }}
                            </strong>

                        </div>

                    </div>


                    <div class="summary-card">

                        <div class="icon orange">
                            📝
                        </div>

                        <div>

                            <span>
                                Reported
                            </span>

                            <strong>
                                {{ statusCounts.reported }}
                            </strong>

                        </div>

                    </div>


                    <div class="summary-card">

                        <div class="icon yellow">
                            🔄
                        </div>

                        <div>

                            <span>
                                In Progress
                            </span>

                            <strong>
                                {{ statusCounts.inProgress }}
                            </strong>

                        </div>

                    </div>


                    <div class="summary-card">

                        <div class="icon green">
                            ✅
                        </div>

                        <div>

                            <span>
                                Resolved
                            </span>

                            <strong>
                                {{ statusCounts.resolved }}
                            </strong>

                        </div>

                    </div>


                    <div class="summary-card">

                        <div class="icon red">
                            ❌
                        </div>

                        <div>

                            <span>
                                Rejected
                            </span>

                            <strong>
                                {{ statusCounts.rejected }}
                            </strong>

                        </div>

                    </div>


                    <div class="summary-card">

                        <div class="icon purple">
                            📈
                        </div>

                        <div>

                            <span>
                                Resolution Rate
                            </span>

                            <strong>
                                {{ resolutionRate }}%
                            </strong>

                        </div>

                    </div>

                </section>


                <!-- =========================
                     MAIN ANALYTICS GRID
                ========================== -->

                <section class="analytics-grid">


                    <!-- STATUS -->

                    <div class="analytics-card">

                        <div class="card-heading">

                            <div>

                                <h2>
                                    Complaint Status
                                </h2>

                                <p>
                                    Current status of all complaints
                                </p>

                            </div>

                        </div>


                        <div class="status-list">


                            <div
                                v-for="item in statusData"
                                :key="item.label"
                                class="status-row"
                            >

                                <div class="status-label">

                                    <span
                                        class="status-dot"
                                        :class="item.class"
                                    ></span>

                                    <span>
                                        {{ item.label }}
                                    </span>

                                </div>


                                <strong>
                                    {{ item.value }}
                                </strong>

                            </div>

                        </div>

                    </div>


                    <!-- PRIORITY -->

                    <div class="analytics-card">

                        <div class="card-heading">

                            <div>

                                <h2>
                                    Priority Distribution
                                </h2>

                                <p>
                                    Complaints according to priority
                                </p>

                            </div>

                        </div>


                        <div class="priority-list">


                            <div
                                v-for="item in priorityData"
                                :key="item.label"
                                class="priority-item"
                            >

                                <div class="priority-top">

                                    <span>
                                        {{ item.label }}
                                    </span>

                                    <strong>
                                        {{ item.value }}
                                    </strong>

                                </div>


                                <div class="progress-track">

                                    <div
                                        class="progress-bar"
                                        :class="item.class"
                                        :style="{
                                            width: percentage(item.value) + '%'
                                        }"
                                    ></div>

                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- CATEGORIES -->

                    <div class="analytics-card category-card">

                        <div class="card-heading">

                            <div>

                                <h2>
                                    Complaints by Category
                                </h2>

                                <p>
                                    Most common civic issue categories
                                </p>

                            </div>

                        </div>


                        <div
                            v-if="categoryData.length === 0"
                            class="empty"
                        >
                            No category data available.
                        </div>


                        <div
                            v-else
                            class="category-list"
                        >

                            <div
                                v-for="item in categoryData"
                                :key="item.label"
                                class="category-row"
                            >

                                <div class="category-name">

                                    <span>
                                        {{ item.label }}
                                    </span>

                                    <strong>
                                        {{ item.value }}
                                    </strong>

                                </div>


                                <div class="category-track">

                                    <div
                                        class="category-bar"
                                        :style="{
                                            width: percentage(item.value) + '%'
                                        }"
                                    ></div>

                                </div>

                            </div>

                        </div>

                    </div>


                    <!-- MONTHLY TREND -->

                    <div class="analytics-card trend-card">

                        <div class="card-heading">

                            <div>

                                <h2>
                                    Complaint Trend
                                </h2>

                                <p>
                                    Complaints submitted during the last 6 months
                                </p>

                            </div>

                        </div>


                        <div class="chart">

                            <div
                                v-for="item in monthlyData"
                                :key="item.label"
                                class="bar-column"
                            >

                                <div class="bar-value">
                                    {{ item.value }}
                                </div>


                                <div class="bar-area">

                                    <div
                                        class="trend-bar"
                                        :style="{
                                            height: barHeight(item.value) + '%'
                                        }"
                                    ></div>

                                </div>


                                <span class="month-label">
                                    {{ item.label }}
                                </span>

                            </div>

                        </div>

                    </div>

                </section>


                <!-- =========================
                     INSIGHT BOX
                ========================== -->

                <section class="insight-card">

                    <div class="insight-icon">
                        💡
                    </div>


                    <div>

                        <h2>
                            Administrative Insight
                        </h2>

                        <p>
                            {{ insight }}
                        </p>

                    </div>

                </section>

            </template>

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
    ref(false);

const error =
    ref("");


/* =========================================
   LOAD COMPLAINTS
========================================= */

const loadAnalytics =
    async () => {

        loading.value = true;

        error.value = "";

        try {

            const response =
                await api.get(
                    "/admin/complaints"
                );

            complaints.value =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];

        } catch (err) {

            console.error(
                "Analytics error:",
                err
            );

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to load analytics.";

        } finally {

            loading.value = false;

        }

    };


/* =========================================
   TOTAL
========================================= */

const total =
    computed(
        () =>
            complaints.value.length
    );


/* =========================================
   STATUS COUNTS
========================================= */

const statusCounts =
    computed(() => {

        return {

            reported:
                complaints.value.filter(
                    c =>
                        c.status ===
                        "Reported"
                ).length,

            inProgress:
                complaints.value.filter(
                    c =>
                        c.status ===
                        "In Progress"
                ).length,

            resolved:
                complaints.value.filter(
                    c =>
                        c.status ===
                        "Resolved"
                ).length,

            rejected:
                complaints.value.filter(
                    c =>
                        c.status ===
                        "Rejected"
                ).length,

        };

    });


/* =========================================
   PRIORITY COUNTS
========================================= */

const priorityCounts =
    computed(() => {

        return {

            low:
                complaints.value.filter(
                    c =>
                        c.priority ===
                        "Low"
                ).length,

            medium:
                complaints.value.filter(
                    c =>
                        c.priority ===
                        "Medium"
                ).length,

            high:
                complaints.value.filter(
                    c =>
                        c.priority ===
                        "High"
                ).length,

        };

    });


/* =========================================
   STATUS DATA
========================================= */

const statusData =
    computed(() => [

        {
            label: "Reported",
            value:
                statusCounts.value.reported,
            class: "reported",
        },

        {
            label: "In Progress",
            value:
                statusCounts.value.inProgress,
            class: "progress",
        },

        {
            label: "Resolved",
            value:
                statusCounts.value.resolved,
            class: "resolved",
        },

        {
            label: "Rejected",
            value:
                statusCounts.value.rejected,
            class: "rejected",
        },

    ]);


/* =========================================
   PRIORITY DATA
========================================= */

const priorityData =
    computed(() => [

        {
            label: "High Priority",
            value:
                priorityCounts.value.high,
            class: "high",
        },

        {
            label: "Medium Priority",
            value:
                priorityCounts.value.medium,
            class: "medium",
        },

        {
            label: "Low Priority",
            value:
                priorityCounts.value.low,
            class: "low",
        },

    ]);


/* =========================================
   CATEGORY DATA
========================================= */

const categoryData =
    computed(() => {

        const counts = {};

        complaints.value.forEach(
            complaint => {

                const category =
                    complaint.category ||
                    "Other";

                counts[category] =
                    (
                        counts[category] ||
                        0
                    ) + 1;

            }
        );


        return Object.entries(
            counts
        )
            .map(
                ([label, value]) => ({
                    label,
                    value,
                })
            )
            .sort(
                (a, b) =>
                    b.value -
                    a.value
            );

    });


/* =========================================
   MONTHLY DATA
========================================= */

const monthlyData =
    computed(() => {

        const months = [];

        const now =
            new Date();


        for (
            let i = 5;
            i >= 0;
            i--
        ) {

            const date =
                new Date(
                    now.getFullYear(),
                    now.getMonth() - i,
                    1
                );


            const year =
                date.getFullYear();

            const month =
                date.getMonth();


            const label =
                date.toLocaleString(
                    "en-US",
                    {
                        month: "short",
                    }
                );


            const value =
                complaints.value.filter(
                    complaint => {

                        if (
                            !complaint.createdAt
                        ) {
                            return false;
                        }


                        const created =
                            new Date(
                                complaint.createdAt
                            );


                        return (
                            created.getFullYear() ===
                                year &&
                            created.getMonth() ===
                                month
                        );

                    }
                ).length;


            months.push({

                label,

                value,

            });

        }


        return months;

    });


/* =========================================
   RESOLUTION RATE
========================================= */

const resolutionRate =
    computed(() => {

        if (
            total.value === 0
        ) {
            return 0;
        }


        return Math.round(
            (
                statusCounts.value.resolved /
                total.value
            ) * 100
        );

    });


/* =========================================
   PERCENTAGE
========================================= */

const percentage =
    (value) => {

        if (
            total.value === 0
        ) {
            return 0;
        }


        return Math.round(
            (
                value /
                total.value
            ) * 100
        );

    };


/* =========================================
   BAR HEIGHT
========================================= */

const barHeight =
    (value) => {

        const values =
            monthlyData.value.map(
                item =>
                    item.value
            );


        const max =
            Math.max(
                ...values,
                1
            );


        return (
            value /
            max
        ) * 100;

    };


/* =========================================
   ADMINISTRATIVE INSIGHT
========================================= */

const insight =
    computed(() => {

        if (
            total.value === 0
        ) {

            return "There are currently no complaints available for analysis.";

        }


        const categories =
            categoryData.value;


        const highestCategory =
            categories.length > 0
                ? categories[0]
                : null;


        if (
            resolutionRate.value >=
            75
        ) {

            return `Excellent performance. ${resolutionRate.value}% of complaints have been resolved.`;

        }


        if (
            highestCategory
        ) {

            return `${highestCategory.label} is currently the most reported category with ${highestCategory.value} complaint(s). Focus resources on this category to improve civic service delivery.`;

        }


        return "Continue monitoring complaint status, priority and category trends to improve response time.";

    });


/* =========================================
   INITIAL LOAD
========================================= */

onMounted(
    loadAnalytics
);

</script>


<style scoped>

.header {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 30px;

}


.header h1 {

    margin: 0 0 7px;

    font-size: 32px;

}


.header p {

    margin: 0;

    color: #6b7280;

}


.refresh-btn {

    border: none;

    background: #0a5fc4;

    color: white;

    padding: 11px 18px;

    border-radius: 9px;

    font-weight: 600;

}


.refresh-btn:hover {

    background: #1d4ed8;

}


.refresh-btn:disabled {

    opacity: .6;

    cursor: not-allowed;

}


/* SUMMARY */

.summary-grid {

    display: grid;

    grid-template-columns:
        repeat(3, 1fr);

    gap: 18px;

    margin-bottom: 24px;

}


.summary-card {

    background: white;

    border-radius: 15px;

    padding: 20px;

    display: flex;

    align-items: center;

    gap: 15px;

    box-shadow:
        0 5px 20px
        rgba(0, 0, 0, .06);

}


.summary-card span {

    display: block;

    color: #6b7280;

    font-size: 14px;

    margin-bottom: 6px;

}


.summary-card strong {

    font-size: 28px;

    color: #111827;

}


.icon {

    width: 48px;

    height: 48px;

    border-radius: 12px;

    display: grid;

    place-items: center;

    font-size: 21px;

}


.icon.blue {

    background: #dbeafe;

}


.icon.orange {

    background: #ffedd5;

}


.icon.yellow {

    background: #fef3c7;

}


.icon.green {

    background: #dcfce7;

}


.icon.red {

    background: #fee2e2;

}


.icon.purple {

    background: #ede9fe;

}


/* MAIN GRID */

.analytics-grid {

    display: grid;

    grid-template-columns:
        1fr 1fr;

    gap: 22px;

}


.analytics-card {

    background: white;

    border-radius: 16px;

    padding: 25px;

    box-shadow:
        0 5px 20px
        rgba(0, 0, 0, .06);

}


.card-heading {

    margin-bottom: 25px;

}


.card-heading h2 {

    margin: 0 0 5px;

    font-size: 20px;

}


.card-heading p {

    margin: 0;

    color: #6b7280;

    font-size: 14px;

}


/* STATUS */

.status-list {

    display: flex;

    flex-direction: column;

    gap: 18px;

}


.status-row {

    display: flex;

    justify-content: space-between;

    align-items: center;

}


.status-label {

    display: flex;

    align-items: center;

    gap: 10px;

}


.status-dot {

    width: 10px;

    height: 10px;

    border-radius: 50%;

}


.status-dot.reported {

    background: #f59e0b;

}


.status-dot.progress {

    background: #0a5fc4;

}


.status-dot.resolved {

    background: #16a34a;

}


.status-dot.rejected {

    background: #dc2626;

}


/* PRIORITY */

.priority-list {

    display: flex;

    flex-direction: column;

    gap: 22px;

}


.priority-top {

    display: flex;

    justify-content: space-between;

    margin-bottom: 8px;

}


.progress-track,
.category-track {

    width: 100%;

    height: 9px;

    background: #e5e7eb;

    border-radius: 20px;

    overflow: hidden;

}


.progress-bar,
.category-bar {

    height: 100%;

    border-radius: 20px;

    min-width: 0;

}


.progress-bar.high {

    background: #dc2626;

}


.progress-bar.medium {

    background: #f59e0b;

}


.progress-bar.low {

    background: #16a34a;

}


/* CATEGORY */

.category-list {

    display: flex;

    flex-direction: column;

    gap: 18px;

}


.category-name {

    display: flex;

    justify-content: space-between;

    margin-bottom: 7px;

}


.category-bar {

    background:
        linear-gradient(
            90deg,
            #0a5fc4,
            #00c9b1
        );

}


/* TREND */

.chart {

    height: 280px;

    display: flex;

    align-items: flex-end;

    justify-content: space-around;

    gap: 15px;

    border-bottom: 1px solid #e5e7eb;

}


.bar-column {

    flex: 1;

    height: 100%;

    display: flex;

    flex-direction: column;

    align-items: center;

    justify-content: flex-end;

}


.bar-value {

    font-size: 13px;

    font-weight: 700;

    margin-bottom: 5px;

}


.bar-area {

    height: 210px;

    width: 100%;

    display: flex;

    align-items: flex-end;

    justify-content: center;

}


.trend-bar {

    width: 55%;

    max-width: 45px;

    min-height: 3px;

    background:
        linear-gradient(
            180deg,
            #0a5fc4,
            #00c9b1
        );

    border-radius:
        7px 7px 0 0;

    transition:
        height .3s ease;

}


.month-label {

    font-size: 12px;

    color: #6b7280;

    margin-top: 10px;

    margin-bottom: 10px;

}


/* INSIGHT */

.insight-card {

    margin-top: 24px;

    background: linear-gradient(
        135deg,
        #eff6ff,
        #ecfeff
    );

    border-radius: 16px;

    padding: 22px;

    display: flex;

    align-items: flex-start;

    gap: 15px;

}


.insight-icon {

    width: 45px;

    height: 45px;

    background: white;

    border-radius: 12px;

    display: grid;

    place-items: center;

    font-size: 20px;

}


.insight-card h2 {

    margin: 0 0 7px;

    font-size: 18px;

}


.insight-card p {

    margin: 0;

    color: #4b5563;

    line-height: 1.6;

}


/* OTHER */

.error {

    padding: 14px;

    margin-bottom: 20px;

    background: #fee2e2;

    color: #991b1b;

    border-radius: 9px;

}


.loading {

    background: white;

    padding: 40px;

    text-align: center;

    border-radius: 15px;

    color: #6b7280;

}


.empty {

    color: #6b7280;

    padding: 30px 0;

    text-align: center;

}


/* RESPONSIVE */

@media (max-width: 1000px) {

    .summary-grid {

        grid-template-columns:
            repeat(2, 1fr);

    }

    .analytics-grid {

        grid-template-columns: 1fr;

    }

}


@media (max-width: 650px) {

    .summary-grid {

        grid-template-columns: 1fr;

    }

    .header {

        flex-direction: column;

        align-items: flex-start;

        gap: 15px;

    }

}

</style>