document.addEventListener("DOMContentLoaded", () => {
    const targetElement = document.getElementById("fade-target");

    function fadeEffect() {
        // Fade out
        targetElement.style.opacity = "0";
        setTimeout(() => {
            // Fade in after 2 seconds
            targetElement.style.opacity = "1";
        }, 2000);
    }

    function scheduleFadeEffect() {
        const now = new Date();
        const nextHour = new Date();
        nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Set to the next hour
        const timeUntilNextHour = nextHour - now;

        // Schedule the first fade effect
        setTimeout(() => {
            fadeEffect();
            // Repeat every hour
            setInterval(fadeEffect, 3600000);
        }, timeUntilNextHour);
    }

    scheduleFadeEffect();
});
