/* === Script extracted from original index.html === */
document.getElementById('simulatorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Update step indicator
    document.querySelectorAll('.step')[1].classList.add('active');

    // Show loading
    document.querySelector('.form-section').style.display = 'none';
    document.getElementById('loading').style.display = 'block';

    // Collect form data
    const formData = new FormData(this);
    const data = {
        fullName: formData.get('fullName'),
        practiceName: formData.get('practiceName'),
        city: formData.get('city'),
        state: formData.get('state'),
        location: `${formData.get('city')}, ${formData.get('state')}`,
        email: formData.get('email'),
        yearsInPractice: formData.get('yearsInPractice'),
        services: formData.getAll('services'),
        presence: formData.getAll('presence')
    };

    // Single AI call to generate three responses
    fetch('/api/ai-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(responses => {
        document.getElementById('chatgpt-response').innerText    = responses.chatgpt;
        document.getElementById('google-response').innerText     = responses.google;
        document.getElementById('perplexity-response').innerText = responses.perplexity;
        document.getElementById('warning-text').innerText        = responses.warning;

        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

        // Final webhook to HighLevel
        fetch('https://services.leadconnectorhq.com/hooks/sHKEF1jEdkwxdn5ZnqJc/webhook-trigger/f7557553-82bc-43ed-a74d-dfe73d3f4f9a', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, ...responses })
        }).catch(err => console.error('Webhook error:', err));
    })
    .catch(err => console.error('AI simulation failed:', err));
});

/* End of extracted JS */