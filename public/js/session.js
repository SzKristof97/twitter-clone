// Function to check session status and update header actions
async function updateHeaderActions() {
    const headerActions = document.getElementById('header-actions');

    try {
        // Fetch session data
        const response = await fetch('/api/session');
        if (response.ok) {
            const { user } = await response.json();

            // User is logged in
            headerActions.innerHTML = `
                <div class="user-profile">
                    <img src="/images/default-profile.png" alt="Profile Picture">
                    <span>${user.name}</span>
                    <button class="button logout-button" id="logout-button">Logout</button>
                </div>
            `;

            // Add logout functionality
            document.getElementById('logout-button').addEventListener('click', async () => {
                const logoutResponse = await fetch('/api/auth/logout', { method: 'POST' });
                if (logoutResponse.ok) {
                    window.location.reload(); // Refresh the page after logout
                } else {
                    alert('Failed to log out. Please try again.');
                }
            });
        } else {
            // User is not logged in
            headerActions.innerHTML = `
                <a href="/login" class="button">Login</a>
                <a href="/register" class="button">Register</a>
            `;
        }
    } catch (error) {
        console.error('Error checking session:', error);
        headerActions.innerHTML = `
            <a href="/login" class="button">Login</a>
            <a href="/register" class="button">Register</a>
        `;
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateHeaderActions);
