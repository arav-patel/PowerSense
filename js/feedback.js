/**
 * PowerSense Feedback Widget
 *
 * This script dynamically creates a floating feedback widget and handles the logic
 * for rating selection, form submission, and feedback submission to Formspree.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the widget container and inject HTML
    const widget = document.createElement('div');
    widget.className = 'feedback-widget';
    widget.innerHTML = `
        <button class="feedback-btn" id="feedback-toggle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 1px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Feedback</span>
        </button>
        <div class="feedback-panel" id="feedback-panel">
            <button class="feedback-close" id="feedback-close" aria-label="Close feedback panel">&times;</button>
            <div id="feedback-form-container">
                <h3>How are we doing?</h3>
                <div class="feedback-ratings">
                    <button class="rating-btn up" data-rating="thumbs_up" title="Good">👍</button>
                    <button class="rating-btn down" data-rating="thumbs_down" title="Poor">👎</button>
                </div>
                <div class="feedback-details" id="feedback-details">
                    <label class="feedback-label" for="feedback-message">Tell us more (optional)</label>
                    <textarea class="feedback-textarea" id="feedback-message" placeholder="What could we do better?"></textarea>
                    <button class="feedback-submit" id="feedback-submit">Submit Feedback</button>
                </div>
            </div>
            <div class="feedback-thanks" id="feedback-thanks">
                <span class="feedback-thanks-icon">✨</span>
                <p>Thank you for your feedback! It helps us improve PowerSense.</p>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // 2. Select Elements
    const toggle = document.getElementById('feedback-toggle');
    const panel = document.getElementById('feedback-panel');
    const close = document.getElementById('feedback-close');
    const ratings = document.querySelectorAll('.rating-btn');
    const details = document.getElementById('feedback-details');
    const submit = document.getElementById('feedback-submit');
    const formContainer = document.getElementById('feedback-form-container');
    const thanks = document.getElementById('feedback-thanks');
    const messageInput = document.getElementById('feedback-message');

    let selectedRating = null;

    // 3. Logic: Toggle Visibility
    toggle.onclick = () => {
        panel.classList.toggle('active');
        if (panel.classList.contains('active')) {
            // Auto focus the close button or first rating if needed
        }
    };

    close.onclick = () => {
        panel.classList.remove('active');
    };

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!widget.contains(e.target) && panel.classList.contains('active')) {
            panel.classList.remove('active');
        }
    });

    // 4. Logic: Rating Selection
    ratings.forEach(btn => {
        btn.onclick = () => {
            ratings.forEach(r => r.classList.remove('selected'));
            btn.classList.add('selected');
            selectedRating = btn.dataset.rating;
            details.classList.add('active');

            // Focus textarea when a rating is selected
            setTimeout(() => messageInput.focus(), 100);
        };
    });

    // 5. Logic: Form Submission
    submit.onclick = async () => {
        const message = messageInput.value.trim();
        const page = window.location.href;

        // Visual feedback during submission
        submit.disabled = true;
        submit.innerText = 'Sending...';

        try {
            const response = await fetch('https://formspree.io/f/xnjobobo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: selectedRating,
                    message: message,
                    page: page
                })
            });

            if (response.ok) {
                // Success: Show thank you message
                formContainer.style.display = 'none';
                thanks.style.display = 'block';

                // Automatically close the panel after 3 seconds
                setTimeout(() => {
                    panel.classList.remove('active');

                    // Reset the form for potential next interaction
                    setTimeout(() => {
                        formContainer.style.display = 'block';
                        thanks.style.display = 'none';
                        details.classList.remove('active');
                        ratings.forEach(r => r.classList.remove('selected'));
                        messageInput.value = '';
                        submit.disabled = false;
                        submit.innerText = 'Submit Feedback';
                        selectedRating = null;
                    }, 500);
                }, 3000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Feedback submission error:', error);
            alert('Oops! Something went wrong. Please try again or refresh the page.');
            submit.disabled = false;
            submit.innerText = 'Submit Feedback';
        }
    };
});
