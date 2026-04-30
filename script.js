document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const DOWNLOAD_URL = 'Programmation WEB 1.pdf'; // Local PDF file for testing
    const COUNTDOWN_TIME = 5;
    
    // Elements
    const countdownEl = document.getElementById('countdown');
    const downloadBtn = document.getElementById('download-btn');
    const relaunchBtn = document.getElementById('relaunch-btn');
    const directLink = document.getElementById('direct-link');
    const statusTitle = document.getElementById('status-title');
    const statusMessage = document.getElementById('status-message');

    let timeLeft = COUNTDOWN_TIME;
    let timerId = null;

    // Set initial URLs
    downloadBtn.href = DOWNLOAD_URL;
    directLink.href = DOWNLOAD_URL;

    // Start countdown
    const startCountdown = () => {
        timeLeft = COUNTDOWN_TIME;
        countdownEl.textContent = timeLeft;
        statusTitle.textContent = "Starting your download...";
        statusMessage.style.display = "block";
        
        clearInterval(timerId);
        timerId = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerId);
                triggerDownload();
            }
        }, 1000);
    };

    const triggerDownload = async () => {
        statusTitle.textContent = "Your download has started!";
        statusMessage.style.display = "none";
        
        try {
            // Attempt to fetch as blob to force download
            const response = await fetch(DOWNLOAD_URL);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = DOWNLOAD_URL.split('/').pop(); // Use filename from URL
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback to direct link if fetch fails (e.g. CORS)
            const link = document.createElement('a');
            link.href = DOWNLOAD_URL;
            link.download = '';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Event Listeners
    relaunchBtn.addEventListener('click', () => {
        startCountdown();
    });

    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent immediate navigation
        startCountdown();
    });

    directLink.addEventListener('click', (e) => {
        e.preventDefault();
        clearInterval(timerId);
        triggerDownload();
    });

    // Initialize - Wait for user interaction
    statusTitle.textContent = "Ready to download Vovota Live";
    statusMessage.style.display = "none";
});
