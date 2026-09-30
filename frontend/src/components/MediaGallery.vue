<template>
    <div v-if="items.length" class="gallery">
        <!-- Preview grid: first few items + "+N" tile -->
        <div class="gallery-grid">
            <button
                v-for="(media, index) in visibleItems"
                :key="index"
                type="button"
                class="gallery-tile"
                @click="openViewer(index)"
            >
                <img
                    v-if="media.type === 'image'"
                    :src="fullUrl(media.url)"
                    :alt="media.originalName"
                    loading="lazy"
                />

                <div v-else class="video-thumb">
                    <video :src="fullUrl(media.url)" preload="metadata"></video>
                    <span class="play">▶</span>
                </div>
            </button>

            <button
                v-if="remaining > 0"
                type="button"
                class="gallery-tile more-tile"
                @click="openAll"
            >
                +{{ remaining }}
                <small>more</small>
            </button>
        </div>

        <button
            v-if="items.length > maxVisible"
            type="button"
            class="view-all"
            @click="openAll"
        >
            View all {{ items.length }} files
        </button>

        <!-- Lightbox -->
        <Teleport to="body">
            <div
                v-if="open"
                class="overlay"
                @click.self="close"
            >
                <div class="modal">
                    <div class="modal-header">
                        <h3 v-if="activeIndex === null">
                            All photos &amp; videos ({{ items.length }})
                        </h3>

                        <button
                            v-else
                            type="button"
                            class="back"
                            @click="activeIndex = null"
                        >
                            ← All files
                        </button>

                        <button
                            type="button"
                            class="close"
                            aria-label="Close"
                            @click="close"
                        >
                            ✕
                        </button>
                    </div>

                    <!-- All files grid (scrollable) -->
                    <div
                        v-if="activeIndex === null"
                        class="modal-grid"
                    >
                        <button
                            v-for="(media, index) in items"
                            :key="index"
                            type="button"
                            class="modal-tile"
                            @click="activeIndex = index"
                        >
                            <img
                                v-if="media.type === 'image'"
                                :src="fullUrl(media.url)"
                                :alt="media.originalName"
                                loading="lazy"
                            />

                            <div v-else class="video-thumb">
                                <video
                                    :src="fullUrl(media.url)"
                                    preload="metadata"
                                ></video>
                                <span class="play">▶</span>
                            </div>
                        </button>
                    </div>

                    <!-- Single large view -->
                    <div v-else class="viewer">
                        <button
                            type="button"
                            class="nav prev"
                            :disabled="activeIndex === 0"
                            @click="prev"
                        >
                            ‹
                        </button>

                        <div class="viewer-body">
                            <img
                                v-if="activeItem.type === 'image'"
                                :src="fullUrl(activeItem.url)"
                                :alt="activeItem.originalName"
                            />

                            <video
                                v-else
                                :key="activeItem.url"
                                :src="fullUrl(activeItem.url)"
                                controls
                                autoplay
                            ></video>

                            <p class="caption">
                                {{ activeItem.originalName }}
                                ·
                                {{ activeIndex + 1 }} / {{ items.length }}
                            </p>
                        </div>

                        <button
                            type="button"
                            class="nav next"
                            :disabled="activeIndex === items.length - 1"
                            @click="next"
                        >
                            ›
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
    media: {
        type: Array,
        default: () => [],
    },
    // How many thumbnails to show before the "+N" tile
    maxVisible: {
        type: Number,
        default: 4,
    },
});

const BASE_URL = "http://localhost:5000";

const open = ref(false);
const activeIndex = ref(null);

const items = computed(() => props.media || []);
const visibleItems = computed(() =>
    items.value.slice(0, props.maxVisible)
);
const remaining = computed(() =>
    Math.max(items.value.length - props.maxVisible, 0)
);
const activeItem = computed(() =>
    activeIndex.value === null ? null : items.value[activeIndex.value]
);

const fullUrl = (url) =>
    /^https?:\/\//.test(url) ? url : `${BASE_URL}${url}`;

const openViewer = (index) => {
    activeIndex.value = index;
    open.value = true;
};

const openAll = () => {
    activeIndex.value = null;
    open.value = true;
};

const close = () => {
    open.value = false;
    activeIndex.value = null;
};

const prev = () => {
    if (activeIndex.value > 0) activeIndex.value--;
};

const next = () => {
    if (activeIndex.value < items.value.length - 1) activeIndex.value++;
};

const onKey = (event) => {
    if (!open.value) return;

    if (event.key === "Escape") {
        activeIndex.value === null ? close() : (activeIndex.value = null);
    } else if (activeIndex.value !== null) {
        if (event.key === "ArrowLeft") prev();
        if (event.key === "ArrowRight") next();
    }
};

watch(open, (isOpen) => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    if (isOpen) {
        window.addEventListener("keydown", onKey);
    } else {
        window.removeEventListener("keydown", onKey);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
});
</script>

<style scoped>
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
}

.gallery-tile,
.modal-tile {
    position: relative;
    aspect-ratio: 1 / 1;
    padding: 0;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #f3f4f6;
    overflow: hidden;
    cursor: pointer;
}

.gallery-tile img,
.modal-tile img,
.video-thumb video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.video-thumb {
    position: relative;
    width: 100%;
    height: 100%;
}

.play {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 26px;
    background: rgba(0, 0, 0, 0.25);
}

.more-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #111827;
    color: white;
    font-size: 28px;
    font-weight: 700;
}

.more-tile small {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.8;
}

.view-all {
    margin-top: 12px;
    padding: 9px 16px;
    border: none;
    border-radius: 8px;
    background: #eff6ff;
    color: #1d4ed8;
    font-weight: 600;
    cursor: pointer;
}

/* Lightbox */
.overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.7);
}

.modal {
    display: flex;
    flex-direction: column;
    width: min(1000px, 100%);
    max-height: 90vh;
    background: white;
    border-radius: 16px;
    overflow: hidden;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
    margin: 0;
}

.close,
.back {
    border: none;
    background: #f3f4f6;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

.modal-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 20px;
    overflow-y: auto;
}

.viewer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    background: #0b0f19;
    min-height: 0;
}

.viewer-body {
    flex: 1;
    min-width: 0;
    text-align: center;
}

.viewer-body img,
.viewer-body video {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 8px;
}

.caption {
    margin: 10px 0 0;
    color: #d1d5db;
    font-size: 13px;
}

.nav {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    font-size: 26px;
    cursor: pointer;
}

.nav:disabled {
    opacity: 0.3;
    cursor: default;
}
</style>
