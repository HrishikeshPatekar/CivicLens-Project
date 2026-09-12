```vue
<template>
    <div class="page-layout">

        <CitizenSidebar />

        <main class="main-content">

            <!-- PAGE HEADING -->
            <div class="heading">

                <div>
                    <h1>
                        Complaint Map
                    </h1>

                    <p>
                        View the locations of your reported complaints.
                    </p>
                </div>

                <span
                    v-if="complaints.length > 0"
                    class="location-count"
                >
                    {{ complaints.length }} locations
                </span>

            </div>


            <!-- ERROR -->
            <div
                v-if="error"
                class="error"
            >
                {{ error }}
            </div>


            <!-- MAP -->
            <div
                id="citizen-map"
            ></div>


            <!-- NO COMPLAINTS -->
            <div
                v-if="!loading && complaints.length === 0 && !error"
                class="empty-message"
            >
                <div class="empty-icon">
                    🗺️
                </div>

                <h3>
                    No complaint locations found
                </h3>

                <p>
                    You have not submitted any complaints with a mapped location yet.
                </p>
            </div>

        </main>

    </div>
</template>


<script setup>

import {
    onMounted,
    onBeforeUnmount,
    ref,
} from "vue";


import L from "leaflet";

import "leaflet/dist/leaflet.css";


import CitizenSidebar from
    "../../components/CitizenSidebar.vue";


import api from
    "../../services/api";


/* =====================================================
   DATA
===================================================== */

const complaints =
    ref([]);


const error =
    ref("");


const loading =
    ref(true);


let map =
    null;


/* =====================================================
   LOAD MAP
===================================================== */

const loadMap =
    async () => {

        try {

            loading.value =
                true;


            /*
             * Get only the complaints belonging
             * to the logged-in citizen.
             */

            const response =
                await api.get(
                    "/complaints/my"
                );


            complaints.value =
                response.data || [];


            /*
             * Create the Leaflet map.
             *
             * This initial location is only used
             * temporarily before we calculate the
             * actual complaint locations.
             *
             * Zoom 5 = India level fallback.
             */

            map =
                L.map(
                    "citizen-map"
                ).setView(
                    [
                        20.5937,
                        78.9629,
                    ],
                    5
                );


            /*
             * OpenStreetMap tiles
             */

            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        "&copy; OpenStreetMap contributors",

                    maxZoom:
                        19,

                    minZoom:
                        3,
                }
            ).addTo(map);


            /*
             * Store all valid markers.
             *
             * We will use these markers later
             * to automatically zoom the map.
             */

            const markers = [];


            /* =================================================
               ADD COMPLAINT MARKERS
            ================================================= */

            complaints.value.forEach(
                (complaint) => {

                    const latitude =
                        complaint.location
                            ?.latitude;


                    const longitude =
                        complaint.location
                            ?.longitude;


                    /*
                     * Check that both latitude
                     * and longitude actually exist.
                     */

                    if (
                        latitude !== undefined &&
                        latitude !== null &&
                        longitude !== undefined &&
                        longitude !== null
                    ) {

                        const marker =
                            L.marker(
                                [
                                    Number(latitude),
                                    Number(longitude),
                                ]
                            ).addTo(
                                map
                            );


                        /*
                         * Popup shown when the
                         * citizen clicks a marker.
                         */

                        marker.bindPopup(
                            `
                            <div class="complaint-popup">

                                <strong>
                                    ${escapeHtml(
                                        complaint.title ||
                                        "Complaint"
                                    )}
                                </strong>

                                <br><br>

                                <strong>
                                    Status:
                                </strong>

                                ${escapeHtml(
                                    complaint.status ||
                                    "Unknown"
                                )}

                                <br>

                                <strong>
                                    Priority:
                                </strong>

                                ${escapeHtml(
                                    complaint.priority ||
                                    "Normal"
                                )}

                                ${
                                    complaint.complaintId
                                        ? `
                                        <br>

                                        <strong>
                                            Complaint ID:
                                        </strong>

                                        ${escapeHtml(
                                            complaint.complaintId
                                        )}
                                        `
                                        : ""
                                }

                            </div>
                            `
                        );


                        /*
                         * Save marker for fitBounds().
                         */

                        markers.push(
                            marker
                        );

                    }

                }
            );


            /* =================================================
               AUTOMATIC MAP ZOOM
            ================================================= */

            if (
                markers.length > 0
            ) {

                /*
                 * Create a group containing
                 * every complaint marker.
                 */

                const group =
                    L.featureGroup(
                        markers
                    );


                /*
                 * Automatically zoom the map
                 * so that all citizen complaints
                 * are visible.
                 *
                 * pad(0.25) gives some space around
                 * the outermost markers.
                 */

                map.fitBounds(
                    group.getBounds().pad(
                        0.25
                    )
                );


                /*
                 * If there is only ONE complaint,
                 * fitBounds can sometimes zoom too
                 * close or too far depending on the
                 * coordinates.
                 *
                 * Therefore we explicitly set a
                 * comfortable zoom level.
                 */

                if (
                    markers.length === 1
                ) {

                    const marker =
                        markers[0];


                    const position =
                        marker.getLatLng();


                    map.setView(
                        [
                            position.lat,
                            position.lng,
                        ],
                        14
                    );

                }

            }


            /*
             * If there are no complaints with
             * valid coordinates, the map remains
             * at the India fallback view.
             */


            /*
             * Leaflet sometimes needs a resize
             * calculation when the map is inside
             * a flex layout.
             */

            setTimeout(
                () => {

                    if (map) {

                        map.invalidateSize();

                    }

                },
                100
            );


        } catch (err) {

            console.error(
                "Citizen map error:",
                err
            );


            error.value =
                err.response?.data
                    ?.message ||
                "Unable to load complaint map";


        } finally {

            loading.value =
                false;

        }

    };


/* =====================================================
   BASIC HTML ESCAPE
===================================================== */

const escapeHtml =
    (value) => {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    };


/* =====================================================
   MOUNT
===================================================== */

onMounted(
    loadMap
);


/* =====================================================
   CLEANUP
===================================================== */

onBeforeUnmount(
    () => {

        if (map) {

            map.remove();

            map =
                null;

        }

    }
);

</script>


<style scoped>

/* =====================================================
   PAGE HEADING
===================================================== */

.heading {

    display: flex;

    justify-content: space-between;

    align-items: center;

    margin-bottom: 20px;

}


.heading h1 {

    margin: 0;

    color: #172033;

    font-size: 28px;

    font-weight: 700;

}


.heading p {

    margin-top: 6px;

    color: #6b7280;

    font-size: 15px;

}


/* =====================================================
   LOCATION COUNT
===================================================== */

.location-count {

    background: #eaf2ff;

    color: #0a5fc4;

    padding: 8px 14px;

    border-radius: 20px;

    font-size: 14px;

    font-weight: 600;

    white-space: nowrap;

}


/* =====================================================
   MAP
===================================================== */

#citizen-map {

    width: 100%;

    height: 650px;

    margin-top: 25px;

    border-radius: 15px;

    overflow: hidden;

    background: #e5e7eb;

    box-shadow:
        0 5px 20px
        rgba(0, 0, 0, 0.08);

}


/* =====================================================
   ERROR
===================================================== */

.error {

    padding: 15px 18px;

    background: #fee2e2;

    color: #991b1b;

    border: 1px solid #fecaca;

    border-radius: 8px;

    margin-bottom: 15px;

}


/* =====================================================
   EMPTY MESSAGE
===================================================== */

.empty-message {

    margin-top: 20px;

    padding: 35px;

    background: white;

    border-radius: 15px;

    text-align: center;

    box-shadow:
        0 5px 20px
        rgba(0, 0, 0, 0.05);

}


.empty-icon {

    font-size: 42px;

    margin-bottom: 12px;

}


.empty-message h3 {

    margin-bottom: 8px;

    color: #172033;

}


.empty-message p {

    color: #6b7280;

}


/* =====================================================
   LEAFLET
===================================================== */

:deep(.leaflet-container) {

    font-family:
        Arial,
        Helvetica,
        sans-serif;

}


/* =====================================================
   POPUP
===================================================== */

:deep(.leaflet-popup-content) {

    line-height: 1.6;

}


:deep(.leaflet-popup-content strong) {

    color: #172033;

}


/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 700px) {

    .heading {

        flex-direction: column;

        align-items: flex-start;

        gap: 12px;

    }


    #citizen-map {

        height: 550px;

        margin-top: 18px;

    }

}


@media (max-width: 500px) {

    #citizen-map {

        height: 500px;

    }

}

</style>

