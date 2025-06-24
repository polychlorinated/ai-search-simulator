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
    const data = {};

    // Get text inputs
    data.fullName = formData.get('fullName');
    data.practiceName = formData.get('practiceName');
    data.city = formData.get('city');
    data.state = formData.get('state');
    data.location = `${data.city}, ${data.state}`;
    data.email = formData.get('email');
    data.yearsInPractice = formData.get('yearsInPractice');

    // Get checkbox arrays
    data.services = formData.getAll('services');
    data.presence = formData.getAll('presence');


    // Simulate API delay
    setTimeout(() => {
        generateResponses(data);
    }, 3000);
});

function generateResponses(data) {
    // Update step indicator
    document.querySelectorAll('.step')[2].classList.add('active');

    const hasWebsite = data.presence.includes('website');
    const hasGoogle = data.presence.includes('google');
    const hasSocial = data.presence.includes('facebook') || data.presence.includes('instagram');
    const hasMinimalPresence = data.presence.includes('none') || data.presence.length <= 1;

    // Generate responses based on data
    const responses = generateAIResponses(data, hasWebsite, hasGoogle, hasSocial, hasMinimalPresence);

    // Display responses
    document.getElementById('chatgpt-response').innerHTML = responses.chatgpt;
    document.getElementById('google-response').innerHTML = responses.google;
    document.getElementById('perplexity-response').innerHTML = responses.perplexity;
    document.getElementById('warning-text').innerHTML = responses.warning;

    // Show results
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

    // Send survey data + AI responses to HighLevel webhook
    fetch('https://services.leadconnectorhq.com/hooks/sHKEF1jEdkwxdn5ZnqJc/webhook-trigger/f7557553-82bc-43ed-a74d-dfe73d3f4f9a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, responses }),
    }).catch(err => console.error('Webhook error:', err));
}

function generateAIResponses(data, hasWebsite, hasGoogle, hasSocial, hasMinimalPresence) {
    const practiceName = data.practiceName;
    const location = data.location;
    const services = data.services;
    let responses = {};

    if (hasMinimalPresence || (!hasWebsite && !hasGoogle)) {
        // Poor visibility scenario
        responses.chatgpt = `I don't have enough information about ${practiceName} in ${location} to provide a specific recommendation. For acupuncture services in ${location}, I'd suggest researching practitioners who are licensed, have good reviews, and specialize in your specific health concerns. I recommend checking with local medical boards for licensed practitioners in your area.`;
        responses.google = `I found limited information about ${practiceName}. Here are some general acupuncture options in ${location}: [Lists 3-4 competitor practices with reviews and ratings]. For the best results, I recommend calling practices directly to discuss your specific needs and verify their credentials.`;
        responses.perplexity = `I couldn't find substantial information about ${practiceName} in ${location}. Based on available data, here are top-rated acupuncture practices in your area: [Lists competitor practices]. When choosing an acupuncturist, consider factors like licensing, specializations, and patient reviews.`;
        responses.warning = `<strong>CRITICAL ISSUE:</strong> AI tools can't find enough information about your practice to recommend you to potential patients. You're essentially invisible to the 68% of people who now use AI to find healthcare providers. This means you're losing an estimated 5-15 new patients per month to competitors who show up in AI search results.`;
    } else if (hasWebsite && hasGoogle && hasSocial) {
        // Good visibility scenario
        responses.chatgpt = `${practiceName} in ${location} appears to be a well-established practice offering ${services.join(', ')}. They have a professional online presence and seem to be actively serving the community. I'd recommend contacting them directly to discuss your specific needs and verify they're accepting new patients.`;
        responses.google = `${practiceName} is a ${services.join(' and ')} practice located in ${location}. Based on their online presence, they offer comprehensive TCM services. [Would show ratings and reviews if available]. Contact them at [phone number] to schedule a consultation.`;
        responses.perplexity = `${practiceName} in ${location} offers ${services.join(', ')} services. They maintain an active online presence across multiple platforms. For specific treatment recommendations, I'd suggest scheduling a consultation to discuss your health goals and treatment options.`;
        responses.warning = `<strong>GOOD NEWS:</strong> AI tools can find your practice! However, you're likely missing opportunities to stand out from competitors. With small improvements to your online visibility strategy, you could capture significantly more of the growing market of AI-powered patient searches.`;
    } else {
        // Mixed visibility scenario
        responses.chatgpt = `I have some information about ${practiceName} in ${location}, but I'd recommend verifying their current services and availability directly. For ${services.join(' and ')} services in ${location}, it's best to call practices directly to ensure they meet your specific needs.`;
        responses.google = `${practiceName} appears to offer ${services.join(' and ')} services in ${location}. However, I have limited recent information about their practice. Here are some additional options in your area: [Lists 2-3 competitors]. I recommend calling to verify current services and scheduling.`;
        responses.perplexity = `${practiceName} in ${location} offers ${services.join(', ')}, though I have limited current information about their practice. For the most up-to-date information about their services and availability, I'd recommend contacting them directly or checking their website.`;
        responses.warning = `<strong>OPPORTUNITY ALERT:</strong> AI tools can partially find your practice, but you're not showing up as strongly as competitors. You're likely losing 3-8 potential patients per month who can't find complete information about your services when they search using AI tools.`;
    }
    return responses;
}
/* End of extracted JS */