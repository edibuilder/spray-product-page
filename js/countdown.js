(function() {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 25);
    targetDate.setHours(23, 59, 59, 999);

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                timerElement.innerHTML = '<div class="time-box"><span>Offer Expired</span></div>';
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (86400000)) / (3600000));
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');

        if (daysElement) daysElement.innerText = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.innerText = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.innerText = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.innerText = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
})();