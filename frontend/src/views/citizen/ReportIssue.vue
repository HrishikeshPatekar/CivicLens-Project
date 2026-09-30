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
                            ref="fileInput"
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            @change="handleFiles"
                        />

                        <small v-if="selectedFiles.length">
                            {{ selectedFiles.length }} file(s) selected
                        </small>
                    </div>

                    <div
                        v-if="selectedFiles.length"
                        class="media-preview"
                    >
                        <div
                            v-for="(media, index) in previewFiles"
                            :key="media.id"
                            class="media-box"
                        >
                            <button
                                type="button"
                                class="remove-btn"
                                aria-label="Remove file"
                                @click="removeFile(index)"
                            >
                                ✕
                            </button>

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

                        <button
                            v-if="!showAll && hiddenCount > 0"
                            type="button"
                            class="more-box"
                            @click="showAll = true"
                        >
                            +{{ hiddenCount }}
                            <small>more</small>
                        </button>
                    </div>

                    <button
                        v-if="showAll && selectedFiles.length > 4"
                        type="button"
                        class="show-less"
                        @click="showAll = false"
                    >
                        Show less
                    </button>

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
import { computed, onBeforeUnmount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import CitizenSidebar from "../../components/CitizenSidebar.vue";
import api from "../../services/api";

const router = useRouter();

const loading = ref(false);
const error = ref("");

const suggestions = ref([]);
const selectedFiles = ref([]);
const fileInput = ref(null);

const MAX_VISIBLE = 4;
const showAll = ref(false);

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
    const newFiles = Array.from(event.target.files);

    // Keep the files that were already selected and add the new ones.
    // (Previously the list was replaced, so old photos disappeared.)
    const existingKeys = new Set(
        selectedFiles.value.map((m) => m.key)
    );

    for (const file of newFiles) {
        const key = `${file.name}-${file.size}-${file.lastModified}`;

        if (existingKeys.has(key)) continue;

        existingKeys.add(key);

        selectedFiles.value.push({
            id: `${key}-${Math.random()}`,
            key,
            file,
            name: file.name,
            type: file.type,
            preview: URL.createObjectURL(file),
        });
    }

    // Reset the input so choosing the same file again still fires @change
    if (fileInput.value) {
        fileInput.value.value = "";
    }
};

const previewFiles = computed(() =>
    showAll.value
        ? selectedFiles.value
        : selectedFiles.value.slice(0, MAX_VISIBLE)
);

const hiddenCount = computed(() =>
    Math.max(selectedFiles.value.length - MAX_VISIBLE, 0)
);

const removeFile = (index) => {
    URL.revokeObjectURL(selectedFiles.value[index].preview);
    selectedFiles.value.splice(index, 1);
    error.value = "";

    if (selectedFiles.value.length <= MAX_VISIBLE) {
        showAll.value = false;
    }
};

onBeforeUnmount(() => {
    selectedFiles.value.forEach((m) =>
        URL.revokeObjectURL(m.preview)
    );
});

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
    position: relative;
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

.more-box {
    width: 130px;
    min-height: 130px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 10px;
    background: #111827;
    color: white;
    font-size: 26px;
    font-weight: 700;
    cursor: pointer;
}

.more-box small {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.8;
}

.show-less {
    margin-bottom: 20px;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
    cursor: pointer;
}

.remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: rgba(17, 24, 39, 0.8);
    color: white;
    font-size: 12px;
    line-height: 22px;
    cursor: pointer;
}

.submit {
    margin-top: 10px;
}
</style>
