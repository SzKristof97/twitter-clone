async function fetchTweets(selectedUserIds = []) {
    const tweetsContainer = document.getElementById('tweets-container');

    try {
        // Fetch session data to check if the user is logged in and get user details
        const sessionResponse = await fetch('/api/session');
        let loggedInUser = null;
        if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            loggedInUser = sessionData.user; // Get the logged-in user details
        }

        // Fetch tweets from the API
        const response = await fetch('/api/tweets');
        if (!response.ok) {
            throw new Error(`Failed to fetch tweets: ${response.status}`);
        }

        const data = await response.json();

        // Clear existing tweets
        tweetsContainer.innerHTML = '';

        // Filter tweets based on selected users
        const filteredTweets = selectedUserIds.length > 0
        ? data.tweets.filter(tweet => selectedUserIds.includes(tweet.userId._id))
        : data.tweets;

        // Check if there are tweets
        if (filteredTweets.length === 0) {
            tweetsContainer.innerHTML = '<p class="loading">No tweets available.</p>';
            return;
        }

        // Render tweets
        filteredTweets.forEach(tweet => {
            const tweetElement = document.createElement('div');
            tweetElement.className = 'tweet';

            // Replace newline characters with <br> tags
            const formattedContent = tweet.content.replace(/\n/g, '<br>');

            // Check if the tweet belongs to the logged-in user
            const isOwnTweet = loggedInUser && tweet.userId._id === loggedInUser.id;

            tweetElement.innerHTML = `
                <div class="tweet-header">
                    <span class="name">${tweet.userId.name}</span>
                    <span class="timestamp">${new Date(tweet.createdAt).toLocaleString()}</span>
                </div>
                <div class="tweet-body">
                    <p class="tweet-content">${formattedContent}</p>
                    <button class="read-more hidden">Read more...</button>
                </div>
                <div class="tweet-footer">
                    <button class="like-button" data-id="${tweet._id}">
                        <span>&#128077;</span> Like <span class="like-count">${tweet.likes || 0}</span>
                    </button>
                    <button class="dislike-button" data-id="${tweet._id}">
                        <span>&#128078;</span> Dislike <span class="dislike-count">${tweet.dislikes || 0}</span>
                    </button>
                    ${
                        isOwnTweet
                            ? `<button class="delete-button" data-id="${tweet._id}">
                                <span>&#128465;</span> Delete
                                </button>`
                            : ''
                    }
                </div>
            `;

            tweetsContainer.appendChild(tweetElement);

            // Handle "Read more..." for tweets with large content
            const tweetContent = tweetElement.querySelector('.tweet-content');
            const readMoreButton = tweetElement.querySelector('.read-more');

            if (tweetContent.scrollHeight > 100) { // Adjust height as needed
                readMoreButton.classList.remove('hidden');
                tweetContent.style.maxHeight = '100px'; // Limit the visible height
                tweetContent.style.overflow = 'hidden';

                readMoreButton.addEventListener('click', () => {
                    const isExpanded = tweetContent.style.maxHeight === 'none';
                    tweetContent.style.maxHeight = isExpanded ? '100px' : 'none';
                    tweetContent.style.overflow = isExpanded ? 'hidden' : 'visible';
                    readMoreButton.textContent = isExpanded ? 'Read more...' : 'Show less';
                });
            }
        });

        // Add event listeners for like, dislike, and delete buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', () => handleLikeDislike(button, 'like', !!loggedInUser));
        });

        document.querySelectorAll('.dislike-button').forEach(button => {
            button.addEventListener('click', () => handleLikeDislike(button, 'dislike', !!loggedInUser));
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => handleDeleteTweet(button));
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
        } else {
            const error = await response.json();
            alert(error.error || `Failed to ${action}`);
        }
    } catch (error) {
        console.error(`Error during ${action}:`, error);
    }
}

// Handle delete actions
async function handleDeleteTweet(button) {
    const tweetId = button.getAttribute('data-id');

    try {
        const response = await fetch(`/api/tweets/${tweetId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Tweet deleted successfully.');
            await fetchTweets(); // Refresh the tweets after deletion
        } else {
            const errorData = await response.json();
            alert(errorData.error || 'Failed to delete tweet. Please try again.');
        }
    } catch (error) {
        console.error('Error deleting tweet:', error);
        alert('An error occurred. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchTweets();

    // Listen for user selection changes
    document.addEventListener('userSelectionChange', event => {
        fetchTweets(event.detail);
    });
});
