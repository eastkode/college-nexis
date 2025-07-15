document.addEventListener('DOMContentLoaded', async () => {
    const companiesGrid = document.getElementById('companies-grid-container');
    if (!companiesGrid) return;

    try {
        const response = await fetch('/data/companies.json');
        if (!response.ok) {
            throw new Error('Failed to load company data.');
        }
        const companies = await response.json();

        if (companies && companies.length > 0) {
            companiesGrid.innerHTML = ''; // Clear loading spinner
            companies.forEach(company => {
                const card = document.createElement('a');
                card.className = 'company-card';
                // Pass company name as a query parameter to the profile page
                card.href = `company-profile.html?name=${encodeURIComponent(company.name)}`;

                // Use the logo service for the card image
                const logoUrl = `https://logo.clearbit.com/${company.domain}`;

                card.innerHTML = `
                    <img src="${logoUrl}" alt="${company.name} Logo" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/150x80?text=${company.name.split(' ')[0]}';">
                    <h3>${company.name}</h3>
                `;
                companiesGrid.appendChild(card);
            });
        } else {
            companiesGrid.innerHTML = '<p>No companies to display.</p>';
        }
    } catch (error) {
        console.error('Error loading companies:', error);
        companiesGrid.innerHTML = '<p>Could not load company list. Please try again later.</p>';
    }
});
