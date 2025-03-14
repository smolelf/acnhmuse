document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const currentTimeDisplay = document.getElementById('current-time');

    let audioContext, gainNode, backgroundAudio, browser, audioPlaying = true;

    // Initialize Web Audio API
    function initializeAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioPlayer);
        gainNode = audioContext.createGain();
        source.connect(gainNode).connect(audioContext.destination);
    }

    // Fade out the audio
    function fadeOut(duration = 4) {
        const step = 0.05; // Volume decrement step
        const interval = (duration * 1000) / (1 / step); // Interval in ms
        const fadeInterval = setInterval(() => {
            if (audioPlayer.volume > step) {
                audioPlayer.volume -= step;
            } else {
                audioPlayer.volume = 0;
                clearInterval(fadeInterval);
            }
        }, interval);
    }

    // Fade in the audio
    function fadeIn(duration = 4) {
        const step = 0.05; // Volume increment step
        const interval = (duration * 1000) / (1 / step); // Interval in ms
        audioPlayer.volume = 0; // Start from 0 volume
        const fadeInterval = setInterval(() => {
            if (audioPlayer.volume < 1 - step) {
                audioPlayer.volume += step;
            } else {
                audioPlayer.volume = 1;
                clearInterval(fadeInterval);
            }
        }, interval);
    }

    function updateMusicSource() {
        const now = new Date();
        let hour = now.getHours();
        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert to 12-hour format
        const filename = `${hour}${period}.flac`;

        // Fade out, change source, and fade in
        fadeOut(4);
        setTimeout(() => {
            audioPlayer.src = `music/${filename}`;
            audioPlayer.type = 'audio/flac';
            audioPlayer.load(); // Ensure the audio is loaded
            audioPlayer.play(); // Start playing the audio
            fadeIn(4);
        }, 4000); // Wait for fade-out to complete

        // Schedule the next update at the start of the next hour
        const nextHour = new Date();
        nextHour.setHours(now.getHours() + 1, 0, 0, 0); // Set to the next hour
        const timeUntilNextHour = nextHour - now;
        setTimeout(updateMusicSource, timeUntilNextHour);
    }

    function updateTimeDisplay() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Initialize audio context on user interaction
    document.addEventListener('click', () => {
        if (!audioContext) {
            initializeAudioContext();
        }
        audioPlayer.play();
    }, { once: true });

    // Handle visibility change to allow audio playback when screen is locked
    document.addEventListener('visibilitychange', () => {
        if (audioContext && audioContext.state !== 'running') {
            audioContext.resume().catch(err => console.error('Failed to resume AudioContext:', err));
        }
    });

    // Update the music source initially
    updateMusicSource();

    // Update the time display every second
    setInterval(updateTimeDisplay, 1000); // 1000 ms = 1 second

    // Initial time display update
    updateTimeDisplay();
});
