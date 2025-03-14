document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const currentTimeDisplay = document.getElementById('current-time');

    let audioPlaying = true,
    backgroundAudio, browser;

    // Unhide the audio player
    audioPlayer.style.display = 'block';

    // Mute the audio player
    audioPlayer.muted = true;

    // Enable looping
    audioPlayer.loop = true;

    function updateMusicSource() {
        const now = new Date();
        let hour = now.getHours();
        const period = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12; // Convert to 12-hour format
        const filename = `${hour}${period}.flac`;
        audioPlayer.src = `music/${filename}`;
        audioPlayer.type = 'audio/flac';
        audioPlayer.load(); // Ensure the audio is loaded
        audioPlayer.play(); // Start playing the audio
        audioPlayer.muted = false; // Unmute the audio

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

    // Update the music source initially
    updateMusicSource();

    // Update the music source every hour
    setInterval(updateMusicSource, 3600000); // 3600000 ms = 1 hour
    
    // Update the time display every second
    setInterval(updateTimeDisplay, 1000); // 1000 ms = 1 second

    // Initial time display update
    updateTimeDisplay();

    // Add a click event listener to enable autoplay in Chromium
    document.addEventListener('click', () => {
        audioPlayer.play();
    }, { once: true });
});
