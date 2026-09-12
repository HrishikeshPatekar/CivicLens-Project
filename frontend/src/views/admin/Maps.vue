<template>
    <div class="page-layout">

        <AdminSidebar />

        <main class="main-content">

            <div class="heading">

                <div>
                    <h1>
                        Complaint Map
                    </h1>

                    <p>
                        View the geographical locations of reported incidents.
                    </p>
                </div>

                <span>
                    {{ complaints.length }} locations
                </span>

            </div>


            <div
                v-if="error"
                class="error"
            >
                {{ error }}
            </div>


            <div
                id="admin-map"
            ></div>

        </main>

    </div>
</template>


<script setup>

import {
    onBeforeUnmount,
    onMounted,
    ref,
} from "vue";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import AdminSidebar from
    "../../components/AdminSidebar.vue";

import api from
    "../../services/api";


const complaints =
    ref([]);

const error =
    ref("");


let map =
    null;


const loadMap =
    async () => {

        try {

            const response =
                await api.get(
                    "/admin/complaints"
                );

            complaints.value =
                response.data;


            map =
                L.map(
                    "admin-map"
                ).setView(
                    [
                        20.5937,
                        78.9629,
                    ],
                    5
                );


            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        "&copy; OpenStreetMap contributors",
                }
            ).addTo(map);


            const markers = [];


            complaints.value.forEach(
                (complaint) => {

                    const latitude =
                        complaint.location
                            ?.latitude;

                    const longitude =
                        complaint.location
                            ?.longitude;


                    if (
                        latitude !== undefined &&
                        longitude !== undefined
                    ) {

                        const marker =
                            L.marker(
                                [
                                    latitude,
                                    longitude,
                                ]
                            ).addTo(map);


                        marker.bindPopup(
                            `
                            <div>
                                <strong>
                                    ${complaint.title}
                                </strong>
                                <br>
                                ID:
                                ${complaint.complaintId}
                                <br>
                                Priority:
                                ${complaint.priority}
                                <br>
                                Status:
                                ${complaint.status}
                                <br>
                                Reports:
                                ${complaint.similarReports}
                            </div>
                            `
                        );


                        markers.push(
                            marker
                        );
                    }
                }
            );


            if (
                markers.length > 0
            ) {

                const group =
                    L.featureGroup(
                        markers
                    );

                map.fitBounds(
                    group.getBounds().pad(
                        0.2
                    )
                );
            }


        } catch (err) {

            console.error(err);

            error.value =
                err.response?.data
                    ?.message ||
                "Unable to load complaint map";
        }
    };


onMounted(
    loadMap
);


onBeforeUnmount(
    () => {

        if (map) {
            map.remove();
        }

    }
);

</script>


<style scoped>

.heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.heading p {
    color: #6b7280;
}

#admin-map {
    width: 100%;
    height: 650px;
    border-radius: 15px;
    overflow: hidden;
    background: #e5e7eb;
}

.error {
    padding: 15px;
    background: #fee2e2;
    color: #991b1b;
    border-radius: 8px;
    margin-bottom: 15px;
}

@media (max-width: 700px) {

    .heading {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

}

</style>