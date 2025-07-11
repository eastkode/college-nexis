// This script handles login, logout, and session/token management for the admin panel.
// It also protects routes by checking authentication status.

const API_ADMIN_BASE_URL = '/api'; // Assuming admin API routes are under /api like public ones
                                   // Or could be specific e.g. /api/admin

function getAuthToken() {
    return localStorage.getItem('adminAuthToken');
}

function setAuthToken(token) {
    localStorage.setItem('adminAuthToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminUser'); // Also clear user info
}

function setCurrentAdminUser(user) {
    localStorage.setItem('adminUser', JSON.stringify(user));
}

function getCurrentAdminUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
}


async function adminApiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            // If auth is required and no token, redirect to login (except for login page itself)
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('admin/')) {
                console.warn('No auth token found for protected route. Redirecting to login.');
                window.location.href = 'index.html'; // Adjust path if admin is in subfolder
            }
            // For login page, don't throw error yet, let login attempt proceed
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('admin/')) {
                 return Promise.reject({ success: false, message: 'Not authenticated' });
            }
        }
    }

    const config = {
        method: method,
        headers: headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_ADMIN_BASE_URL}${endpoint}`, config);
        if (response.status === 401 && requiresAuth) { // Unauthorized
            console.warn('Received 401 Unauthorized. Logging out and redirecting.');
            handleLogout(); // This will redirect to login
            return Promise.reject({ success: false, message: 'Session expired or invalid. Please login again.' });
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
            console.error('Admin API Error:', errorData);
            return Promise.reject(errorData);
        }
        // For 204 No Content (e.g., some DELETE requests), response.json() will fail.
        if (response.status === 204) {
            return Promise.resolve({ success: true, data: {} });
        }
        return await response.json();
    } catch (error) {
        console.error('Network or other error in adminApiRequest:', error);
        return Promise.reject({ success: false, message: error.message || 'Network error occurred' });
    }
}


function handleLogout() {
    removeAuthToken();
    // Optionally, call a backend logout endpoint if it exists (e.g., to blacklist token)
    // adminApiRequest('/auth/logout', 'GET').catch(err => console.warn("Logout API call failed, proceeding with client-side logout.", err));
    window.location.href = 'index.html'; // Adjust path if needed
}

// Attach logout to button if present
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Check authentication on all admin pages except login
    if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('admin/')) {
        if (!getAuthToken()) {
            console.log('Not authenticated, redirecting to login.');
            window.location.href = 'index.html'; // Adjust if admin is in subfolder
        } else {
            // Optionally, verify token validity with a /me endpoint
            adminApiRequest('/auth/me', 'GET')
                .then(response => {
                    if (response.success && response.data) {
                        setCurrentAdminUser(response.data); // Store/update user info
                        // Check role if necessary
                        if (response.data.role !== 'admin') {
                            alert('You do not have sufficient permissions to access the admin panel.');
                            handleLogout();
                        }
                        // Update username in header if element exists
                        const adminUsernameElement = document.getElementById('admin-username');
                        if (adminUsernameElement && response.data.username) {
                            adminUsernameElement.textContent = response.data.username;
                        }
                    } else {
                        // Token might be invalid or expired server-side
                        console.warn("Token validation failed (/auth/me). Logging out.");
                        handleLogout();
                    }
                })
                .catch(error => {
                    console.error("Error verifying token with /auth/me:", error);
                    if (error.message !== 'Not authenticated') { // Avoid double redirect if adminApiRequest already handled it
                        handleLogout();
                    }
                });
        }
    }


    // Login form specific logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // If already logged in and on login page, redirect to dashboard
        if (getAuthToken()) {
            window.location.href = 'dashboard.html'; // Adjust if needed
        }

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginErrorElement = document.getElementById('login-error');
            loginErrorElement.textContent = '';

            try {
                const response = await adminApiRequest('/auth/login', 'POST', { email, password }, false); // Login doesn't require prior auth

                if (response.success && response.token && response.user) {
                    if (response.user.role !== 'admin') {
                        loginErrorElement.textContent = 'Access Denied. Admin role required.';
                        return;
                    }
                    setAuthToken(response.token);
                    setCurrentAdminUser(response.user);
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    loginErrorElement.textContent = response.message || 'Login failed. Please check your credentials.';
                }
            } catch (error) {
                console.error('Login error:', error);
                loginErrorElement.textContent = error.message || 'An unexpected error occurred during login.';
            }
        });
    }
});

// Make adminApiRequest globally available for other admin JS files
window.adminApiRequest = adminApiRequest;
window.getAuthToken = getAuthToken; // May be useful for other scripts
window.handleLogout = handleLogout; // Forcing logout from other scripts if needed
window.getCurrentAdminUser = getCurrentAdminUser;
window.API_ADMIN_BASE_URL = API_ADMIN_BASE_URL;
