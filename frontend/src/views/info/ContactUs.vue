<template>
    <div class="info-page">
        <section class="intro">
            <p class="tag">GET IN TOUCH</p>
            <h1>Contact Us</h1>
            <p class="description">
                Have a question about the platform, a technical issue, or feedback
                for us? Reach out through any of the channels below.
            </p>
        </section>

        <section class="grid">
            <div class="card contact-card">
                <div class="icon-badge icon-blue">
                    <i class="fa-solid fa-phone"></i>
                </div>
                <h3>Citizen Helpline</h3>
                <p class="highlight">1800-11-4000</p>
                <p>Toll-free, Mon–Sat, 9:00 AM – 6:00 PM</p>
            </div>

            <div class="card contact-card">
                <div class="icon-badge icon-teal">
                    <i class="fa-solid fa-envelope"></i>
                </div>
                <h3>Email Support</h3>
                <p class="highlight">
                    <a href="mailto:support@civiclens.gov.in">support@civiclens.gov.in</a>
                </p>
                <p>We typically respond within 2 working days.</p>
            </div>

            <div class="card contact-card">
                <div class="icon-badge icon-navy">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3>Head Office</h3>
                <p class="highlight">Civic Lens Mission Office</p>
                <p>Ministry of Housing &amp; Urban Affairs, New Delhi, India</p>
            </div>
        </section>

        <section class="card note-card">
            <i class="fa-solid fa-circle-info"></i>
            <p>
                For reporting a civic issue, please use the
                <RouterLink to="/register">Report an Issue</RouterLink>
                option instead of contacting support directly — this ensures
                it reaches the correct department faster.
            </p>
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
    max-width: 1100px;
    margin: 0 auto 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.contact-card {
    text-align: center;
}

.icon-badge {
    width: 50px;
    height: 50px;
    margin: 0 auto 14px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: white;
    font-size: 20px;
}

.icon-blue { background: #0a5fc4; }
.icon-teal { background: #00b39a; }
.icon-navy { background: #123a8c; }

.contact-card h3 {
    margin-bottom: 8px;
    color: #111827;
}

.highlight {
    font-weight: 700;
    color: #123a8c;
    margin-bottom: 4px;
}

.highlight a {
    color: #123a8c;
}

.contact-card p {
    color: #6b7280;
    font-size: 14px;
}

.note-card {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    gap: 14px;
}

.note-card i {
    color: #0a5fc4;
    font-size: 18px;
    margin-top: 2px;
}

.note-card p {
    color: #4b5563;
    line-height: 1.6;
}

.note-card a {
    color: #0a5fc4;
    font-weight: 600;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
