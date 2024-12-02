let countdown = 30;
const timerElement = document.getElementById('timer');

function startCountdown() {
    const countdownInterval = setInterval(function() {
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = 'timeup.html';
        } else {
            timerElement.innerHTML = countdown;
            countdown--;
        }
    }, 1000);
}

startCountdown();
