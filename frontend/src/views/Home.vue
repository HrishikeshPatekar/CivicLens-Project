<template>
    <div class="home">
        <section class="hero">
            <div class="hero-inner">
                <div class="hero-text">
                    <p class="tag">SMARTER GOVERNANCE</p>

                    <h1>
                        Report Local Issues.<br />
                        Make Your City <span class="highlight">Better</span>.
                    </h1>

                    <p class="description">
                        Civic Lens connects citizens with
                        government authorities to report,
                        track and resolve civic issues.
                    </p>

                    <div class="actions">
                        <RouterLink
                            to="/register"
                            class="btn-primary"
                        >
                            <i class="fa-solid fa-pen-to-square"></i>
                            Report an Issue
                        </RouterLink>

                        <RouterLink
                            to="/login"
                            class="btn-secondary"
                        >
                            <i class="fa-solid fa-magnifying-glass"></i>
                            Track an Issue
                        </RouterLink>
                    </div>
                </div>

                <div class="hero-art">
                    <div class="floating-icon icon-1">
                        <i class="fa-solid fa-road"></i>
                        <span>Roads</span>
                    </div>
                    <div class="floating-icon icon-2">
                        <i class="fa-solid fa-lightbulb"></i>
                        <span>Streetlight</span>
                    </div>
                    <div class="floating-icon icon-3">
                        <i class="fa-solid fa-table-cells"></i>
                        <span>Drainage</span>
                    </div>
                    <div class="floating-icon icon-4">
                        <i class="fa-solid fa-trash"></i>
                        <span>Garbage</span>
                    </div>
                    <div class="floating-icon icon-5">
                        <i class="fa-solid fa-droplet"></i>
                        <span>Water</span>
                    </div>
                    <div class="floating-icon icon-6">
                        <i class="fa-solid fa-ellipsis"></i>
                        <span>More</span>
                    </div>

                    <div class="phone">
                        <div class="phone-notch"></div>
                        <div class="phone-screen">
                            <strong class="phone-brand">
                                <i class="fa-solid fa-house-chimney"></i>
                                Civic Lens
                            </strong>
                            <p class="phone-headline">
                                Report.<br />
                                <span>Track.</span><br />
                                <span class="resolve">Resolve.</span>
                            </p>
                            <p class="phone-sub">
                                Together, we can build
                                a better India.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="stats-bar">
                <div class="stat">
                    <div class="stat-icon icon-blue">
                        <i class="fa-solid fa-clipboard-list"></i>
                    </div>
                    <div>
                        <strong>{{ formatCount(stats.issuesReported) }}</strong>
                        <span>Issues Reported</span>
                        <small>Across India</small>
                    </div>
                </div>

                <div class="stat">
                    <div class="stat-icon icon-green">
                        <i class="fa-solid fa-gear"></i>
                    </div>
                    <div>
                        <strong>{{ formatCount(stats.issuesResolved) }}</strong>
                        <span>Issues Resolved</span>
                        <small>Successfully</small>
                    </div>
                </div>

                <div class="stat">
                    <div class="stat-icon icon-purple">
                        <i class="fa-solid fa-people-group"></i>
                    </div>
                    <div>
                        <strong>{{ formatCount(stats.activeCitizens) }}</strong>
                        <span>Active Citizens</span>
                        <small>Making a Difference</small>
                    </div>
                </div>

                <div class="stat">
                    <div class="stat-icon icon-orange">
                        <i class="fa-solid fa-clock"></i>
                    </div>
                    <div>
                        <strong>
                            {{
                                stats.avgResolutionDays === null
                                    ? "—"
                                    : `${stats.avgResolutionDays} Days`
                            }}
                        </strong>
                        <span>Avg. Resolution Time</span>
                        <small>Our Commitment</small>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import api from "../services/api";

const stats = reactive({
    issuesReported: null,
    issuesResolved: null,
    activeCitizens: null,
    avgResolutionDays: null,
});

const formatCount = (value) => {
    if (value === null || value === undefined) return "—";
    return value.toLocaleString("en-IN") + "+";
};

