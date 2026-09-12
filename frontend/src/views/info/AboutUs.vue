<template>
    <div class="info-page">
        <section class="intro">
            <p class="tag">ABOUT THE PLATFORM</p>
            <h1>About Civic Lens</h1>
            <p class="description">
                Civic Lens is a national platform that connects citizens directly
                with the government departments responsible for fixing everyday
                civic issues — making local governance more transparent,
                accountable and responsive.
            </p>
        </section>

        <section class="grid two-col">
            <div class="card">
                <div class="icon-badge icon-blue">
                    <i class="fa-solid fa-bullseye"></i>
                </div>
                <h3>Our Mission</h3>
                <p>
                    To give every citizen a simple, reliable way to report civic
                    problems and see them resolved — closing the loop between
                    reporting an issue and getting it fixed.
                </p>
            </div>

            <div class="card">
                <div class="icon-badge icon-teal">
                    <i class="fa-solid fa-eye"></i>
                </div>
                <h3>Our Vision</h3>
                <p>
                    Cleaner, safer and better-maintained cities across India,
                    built on transparent tracking and data-driven accountability
                    for public infrastructure.
                </p>
            </div>
        </section>

        <section class="card how-it-works">
            <h2>How Civic Lens Works</h2>

            <div class="steps">
                <div class="step">
                    <span class="step-no">1</span>
                    <h4>Report</h4>
                    <p>Submit a complaint with photos, location and description.</p>
                </div>

                <div class="step">
                    <span class="step-no">2</span>
                    <h4>Assign</h4>
                    <p>The issue is routed to the concerned department automatically.</p>
                </div>

                <div class="step">
                    <span class="step-no">3</span>
                    <h4>Track</h4>
                    <p>Follow real-time status updates from your dashboard.</p>
                </div>

                <div class="step">
                    <span class="step-no">4</span>
                    <h4>Resolve</h4>
                    <p>Get notified the moment your issue is marked resolved.</p>
                </div>
            </div>
        </section>

        <section class="card">
            <h2>Why Citizens Trust Civic Lens</h2>
            <ul class="trust-list">
                <li><i class="fa-solid fa-check"></i> Backed by the Government of India</li>
                <li><i class="fa-solid fa-check"></i> Transparent status tracking for every complaint</li>
                <li><i class="fa-solid fa-check"></i> Data used to improve civic infrastructure planning</li>
                <li><i class="fa-solid fa-check"></i> Free and open to every citizen</li>
            </ul>
        </section>
    </div>
</template>

<script setup></script>

<style scoped>
.info-page {
    min-height: 100vh;
    background: linear-gradient(160deg, #dbeeff 0%, #eafffb 55%, #f5f7fa 100%);
    padding: 6% 5% 60px;
}

.intro {
    max-width: 760px;
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
    max-width: 1100px;
    margin: 0 auto 24px;
    display: grid;
    gap: 20px;
}

.two-col {
    grid-template-columns: repeat(2, 1fr);
}

.icon-badge {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    color: white;
    font-size: 18px;
    margin-bottom: 14px;
}

.icon-blue { background: linear-gradient(135deg, #0a5fc4, #123a8c); }
.icon-teal { background: linear-gradient(135deg, #00c9b1, #00b39a); }

.grid .card h3 {
    margin-bottom: 8px;
    color: #111827;
}

.grid .card p {
    color: #6b7280;
    line-height: 1.6;
}

.how-it-works {
    max-width: 1100px;
    margin: 0 auto 24px;
}

.how-it-works h2 {
    color: #111827;
    margin-bottom: 22px;
}

.steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
}

.step-no {
    display: inline-grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #0a5fc4, #00c9b1);
    color: white;
    font-weight: 700;
    margin-bottom: 10px;
}

.step h4 {
    margin-bottom: 6px;
    color: #111827;
}

.step p {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
}

.trust-list {
    max-width: 1100px;
    margin: 0 auto;
    list-style: none;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
}

.trust-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #374151;
}

.trust-list i {
    color: #16a34a;
}

section.card {
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 900px) {
    .two-col,
    .steps,
    .trust-list {
        grid-template-columns: 1fr;
    }
}
</style>
