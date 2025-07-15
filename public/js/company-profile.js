document.addEventListener('DOMContentLoaded', async () => {
    const companyNameElement = document.getElementById('company-name');
    const profileContainer = document.getElementById('company-profile-data');

    if (!companyNameElement || !profileContainer) return;

    // Get company name from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const companyName = urlParams.get('name');

    if (!companyName) {
        companyNameElement.textContent = 'Company Not Found';
        profileContainer.innerHTML = '<p>No company was specified in the URL.</p>';
        return;
    }

    // Set a loading state
    companyNameElement.textContent = `Loading profile for ${companyName}...`;
    document.title = `Loading ${companyName} Profile - College Nexis`;

    try {
        // Use the generic fetchData function from main.js
        const result = await fetchData(`/wikipedia/summary/${encodeURIComponent(companyName)}`);

        if (result && result.success) {
            const profile = result.data;

            // Update page title and header
            document.title = `${profile.displaytitle} - Company Profile - College Nexis`;
            companyNameElement.textContent = profile.displaytitle;

            // Build profile HTML
            let profileHTML = '';
            if (profile.thumbnail) {
                profileHTML += `<img src="${profile.thumbnail}" alt="${profile.title} thumbnail" class="profile-thumbnail">`;
            }
            profileHTML += `<div class="profile-summary">${profile.extract}</div>`;
            profileHTML += `<p><a href="${profile.pageUrl}" target="_blank" rel="noopener noreferrer">Read more on Wikipedia &rarr;</a></p>`;

            profileContainer.innerHTML = profileHTML;
        } else {
            const errorMessage = result ? result.message : 'Could not fetch company profile.';
            console.error('Error fetching profile:', errorMessage);
            companyNameElement.textContent = `Profile for ${companyName} not found`;
            profileContainer.innerHTML = `<p>${errorMessage}</p>`;
            document.title = `Profile Not Found - College Nexis`;
        }
    } catch (error) {
        console.error('Fatal error fetching profile:', error);
        companyNameElement.textContent = `Error`;
        profileContainer.innerHTML = `<p>A network error occurred while trying to load the company profile.</p>`;
        document.title = `Error - College Nexis`;
    }
});
