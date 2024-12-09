async function checkSessionForTweetSection() {
    const shareTweetSection = document.getElementById('share-tweet-section');

    try {
        const response = await fetch('/api/session');
        if (response.ok) {
            // User is logged in, show the "Share Your Tweet" section
            shareTweetSection.classList.remove('hidden');
        } else {
            // User is not logged in, hide the section
            shareTweetSection.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error checking session for tweet section:', error);
        shareTweetSection.classList.add('hidden');
    }
}

// Handle tweet form submission
async function handleShareTweetForm() {
    const shareTweetForm = document.getElementById('share-tweet-form');
    const tweetContent = document.getElementById('tweet-content');
    const charCounter = document.getElementById('char-counter');

    // Check if tweetContent and charCounter exist
    if (!tweetContent || !charCounter) {
        console.error('Tweet content or character counter element not found.');
        return;
    }

    // Update character counter dynamically
    tweetContent.addEventListener('input', () => {
        const charCount = tweetContent.value.length;
        charCounter.textContent = `${charCount}/1000`;

        // Change the color of the counter if nearing the limit
        if (charCount > 900) {
            charCounter.style.color = '#e74c3c'; // Red when close to limit
        } else {
            charCounter.style.color = '#aaaaaa'; // Default gray
        }
    });

    shareTweetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = tweetContent.value;

        if (content.length > 1000) {
            alert('Tweet exceeds the maximum character limit of 1000.');
            return;
        }

        try {
            const response = await fetch('/api/tweets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                alert('Tweet shared successfully!');
                tweetContent.value = ''; // Clear the textarea
                charCounter.textContent = '0/1000'; // Reset character counter
                await fetchTweets(); // Refresh the tweets section
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to share tweet. Please try again.');
            }
        } catch (error) {
            console.error('Error sharing tweet:', error);
            alert('An error occurred. Please try again later.');
        }
    });
}

// Initialize the functionality
document.addEventListener('DOMContentLoaded', () => {
    checkSessionForTweetSection();
    handleShareTweetForm();
});
