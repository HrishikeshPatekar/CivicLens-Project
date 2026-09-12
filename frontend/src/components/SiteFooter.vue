<template>
    <footer class="site-footer">
        <div class="footer-links">
            <a href="#">Website Policies</a>
            <span>|</span>
            <a href="#">Privacy Policies</a>
            <span>|</span>
            <a href="#">Disclaimer</a>
            <span>|</span>
            <RouterLink to="/help">FAQ</RouterLink>
            <span class="divider">|</span>

            <div class="socials">
                <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="Telegram"><i class="fa-brands fa-telegram"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                <a href="#" aria-label="Koo"><i class="fa-solid fa-comment-dots"></i></a>
                <a href="#" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
        </div>

        <div class="footer-bottom">
            Website Managed by Government of India &nbsp;©Copyright Content
        </div>
    </footer>
</template>

<script setup></script>

<style scoped>
.site-footer {
    width: 100%;
}

.footer-links {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 16px 5%;
    background: #6b7280;
    color: white;
    font-size: 14px;
}

.footer-links a {
    color: white;
}

.footer-links span {
    opacity: 0.6;
}

.divider {
    display: none;
}

.socials {
    display: flex;
    gap: 10px;
    margin-left: 10px;
}

.socials a {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.15);
    font-size: 13px;
}

.footer-bottom {
    text-align: center;
    padding: 12px 5%;
    background: #374151;
    color: #e5e7eb;
    font-size: 13px;
}

@media (min-width: 640px) {
    .divider {
        display: inline;
    }
}
</style>
