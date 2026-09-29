<template>
    <div class="page-layout">

        <AdminSidebar />

        <main class="main-content">

            <div
                v-if="loading"
                class="card"
            >
                Loading complaint...
            </div>


            <div
                v-else-if="error"
                class="error"
            >
                {{ error }}
            </div>


            <div
                v-else-if="complaint"
                class="details-page"
            >

                <div class="card">

                    <div class="heading">

                        <div>
                            <span class="id">
                                {{ complaint.complaintId }}
                            </span>

                            <h1>
                                {{ complaint.title }}
                            </h1>

                            <p>
                                {{ complaint.category }}
                            </p>
                        </div>


                        <div class="badges">

                            <span
                                class="priority"
                                :class="
                                    complaint.priority.toLowerCase()
                                "
                            >
                                {{ complaint.priority }}
                            </span>

                            <span class="status">
                                {{ complaint.status }}
                            </span>

                        </div>

                    </div>


                    <div class="grid">

                        <div>
                            <label>
                                Citizen
                            </label>

                            <strong>
                                {{
                                    complaint.citizen?.name ||
                                    "Unknown"
                                }}
                            </strong>
                        </div>


                        <div>
                            <label>
                                Email
                            </label>

                            <strong>
                                {{
                                    complaint.citizen?.email ||
                                    "-"
                                }}
                            </strong>
                        </div>


                        <div>
                            <label>
                                Mobile
                            </label>

                            <strong>
                                {{
                                    complaint.citizen?.mobile ||
                                    "-"
                                }}
                            </strong>
                        </div>


                        <div>
                            <label>
                                Similar Reports
                            </label>

                            <strong>
                                {{ complaint.similarReports }}
                            </strong>
                        </div>

                    </div>


                    <div class="description">

                        <h2>
                            Description
                        </h2>

                        <p>
                            {{ complaint.description }}
                        </p>

                    </div>


                    <div class="location">

                        <h2>
                            Location
                        </h2>

                        <p>
                            {{
                                complaint.location?.address
                            }}
                        </p>

                        <small>
                            Latitude:
                            {{
                                complaint.location?.latitude
                            }}
                            |
                            Longitude:
                            {{
                                complaint.location?.longitude
                            }}
                        </small>

                    </div>
                        <div
                        v-if="complaint?.media?.length"
                        class="media-section">
                        <h2>Uploaded Evidence</h2>

                        <p class="media-description">
                            Photos and videos submitted by the citizen.
                        </p>

                        <div class="media-grid">

                            <div
                                v-for="(media, index) in complaint.media"
                                :key="index"
                                class="media-card"
                            >

                                <!-- IMAGE -->
                                <img
                                    v-if="media.type === 'image'"
                                    :src="`http://localhost:5000${media.url}`"
                                    :alt="media.originalName"
                                />

                                <!-- VIDEO -->
                                <video
                                    v-else-if="media.type === 'video'"
                                    :src="`http://localhost:5000${media.url}`"
                                    controls
                                ></video>

                                <div class="media-name">
                                    {{ media.originalName }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="no-media"
                    >
                        No photos or videos were uploaded with this complaint.
                    </div>
                </div>


                <div class="card">

                    <h2>
                        Manage Complaint
                    </h2>


                    <div class="form-grid">

                        <div class="form-group">

                            <label>
                                Department
                            </label>

                            <select
                                v-model="form.department"
                            >

                                <option value="">
                                    Select Department
                                </option>

                                <option>
                                    Road & Transport
                                </option>

                                <option>
                                    Water Supply
                                </option>

                                <option>
                                    Electricity
                                </option>

                                <option>
                                    Sanitation
                                </option>

                                <option>
                                    Drainage
                                </option>

                                <option>
                                    Public Works
                                </option>

                            </select>

                        </div>


                        <div class="form-group">

                            <label>
                                Status
                            </label>

                            <select
                                v-model="form.status"
                            >

                                <option>
                                    Reported
                                </option>

                                <option>
                                    In Progress
                                </option>

                                <option>
                                    Resolved
                                </option>

                                <option>
                                    Rejected
                                </option>

                            </select>

                        </div>

                    </div>


                    <h2>
                        Contractor Information
                    </h2>


                    <div class="form-grid">

                        <div class="form-group">

                            <label>
                                Contractor Name
                            </label>

                            <input
                                v-model="
                                    form.contractor.name
                                "
                            />

                        </div>


                        <div class="form-group">

                            <label>
                                Company
                            </label>

                            <input
                                v-model="
                                    form.contractor.company
                                "
                            />

                        </div>


                        <div class="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                v-model="
                                    form.contractor.phone
                                "
                            />

                        </div>


                        <div class="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                v-model="
                                    form.contractor.email
                                "
                            />

                        </div>


                        <div class="form-group">

                            <label>
                                Contract Number
                            </label>

                            <input
                                v-model="
                                    form.contractor.contractNumber
                                "
                            />

                        </div>

                    </div>


                    <div
                        v-if="message"
                        class="success"
                    >
                        {{ message }}
                    </div>


                    <button
                        class="save"
                        @click="save"
                        :disabled="saving"
                    >
                        {{
                            saving
                                ? "Saving..."
                                : "Save Changes"
                        }}
                    </button>

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

import {
    useRoute,
} from "vue-router";

import AdminSidebar from
    "../../components/AdminSidebar.vue";

import api from
    "../../services/api";


const route =
    useRoute();


const complaint =
    ref(null);

const loading =
    ref(true);

const saving =
    ref(false);

const error =
    ref("");

const message =
    ref("");


const form =
    reactive({

        department: "",

        status: "Reported",

        contractor: {

            name: "",

            company: "",

            phone: "",

            email: "",

            contractNumber: "",

        },

    });


const loadComplaint =
    async () => {

        try {

            const response =
                await api.get(
                    `/admin/complaints/${route.params.id}`
                );

            complaint.value =
                response.data;


            form.department =
                complaint.value.department ||
                "";

            form.status =
                complaint.value.status ||
                "Reported";


            if (
                complaint.value.contractor
            ) {

                Object.assign(
                    form.contractor,
                    complaint.value.contractor
                );
            }

        } catch (err) {

            console.error(err);

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to load complaint";

        } finally {

            loading.value =
                false;
        }
    };


const save =
    async () => {

        try {

            saving.value =
                true;

            message.value =
                "";

            const response =
                await api.put(
                    `/admin/complaints/${route.params.id}`,
                    form
                );

            complaint.value =
                response.data.complaint;

            message.value =
                "Complaint updated successfully.";

        } catch (err) {

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to update complaint";

        } finally {

            saving.value =
                false;
        }
    };


onMounted(
    loadComplaint
);

</script>


<style scoped>

.details-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.heading {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.id {
    color: #0a5fc4;
    font-weight: 700;
}

.heading h1 {
    margin: 7px 0;
}

.heading p {
    color: #6b7280;
}

.badges {
    display: flex;
    gap: 8px;
}

.priority,
.status {
    height: fit-content;
    padding: 7px 12px;
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

.grid,
.form-grid {
    display: grid;
    grid-template-columns:
        repeat(2, 1fr);
    gap: 20px;
    margin-top: 25px;
}

.grid div {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.grid label,
.form-group label {
    color: #6b7280;
    font-size: 14px;
}

.description,
.location {
    margin-top: 30px;
}

.description p {
    line-height: 1.7;
}

.location small {
    color: #6b7280;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

select,
input {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
}

.save {
    margin-top: 25px;
    padding: 13px 20px;
    border: none;
    border-radius: 8px;
    background: #0a5fc4;
    color: white;
    cursor: pointer;
}

.save:disabled {
    opacity: .6;
}

.success {
    margin-top: 20px;
    padding: 12px;
    background: #dcfce7;
    color: #166534;
    border-radius: 8px;
}

.error {
    padding: 15px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 8px;
}

@media (max-width: 700px) {

    .heading {
        flex-direction: column;
    }

    .grid,
    .form-grid {
        grid-template-columns: 1fr;
    }

}

.media-section {
    margin-top: 30px;
}

.media-section h2 {
    margin-bottom: 6px;
}

.media-description {
    color: #6b7280;
    margin-bottom: 18px;
}

.media-grid {
    display: grid;
    grid-template-columns: repeat(
        auto-fill,
        minmax(220px, 1fr)
    );
    gap: 18px;
}

.media-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 10px;
    overflow: hidden;
}

.media-card img,
.media-card video {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
}

.media-name {
    margin-top: 10px;
    font-size: 13px;
    color: #4b5563;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.no-media {
    margin-top: 30px;
    padding: 18px;

    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;

    color: #6b7280;
}

</style>