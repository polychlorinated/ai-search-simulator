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
        presence: formData.getAll('presence'),
        inclusive: formData.get('inclusive'),
        slidingScale: formData.get('slidingScale'),
        specialize: formData.get('specialize') === 'on',
        specialization: formData.get('specialization'),
        reviewEngagement: formData.get('reviewEngagement')
    };

    // Calculate fixed AI & Google Visibility Scores based on survey data
    const expMap = { '0-1': 2, '2-5': 5, '6-10': 8, '11-20': 10, '20+': 10 };
    const experienceScore = expMap[data.yearsInPractice] || 0;
    const servicesScore = (data.services.length / 6) * 10;
    let presenceCount = 0; ['website','google','facebook','instagram','yelp'].forEach(p => {
        if (data.presence.includes(p)) presenceCount++;
    });
    const presenceScore = Math.min(presenceCount * 2, 10);
    const inclusiveScore    = data.inclusive === 'yes' ? 10 : 0;
    const affordabilityScore = data.slidingScale === 'yes' ? 10 : 0;
    const specializationScore = data.specialize ? 10 : 0;
    const reviewScore = data.reviewEngagement === 'yes'
        ? 10 : data.reviewEngagement === 'sometimes' ? 5 : 0;

    // AI Visibility weighted
    const aiWeights = {
        exp: 0.25, srv: 0.15, inc: 0.15, aff: 0.10,
        pres: 0.10, rev: 0.15, spec: 0.10
    };
    const aiScore =
        experienceScore * aiWeights.exp +
        servicesScore    * aiWeights.srv +
        inclusiveScore   * aiWeights.inc +
        affordabilityScore * aiWeights.aff +
        presenceScore    * aiWeights.pres +
        reviewScore      * aiWeights.rev +
        specializationScore * aiWeights.spec;

    // Google Visibility weighted with modifiers
    const mod = { exp: 0.75, srv: 0.6, inc: 0.4, aff: 0.2, pres:1.2, rev:1.2, spec:0.5 };
    const rawG =
        experienceScore * aiWeights.exp * mod.exp +
        servicesScore    * aiWeights.srv * mod.srv +
        inclusiveScore   * aiWeights.inc * mod.inc +
        affordabilityScore * aiWeights.aff * mod.aff +
        presenceScore    * aiWeights.pres * mod.pres +
        reviewScore      * aiWeights.rev * mod.rev +
        specializationScore * aiWeights.spec * mod.spec;
    const gDen = Object.keys(aiWeights).reduce((sum,k) => sum + aiWeights[k] * mod[k], 0);
    // Normalize to a 0–10 scale (rawG max == gDen * 10)
    const googleScore = rawG / gDen;

    const avgScore = (aiScore + googleScore) / 2;
    let recommendation = '';
    // Build dynamic suggestions based on missing strengths
    const suggestions = [];
    if (presenceScore < 4) suggestions.push('claim and optimize your Google Business Profile');
    if (reviewScore < 5) suggestions.push('encourage and respond to online reviews');
    if (experienceScore < 5) suggestions.push('highlight your years of experience');
    if (servicesScore < 5) suggestions.push('showcase a broader range of services');
    if (inclusiveScore < 5) suggestions.push('promote inclusivity and accessibility');
    if (affordabilityScore < 5) suggestions.push('consider offering sliding scale pricing');
    if (specializationScore < 5) suggestions.push('clarify your specialization or niche focus');

    if (avgScore < 6) {
        recommendation = `⚠️ Your clinic may be underrepresented online. ${suggestions.join(', ')}.`;
    } else if (avgScore < 8) {
        recommendation = `💡 You’re on the right track! ${suggestions.length ? suggestions.join(', ') : 'Continue building your online visibility and reviews.'}`;
    } else {
        recommendation = '🚀 Excellent! You’re visible on AI & Google. Maintain your edge with automated content and reputation management.';
    }

    // Display results
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('score-results').innerHTML = `
        <p><strong>AI Visibility Score:</strong> ${aiScore.toFixed(1)}/10</p>
        <p><strong>Google Visibility Score:</strong> ${googleScore.toFixed(1)}/10</p>
        <p><strong>Overall Score:</strong> ${avgScore.toFixed(1)}/10</p>
        <p>${recommendation}</p>
    `;
});
/* End of extracted JS */

/* End of extracted JS */