onMounted(async () => {
    try {
        const response = await api.get(
            "/complaints/public-stats"
        );

        stats.issuesReported = response.data.issuesReported;
        stats.issuesResolved = response.data.issuesResolved;
        stats.activeCitizens = response.data.activeCitizens;
        stats.avgResolutionDays = response.data.avgResolutionDays;
    } catch (error) {
        console.error("Failed to load platform stats:", error);
    }
});
</script>

<style scoped>
.home {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
}

.hero {
    flex: 1;
    background: linear-gradient(160deg, #dbeeff 0%, #eafffb 55%, #f5f7fa 100%);
    padding: 6% 5% 70px;
    position: relative;
}

.hero-inner {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 40px;
    align-items: center;
    max-width: 1300px;
    margin: 0 auto;
}

.tag {
    color: #0a5fc4;
    font-weight: 700;
    letter-spacing: 2px;
    font-size: 14px;
}

h1 {
    margin: 16px 0;
    font-size: clamp(34px, 4.5vw, 56px);
    line-height: 1.15;
    color: #123a8c;
}

.highlight {
    color: #00b39a;
}

.description {
    max-width: 560px;
    color: #4b5563;
    font-size: 17px;
    line-height: 1.7;
}

.actions {
    display: flex;
    gap: 16px;
    margin-top: 28px;
    flex-wrap: wrap;
}

.actions .btn-primary,
.actions .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.actions .btn-secondary {
    color: #123a8c;
    font-weight: 600;
}

/* HERO ART */
.hero-art {
    position: relative;
    min-height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.phone {
    width: 210px;
    height: 380px;
    background: #0b1533;
    border-radius: 34px;
    padding: 10px;
    box-shadow: 0 30px 60px rgba(10, 30, 80, 0.25);
    position: relative;
    z-index: 2;
}

.phone-notch {
    width: 60px;
    height: 8px;
    background: #1c2748;
    border-radius: 10px;
    margin: 6px auto 10px;
}

.phone-screen {
    background: linear-gradient(160deg, #ffffff, #eafffb);
    height: calc(100% - 24px);
    border-radius: 24px;
    padding: 18px 16px;
}

.phone-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #123a8c;
}

.phone-headline {
    margin-top: 30px;
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    line-height: 1.3;
}

.phone-headline .resolve {
    color: #00b39a;
}

.phone-sub {
    margin-top: 16px;
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
}

.floating-icon {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 74px;
    height: 74px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    justify-content: center;
    font-size: 11px;
    color: #374151;
    z-index: 3;
}

.floating-icon i {
    font-size: 18px;
    color: #0a5fc4;
}

.icon-1 { top: 4%; left: 6%; }
.icon-2 { top: 4%; right: 6%; }
.icon-3 { top: 42%; left: -2%; }
.icon-4 { top: 42%; right: -2%; }
.icon-5 { bottom: 6%; left: 6%; }
.icon-6 { bottom: 6%; right: 6%; }

/* STATS BAR */
.stats-bar {
    max-width: 1200px;
    margin: 50px auto 0;
    transform: translateY(40px);
    background: white;
    border-radius: 18px;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 26px 20px;
}

.stat {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 14px;
    border-right: 1px solid #e5e7eb;
}

.stat:last-child {
    border-right: none;
}

.stat-icon {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: white;
    font-size: 18px;
    flex-shrink: 0;
}

.icon-blue { background: #0a5fc4; }
.icon-green { background: #16a34a; }
.icon-purple { background: #7c3aed; }
.icon-orange { background: #f59e0b; }

.stat div strong {
    display: block;
    font-size: 20px;
    color: #111827;
}

.stat div span {
    display: block;
    font-size: 13px;
    color: #374151;
}

.stat div small {
    display: block;
    font-size: 11px;
    color: #9ca3af;
}

@media (max-width: 900px) {
    .hero-inner {
        grid-template-columns: 1fr;
    }

    .hero-art {
        min-height: 320px;
    }

    .stats-bar {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        transform: none;
        margin-top: 30px;
    }

    .stat {
        border-right: none;
    }
}
</style>
