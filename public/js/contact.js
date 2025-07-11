document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.innerHTML = '<p>Sending...</p>';
            formStatus.className = ''; // Clear previous status classes

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.innerHTML = '<p>Please fill in all fields.</p>';
                formStatus.className = 'error';
                return;
            }

            // Basic email validation
            if (!validateEmail(email)) {
                formStatus.innerHTML = '<p>Please enter a valid email address.</p>';
                formStatus.className = 'error';
                return;
            }

            // Placeholder for form submission logic
            // In a real app, this would be an API call:
            // const response = await fetch(`${API_BASE_URL}/contact/submit`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ name, email, message })
            // });
            // const result = await response.json();

            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
            const simulateSuccess = true; // Change to false to test error

            if (simulateSuccess) { // Replace with: if (result && result.success)
                formStatus.innerHTML = '<p>Thank you! Your message has been sent successfully.</p>';
                formStatus.className = 'success';
                contactForm.reset(); // Clear the form
            } else {
                formStatus.innerHTML = '<p>Sorry, there was an error sending your message. Please try again later.</p>';
                // formStatus.innerHTML = `<p>${result.message || 'An error occurred.'}</p>`; // Use API error message
                formStatus.className = 'error';
            }
        });
    }

    // Call global meta setter (main.js ensures title/desc tags exist if not already there)
    if (typeof setGlobalMeta === 'function') {
        // setGlobalMeta(); // This will be called by main.js
    }
     // For contact page, we can set a specific title/description if not using global ones
    document.title = "Contact Us - College Nexis";
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag) {
        metaDescriptionTag = document.createElement('meta');
        metaDescriptionTag.name = "description";
        document.head.appendChild(metaDescriptionTag);
    }
    metaDescriptionTag.content = "Get in touch with College Nexis. Send us your questions, feedback, or inquiries through our contact form.";


});

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
