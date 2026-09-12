<template>
    <div class="page-layout">
        <CitizenSidebar />

        <main class="main-content">
            <div class="page-header">
                <h1>Report an Issue</h1>
                <p>
                    Help improve your community by reporting
                    civic problems.
                </p>
            </div>

            <div class="card">
                <div v-if="error" class="error">
                    {{ error }}
                </div>

                <form @submit.prevent="submitComplaint">

                    <div class="form-group">
                        <label>Issue Title</label>

                        <input
                            v-model="form.title"
                            placeholder="Example: Large pothole near college"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label>Category</label>

                        <select
                            v-model="form.category"
                            required
                        >
                            <option value="">
                                Select category
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
                                Garbage Management
                            </option>

                            <option>
                                Street Lighting
                            </option>

                            <option>
                                Public Works
                            </option>

                            <option>
                                Other
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Location</label>

                        <input
                            v-model="form.address"
                            placeholder="Type your location..."
                            required
                            @input="locationSearch"
                        />

                        <div
                            v-if="suggestions.length"
                            class="suggestions"
                        >
                            <button
                                v-for="place in suggestions"
                                :key="place.place_id"
                                type="button"
                                @click="selectLocation(place)"
                            >
                                {{ place.display_name }}
                            </button>
                        </div>

                        <small v-if="form.latitude">
                            Location selected:
                            {{ form.latitude }},
                            {{ form.longitude }}
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Description</label>

                        <textarea
                            v-model="form.description"
                            placeholder="Describe the issue..."
                            required
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label>
                            Upload Photos / Videos
                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            @change="handleFiles"
                        />
                    </div>

                    <div
                        v-if="selectedFiles.length"
                        class="media-preview"
                    >
                        <div
                            v-for="(media, index) in selectedFiles"
                            :key="index"
                            class="media-box"
                        >
                            <img
                                v-if="
                                    media.type.startsWith('image')
                                "
                                :src="media.preview"
                            />

                            <video
                                v-else
                                :src="media.preview"
                                controls
                            ></video>

                            <span>
                                {{ media.name }}
                            </span>
                        </div>
                    </div>

                    <button
                        class="btn-primary submit"
                        :disabled="loading"
                    >
                        {{
                            loading
                                ? "Submitting..."
                                : "Submit Complaint"
                        }}
                    </button>
                </form>
            </div>
        </main>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import CitizenSidebar from "../../components/CitizenSidebar.vue";
import api from "../../services/api";

const router = useRouter();

const loading = ref(false);
const error = ref("");

const suggestions = ref([]);
const selectedFiles = ref([]);

const form = reactive({
    title: "",
    category: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
});

let searchTimer;

const locationSearch = () => {
    clearTimeout(searchTimer);

    if (form.address.length < 3) {
        suggestions.value = [];
        return;
    }

    searchTimer = setTimeout(async () => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    form.address
                )}&limit=5`
            );

            suggestions.value = await response.json();

        } catch (err) {
            console.error(err);
        }
    }, 500);
};

const selectLocation = (place) => {
    form.address = place.display_name;
    form.latitude = place.lat;
    form.longitude = place.lon;

    suggestions.value = [];
};

const handleFiles = (event) => {
    const files = Array.from(event.target.files);

    selectedFiles.value = files.map((file) => ({
        file,
        name: file.name,
        type: file.type,
        preview: URL.createObjectURL(file),
    }));
};

const submitComplaint = async () => {
    error.value = "";

    if (!form.latitude || !form.longitude) {
        error.value =
            "Please select a location from the suggestions.";

        return;
    }

    loading.value = true;

    try {
        const formData = new FormData();

        formData.append("title", form.title);
        formData.append("category", form.category);
        formData.append(
            "description",
            form.description
        );
        formData.append("address", form.address);
        formData.append(
            "latitude",
            form.latitude
        );
        formData.append(
            "longitude",
            form.longitude
        );

        selectedFiles.value.forEach((media) => {
            formData.append(
                "media",
                media.file
            );
        });

        const response = await api.post(
            "/complaints",
            formData
        );

        const complaint =
            response.data.complaint;

        router.push(
            `/complaint-submitted/${complaint.complaintId}`
        );

    } catch (err) {
        error.value =
            err.response?.data?.message ||
            "Unable to submit complaint.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.page-header {
    margin-bottom: 25px;
}

.page-header p {
    color: #6b7280;
    margin-top: 5px;
}

.suggestions {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 5px;
}

.suggestions button {
    text-align: left;
    padding: 12px;
    border: none;
    border-bottom: 1px solid #eee;
    background: white;
}

.suggestions button:hover {
    background: #eff6ff;
}

.media-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 25px;
}

.media-box {
    width: 130px;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 7px;
    background: white;
}

.media-box img,
.media-box video {
    width: 100%;
    height: 90px;
    object-fit: cover;
    border-radius: 7px;
}

.media-box span {
    display: block;
    margin-top: 5px;
    font-size: 11px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.submit {
    margin-top: 10px;
}
</style>