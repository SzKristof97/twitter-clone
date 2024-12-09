async function fetchTweets() {
    const tweetsContainer = document.getElementById('tweets-container');

    try {
        // Check if the user is logged in by fetching session data
        const sessionResponse = await fetch('/api/session');
        const isLoggedIn = sessionResponse.ok;

        // Fetch tweets from the API
        const response = await fetch('/api/tweets');
        if (!response.ok) {
            throw new Error(`Failed to fetch tweets: ${response.status}`);
        }

        const data = await response.json();

        // Clear existing tweets
        tweetsContainer.innerHTML = '';

        // Check if there are tweets
        if (data.tweets.length === 0) {
            tweetsContainer.innerHTML = '<p>No tweets available.</p>';
            return;
        }

        // Render tweets
        data.tweets.forEach(tweet => {
            const tweetElement = document.createElement('div');
            tweetElement.className = 'tweet';

            tweetElement.innerHTML = `
                <div class="tweet-header">
                    <span class="name">${tweet.userId.name}</span>
                    <span class="timestamp">${new Date(tweet.createdAt).toLocaleString()}</span>
                </div>
                <div class="tweet-body">
                    <p>${tweet.content}</p>
                </div>
                <div class="tweet-footer">
                    <button class="like-button" data-id="${tweet._id}">
                        <span>&#128077;</span> Like <span class="like-count">${tweet.likes || 0}</span>
                    </button>
                    <button class="dislike-button" data-id="${tweet._id}">
                        <span>&#128078;</span> Dislike <span class="dislike-count">${tweet.dislikes || 0}</span>
                    </button>
                </div>
            `;

            tweetsContainer.appendChild(tweetElement);
        });

        // Add event listeners for like and dislike buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', () => handleLikeDislike(button, 'like', isLoggedIn));
        });

        document.querySelectorAll('.dislike-button').forEach(button => {
            button.addEventListener('click', () => handleLikeDislike(button, 'dislike', isLoggedIn));
        });
    } catch (error) {
        console.error('Error fetching tweets:', error);
        tweetsContainer.innerHTML = '<p>Failed to load tweets. Please try again later.</p>';
    }
}

// Handle like and dislike actions
async function handleLikeDislike(button, action, isLoggedIn) {
    const tweetId = button.getAttribute('data-id');

    if (!isLoggedIn) {
        alert('Please log in to interact with tweets.');
        return;
    }

    try {
        const response = await fetch(`/api/tweets/${tweetId}/${action}`, {
            method: 'POST',
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`${action} successful:`, result);

            // Update the counters
            const likeCount = button.closest('.tweet-footer').querySelector('.like-count');
            const dislikeCount = button.closest('.tweet-footer').querySelector('.dislike-count');

            if (action === 'like') {
                likeCount.textContent = result.likes;
                dislikeCount.textContent = result.dislikes; // Update in case of previous interaction
            } else {
                dislikeCount.textContent = result.dislikes;
                likeCount.textContent = result.likes; // Update in case of previous interaction
            }

            // Optionally disable buttons after action
            // button.classList.add('clicked');
            // button.disabled = true;
        } else {
            const error = await response.json();
            alert(error.error || `Failed to ${action}`);
        }
    } catch (error) {
        console.error(`Error during ${action}:`, error);
    }
}

document.addEventListener('DOMContentLoaded', fetchTweets);
