document.addEventListener('DOMContentLoaded', () => {
    // Auth check is handled by auth.js
    const usersTableBody = document.getElementById('users-table-body');
    const userFormSection = document.getElementById('user-form-section');
    const usersListSection = document.getElementById('users-list-section');
    const addNewUserBtn = document.getElementById('add-new-user-btn');
    const cancelUserEditBtn = document.getElementById('cancel-user-edit-btn');
    const userForm = document.getElementById('user-form');
    const userFormTitle = document.getElementById('user-form-title');
    const userIdInput = document.getElementById('user-id');
    const passwordGroup = document.getElementById('password-group');
    const passwordInput = document.getElementById('user-password');
    const userFormError = document.getElementById('user-form-error');

    // Get the current logged-in user to prevent them from deleting themselves
    const currentAdmin = getCurrentAdminUser();

    function showUserForm(user = null) {
        userForm.reset();
        userFormError.style.display = 'none';
        userFormError.textContent = '';

        if (user) { // Editing existing user
            userFormTitle.textContent = 'Edit User';
            userIdInput.value = user._id;
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;

            passwordInput.removeAttribute('required');
            passwordGroup.querySelector('small').style.display = 'block';
        } else { // Adding new user
            userFormTitle.textContent = 'Add New User';
            userIdInput.value = '';
            passwordInput.setAttribute('required', 'required');
            passwordGroup.querySelector('small').style.display = 'none';
        }

        userFormSection.style.display = 'block';
        usersListSection.style.display = 'none';
    }

    function hideUserForm() {
        userFormSection.style.display = 'none';
        usersListSection.style.display = 'block';
        loadUsers(); // Refresh list after form is hidden
    }

    async function loadUsers() {
        if (!usersTableBody) return;
        usersTableBody.innerHTML = '<tr><td colspan="4">Loading users...</td></tr>';

        try {
            const result = await adminApiRequest('/users');
            if (result.success && result.data) {
                usersTableBody.innerHTML = ''; // Clear loading/previous
                if (result.data.length === 0) {
                    usersTableBody.innerHTML = '<tr><td colspan="4">No users found.</td></tr>';
                }
                result.data.forEach(user => {
                    const row = usersTableBody.insertRow();

                    // Prevent current admin from deleting themselves
                    const deleteButtonHtml = (currentAdmin && currentAdmin.id === user._id)
                        ? `<button class="btn btn-sm btn-danger" disabled title="Cannot delete yourself">Delete</button>`
                        : `<button class="btn btn-sm btn-danger delete-user-btn" data-id="${user._id}">Delete</button>`;

                    row.innerHTML = `
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-user-btn" data-id="${user._id}">Edit</button>
                            ${deleteButtonHtml}
                        </td>
                    `;
                });
            } else {
                usersTableBody.innerHTML = `<tr><td colspan="4">Error loading users: ${result.message || 'Unknown error'}</td></tr>`;
            }
        } catch (error) {
            console.error('Failed to load users:', error);
            usersTableBody.innerHTML = `<tr><td colspan="4">Error loading users: ${error.message || 'Network error'}</td></tr>`;
        }
    }

    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        userFormError.style.display = 'none';
        const formData = new FormData(userForm);
        const userData = Object.fromEntries(formData.entries());

        const id = userIdInput.value;

        // Don't send password field if it's empty (when editing)
        if (id && !userData.password) {
            delete userData.password;
        }

        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `/users/${id}` : '/users';

        try {
            const result = await adminApiRequest(endpoint, method, userData);
            if (result.success) {
                alert(`User ${id ? 'updated' : 'created'} successfully!`);
                hideUserForm();
            } else {
                userFormError.textContent = `Error: ${result.message || 'Failed to save user.'}`;
                userFormError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error saving user:', error);
            userFormError.textContent = `Error: ${error.message || 'An unexpected error occurred.'}`;
            userFormError.style.display = 'block';
        }
    });

    usersTableBody.addEventListener('click', async (e) => {
        const target = e.target;
        if (target.classList.contains('edit-user-btn')) {
            const id = target.dataset.id;
            try {
                const result = await adminApiRequest(`/users/${id}`);
                if (result.success && result.data) {
                    showUserForm(result.data);
                } else {
                    alert(`Error: ${result.message || 'Could not fetch user details.'}`);
                }
            } catch (error) {
                console.error('Error fetching user for edit:', error);
                alert(`Error: ${error.message || 'Could not fetch user details.'}`);
            }
        } else if (target.classList.contains('delete-user-btn')) {
            const id = target.dataset.id;
            const username = target.closest('tr').cells[0].textContent;
            if (confirm(`Are you sure you want to delete the user "${username}"?`)) {
                try {
                    const result = await adminApiRequest(`/users/${id}`, 'DELETE');
                    if (result.success) {
                        alert('User deleted successfully!');
                        loadUsers(); // Refresh list
                    } else {
                        alert(`Error: ${result.message || 'Failed to delete user.'}`);
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert(`Error: ${error.message || 'An unexpected error occurred.'}`);
                }
            }
        }
    });

    if (addNewUserBtn) addNewUserBtn.addEventListener('click', () => showUserForm(null));
    if (cancelUserEditBtn) cancelUserEditBtn.addEventListener('click', hideUserForm);

    // Initial load
    loadUsers();
});
