async function fetchUsers() {
    const usersContainer = document.getElementById('users-container');

    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        usersContainer.innerHTML = '';

        if (data.users.length === 0) {
            usersContainer.innerHTML = '<p>No registered users yet.</p>';
            return;
        }

        const selectedUsers = new Set(); // To store selected user IDs

        data.users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.setAttribute('data-id', user._id); // Store user ID in a custom attribute

            userCard.innerHTML = `
                <img src="/images/default-profile.png" alt="${user.name}'s profile picture">
                <span>${user.name}</span>
            `;

            // Add click event to toggle selection
            userCard.addEventListener('click', () => {
                const userId = user._id;
                if (selectedUsers.has(userId)) {
                    selectedUsers.delete(userId);
                    userCard.classList.remove('selected'); // Deselect
                } else {
                    selectedUsers.add(userId);
                    userCard.classList.add('selected'); // Select
                }

                // Notify tweets.js of the selection change
                const event = new CustomEvent('userSelectionChange', { detail: Array.from(selectedUsers) });
                document.dispatchEvent(event);
            });

            usersContainer.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        usersContainer.innerHTML = '<p>Failed to load users. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); 
});
