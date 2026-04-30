document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const PUBLISH_NEWS_URL = 'https://bsm.vmgburundi.com/api/posts/';
    
    // Elements
    const newsForm = document.getElementById('news-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusBanner = document.getElementById('status-banner');

    const showStatus = (message, isError = false) => {
        statusBanner.textContent = message;
        statusBanner.className = `status-banner ${isError ? 'status-error' : 'status-success'}`;
        statusBanner.style.display = 'block';
        
        // Auto-hide after 5 seconds if success
        if (!isError) {
            setTimeout(() => {
                statusBanner.style.display = 'none';
            }, 5000);
        }
    };
    
    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = "Publishing...";
        statusBanner.style.display = 'none';

        const formData = new FormData(newsForm);
        const postData = {
            title: formData.get('title'),
            excerpt: formData.get('excerpt'),
            content: formData.get('content'),
            thumbnail: formData.get('thumbnail'),
            image: formData.get('image'),
            source: formData.get('source'),
            type: formData.get('type'),
            created_at: new Date().toISOString()
        };

        try {
            const response = await fetch(PUBLISH_NEWS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to publish news: ${response.status} ${errorText}`);
            }

            showStatus("Success! Your news post has been published.");
            newsForm.reset();
            
        } catch (error) {
            console.error('Error publishing news:', error);
            showStatus(`Failed to publish news: ${error.message}`, true);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Publish Post Now";
        }
    });
});
