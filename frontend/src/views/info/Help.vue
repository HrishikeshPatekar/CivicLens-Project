<template>
    <div class="info-page">
        <section class="intro">
            <p class="tag">FREQUENTLY ASKED QUESTIONS</p>
            <h1>Help &amp; Support</h1>
            <p class="description">
                Find quick answers to common questions about reporting, tracking
                and resolving civic issues on Civic Lens.
            </p>
        </section>

        <section class="faq-list">
            <div
                v-for="(item, index) in faqs"
                :key="index"
                class="card faq-item"
                :class="{ open: openIndex === index }"
            >
                <button
                    type="button"
                    class="faq-question"
                    @click="toggle(index)"
                >
                    <span>
                        <i class="fa-solid fa-circle-question"></i>
                        {{ item.question }}
                    </span>
                    <i
                        class="fa-solid chevron"
                        :class="openIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'"
                    ></i>
                </button>

                <p v-if="openIndex === index" class="faq-answer">
                    {{ item.answer }}
                </p>
            </div>
        </section>

        <section class="card cta-card">
            <div>
                <h2>Still need help?</h2>
                <p>Our support team is just a message away.</p>
            </div>
            <RouterLink to="/contact" class="btn-primary">
                <i class="fa-solid fa-headset"></i>
                Contact Support
            </RouterLink>
        </section>
    </div>
</template>

<script setup>
import { ref } from "vue";

const openIndex = ref(0);

const toggle = (index) => {
    openIndex.value = openIndex.value === index ? -1 : index;
};

const faqs = [
    {
        question: "How do I report a civic issue?",
        answer:
            "Register or log in to your Citizen account, then click 'Report an Issue' and fill in the incident date, description, location and photos of the problem.",
    },
    {
        question: "How can I track the status of my complaint?",
        answer:
            "Log in and open 'My Reports' from your dashboard to see the live status — Reported, In Progress, Resolved or Rejected — of every complaint you've filed.",
    },
    {
        question: "I forgot my password. What do I do?",
        answer:
            "Click 'Forgot Password?' on the login page and follow the OTP-based steps to reset your password securely.",
    },
    {
        question: "What information should I include in a complaint?",
        answer:
            "Include the incident date and time, a clear description (minimum 100 characters), the exact or nearby location, and a photo or video if possible — this helps resolve it faster.",
    },
    {
        question: "How long does it take to resolve a complaint?",
        answer:
            "Resolution time varies by issue type and department workload. You can see the platform's current average resolution time on the Home page.",
    },
    {
        question: "Who can I contact for further support?",
        answer:
            "Visit the Contact Us page for the citizen helpline number and support email address.",
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

.faq-list {
    max-width: 800px;
    margin: 0 auto 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.faq-item {
    padding: 0;
    overflow: hidden;
}

.faq-item.open {
    box-shadow: 0 10px 30px rgba(10, 95, 196, 0.12);
}

.faq-question {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: none;
    border: none;
    padding: 18px 22px;
    text-align: left;
    font-weight: 600;
    color: #111827;
}

.faq-question i.fa-circle-question {
    color: #0a5fc4;
    margin-right: 10px;
}

.chevron {
    color: #9ca3af;
    flex-shrink: 0;
}

.faq-answer {
    padding: 0 22px 20px 50px;
    color: #6b7280;
    line-height: 1.7;
}

.cta-card {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}

.cta-card h2 {
    font-size: 20px;
    color: #111827;
    margin-bottom: 6px;
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
</style>
