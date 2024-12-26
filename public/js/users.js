async function fetchUsers() {
    const usersContainer = document.getElementById('users-container');

    try {
        // Fetch users from the API
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();

        // Clear loading text
        usersContainer.innerHTML = '';

        // Check if there are users
        if (data.users.length === 0) {
            usersContainer.innerHTML = '<p>No registered users yet.</p>';
            return;
        }

        // Render user cards
        data.users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';

            userCard.innerHTML = `
                <img src="/images/default-profile.png" alt="${user.name}'s profile picture">
                <span>${user.name}</span>
            `;

            usersContainer.appendChild(userCard);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        usersContainer.innerHTML = '<p>Failed to load users. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchUsers);
