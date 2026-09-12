<template>
    <div class="info-page">
        <section class="intro">
            <p class="tag">WHAT YOU CAN REPORT</p>
            <h1>Explore What Civic Lens Covers</h1>
            <p class="description">
                From potholes to power outages, Civic Lens lets you report a wide
                range of civic issues directly to the department responsible for
                fixing them.
            </p>
        </section>

        <section class="grid">
            <div v-for="item in categories" :key="item.title" class="card category-card">
                <div class="cat-icon">
                    <i :class="item.icon"></i>
                </div>
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
            </div>
        </section>

        <section class="card cta-card">
            <div>
                <h2>Spotted an issue in your neighbourhood?</h2>
                <p>Report it in a few minutes and track it right through to resolution.</p>
            </div>
            <RouterLink to="/register" class="btn-primary">
                <i class="fa-solid fa-pen-to-square"></i>
                Report an Issue
            </RouterLink>
        </section>
    </div>
</template>

<script setup>
const categories = [
    {
        title: "Roads & Potholes",
        icon: "fa-solid fa-road",
        description: "Damaged roads, potholes, broken footpaths and missing signage.",
    },
    {
        title: "Streetlights",
        icon: "fa-solid fa-lightbulb",
        description: "Non-functional, flickering or missing streetlights in your area.",
    },
    {
        title: "Drainage",
        icon: "fa-solid fa-table-cells",
        description: "Blocked drains, waterlogging and broken drainage covers.",
    },
    {
        title: "Garbage & Sanitation",
        icon: "fa-solid fa-trash",
        description: "Uncollected garbage, overflowing bins and sanitation concerns.",
    },
    {
        title: "Water Supply",
        icon: "fa-solid fa-droplet",
        description: "Water leakage, contamination or supply disruptions.",
    },
    {
        title: "Other Civic Issues",
        icon: "fa-solid fa-ellipsis",
        description: "Anything else affecting your locality that needs attention.",
    },
];
</script>

<style scoped>
.info-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #dbeeff 0%, #eafffb 55%, #f5f7fa 100%);
    padding: 6% 5% 60px;
}

.intro {
    max-width: 720px;
    margin: 0 auto 40px;
    text-align: center;
}

.tag {
    color: #0a5fc4;
    font-weight: 700;
    letter-spacing: 2px;
    font-size: 13px;
}

.intro h1 {
    margin: 14px 0;
    font-size: clamp(28px, 4vw, 42px);
    color: #123a8c;
}

.description {
    color: #4b5563;
    font-size: 16px;
    line-height: 1.7;
}

.grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.category-card {
    text-align: center;
}

.cat-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto 14px;
    border-radius: 16px;
    background: linear-gradient(135deg, #0a5fc4, #00c9b1);
    color: white;
    display: grid;
    place-items: center;
    font-size: 22px;
}

.category-card h3 {
    margin-bottom: 8px;
    color: #111827;
}

.category-card p {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
}

.cta-card {
    max-width: 1200px;
    margin: 40px auto 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

.cta-card h2 {
    font-size: 20px;
    margin-bottom: 6px;
    color: #111827;
}

.cta-card p {
    color: #6b7280;
}

.cta-card .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
