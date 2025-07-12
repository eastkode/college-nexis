document.addEventListener('DOMContentLoaded', async () => {
    const settingsForm = document.getElementById('site-settings-form');
    const statusMessageElement = document.getElementById('settings-status');

    // Define settings keys as they appear in the form and map to backend keys
    const settingFields = [
        // General
        { id: 'setting-siteName', key: 'siteName', type: 'text' },
        { id: 'setting-siteBaseUrl', key: 'siteBaseUrl', type: 'url' },
        { id: 'setting-faviconUrl', key: 'faviconUrl', type: 'url' },
        // SEO & Analytics
        { id: 'setting-globalTitle', key: 'globalTitle', type: 'text' },
        { id: 'setting-globalDescription', key: 'globalDescription', type: 'textarea' },
        { id: 'setting-googleAnalyticsId', key: 'googleAnalyticsId', type: 'text' },
        { id: 'setting-webmasterMeta', key: 'webmasterMeta', type: 'text' },
        // Footer
        { id: 'setting-footerText', key: 'footerText', type: 'textarea' },
        // SMTP
        { id: 'setting-smtpHost', key: 'smtpHost', type: 'text' },
        { id: 'setting-smtpPort', key: 'smtpPort', type: 'number' },
        { id: 'setting-smtpUser', key: 'smtpUser', type: 'text' },
        { id: 'setting-smtpPass', key: 'smtpPass', type: 'password' }, // Input type is password, data type is string
        { id: 'setting-smtpFrom', key: 'smtpFrom', type: 'email' },
        // Advertising
        { id: 'setting-adsenseId', key: 'adsenseId', type: 'text' }
    ];

    async function loadSettings() {
        if(statusMessageElement) {
            statusMessageElement.textContent = 'Loading settings...';
            statusMessageElement.className = 'status-message'; // Reset classes
        }
        try {
            // This endpoint should return an object where keys are setting keys and values are their stored values
            const result = await adminApiRequest('/settings');
            if (result.success && result.data) {
                settingFields.forEach(fieldInfo => {
                    const inputElement = document.getElementById(fieldInfo.id);
                    if (inputElement && result.data[fieldInfo.key] !== undefined) {
                        inputElement.value = result.data[fieldInfo.key];
                    } else if (inputElement) {
                        inputElement.value = ''; // Clear if not set in backend or element doesn't exist
                    }
                });
                if(statusMessageElement) {
                    statusMessageElement.textContent = 'Settings loaded.';
                    statusMessageElement.classList.add('success-message');
                }
            } else {
                console.error('Failed to load settings:', result.message);
                if(statusMessageElement) {
                    statusMessageElement.textContent = `Error loading settings: ${result.message || 'Unknown error'}`;
                    statusMessageElement.classList.add('error-message');
                }
            }
        } catch (error) {
            console.error('Error in loadSettings:', error);
            if(statusMessageElement) {
                statusMessageElement.textContent = `Error loading settings: ${error.message || 'Network error'}`;
                statusMessageElement.classList.add('error-message');
            }
        } finally {
            if(statusMessageElement) {
                setTimeout(() => {
                    if (statusMessageElement.textContent === 'Settings loaded.' || statusMessageElement.textContent === 'Loading settings...') {
                       statusMessageElement.textContent = ''; // Clear only if it was a loading/success message
                    }
                }, 3000);
            }
        }
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if(statusMessageElement) {
                statusMessageElement.textContent = 'Saving settings...';
                statusMessageElement.className = 'status-message'; // Reset classes
            }

            const settingsToSave = [];
            settingFields.forEach(fieldInfo => {
                const inputElement = document.getElementById(fieldInfo.id);
                if (inputElement) {
                    // For password fields, only include if a value is entered (to avoid overwriting with empty if not changed)
                    // However, for settings, we typically want to save the value as is, even if empty, to allow clearing.
                    // The backend Setting model uses Mixed type, so it can store empty strings.
                    settingsToSave.push({
                        key: fieldInfo.key,
                        value: inputElement.value // Send trimmed value if appropriate, but for passwords, exact value is needed.
                                                 // For most settings, trim() is fine.
                                                 // For smtpPass, if empty, it means "clear password" or "no password".
                                                 // Let's trim non-password fields.
                                                 // fieldInfo.type === 'password' ? inputElement.value : inputElement.value.trim()
                    });
                }
            });

            let allSuccessful = true;
            let firstErrorMessage = '';

            for (const setting of settingsToSave) {
                try {
                    const payload = { key: setting.key, value: setting.value };
                    // The backend controller for settings uses POST for upsert by key in body
                    const result = await adminApiRequest('/settings', 'POST', payload);
                    if (!result.success) {
                        allSuccessful = false;
                        if (!firstErrorMessage) firstErrorMessage = `Error for ${setting.key}: ${result.message}`;
                        console.warn(`Failed to save setting ${setting.key}:`, result.message);
                    }
                } catch (error) {
                    allSuccessful = false;
                    if (!firstErrorMessage) firstErrorMessage = `Network error for ${setting.key}: ${error.message}`;
                    console.error(`Error saving setting ${setting.key}:`, error);
                }
            }

            if(statusMessageElement) {
                if (allSuccessful) {
                    statusMessageElement.textContent = 'All settings saved successfully!';
                    statusMessageElement.classList.add('success-message');
                } else {
                    statusMessageElement.textContent = `Some settings failed to save. ${firstErrorMessage || 'Please check console.'}`;
                    statusMessageElement.classList.add('error-message');
                }
                setTimeout(() => statusMessageElement.textContent = '', 5000);
            }
        });
    }

    // Initial load
    loadSettings();
});
