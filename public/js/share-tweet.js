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

    shareTweetForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = document.getElementById('tweet-content').value;

        try {
            const response = await fetch('/api/tweets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                alert('Tweet shared successfully!');
                document.getElementById('tweet-content').value = ''; // Clear the textarea
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
