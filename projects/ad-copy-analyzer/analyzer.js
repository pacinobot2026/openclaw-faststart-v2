// Ad Copy Analyzer - Analysis Engine

const POWER_WORDS = [
    // Urgency
    'now', 'today', 'instant', 'immediately', 'hurry', 'limited', 'deadline', 'last chance', 'don\'t miss', 'act fast', 'expires', 'quick',
    // Exclusivity
    'exclusive', 'secret', 'insider', 'members only', 'private', 'invitation', 'vip', 'elite',
    // Value
    'free', 'bonus', 'save', 'discount', 'deal', 'bargain', 'value', 'affordable', 'cheap', 'best price',
    // Trust
    'proven', 'guaranteed', 'certified', 'authentic', 'official', 'trusted', 'secure', 'safe', 'reliable',
    // Results
    'results', 'transform', 'boost', 'increase', 'improve', 'grow', 'maximize', 'skyrocket', 'double', 'triple',
    // Emotion
    'amazing', 'incredible', 'awesome', 'powerful', 'breakthrough', 'revolutionary', 'life-changing', 'remarkable',
    // Easy
    'easy', 'simple', 'effortless', 'quick', 'fast', 'straightforward', 'no hassle', 'painless',
    // New
    'new', 'introducing', 'announcing', 'discover', 'reveal', 'unveiled', 'fresh', 'latest'
];

const EMOTIONAL_TRIGGERS = [
    // Fear/Pain
    'afraid', 'worried', 'struggling', 'frustrated', 'tired of', 'sick of', 'pain', 'problem', 'mistake', 'risk', 'danger', 'lose', 'losing', 'miss out', 'fail',
    // Desire/Pleasure
    'want', 'need', 'desire', 'dream', 'imagine', 'love', 'enjoy', 'happy', 'success', 'win', 'achieve', 'freedom', 'wealth', 'rich',
    // Curiosity
    'secret', 'hidden', 'discover', 'revealed', 'truth', 'why', 'how', 'what if', 'imagine',
    // Social proof
    'everyone', 'people', 'thousands', 'millions', 'popular', 'trending', 'viral', 'recommended'
];

const CTA_PHRASES = [
    'click here', 'buy now', 'get started', 'sign up', 'join', 'subscribe', 'download', 'learn more', 
    'get instant access', 'claim', 'grab', 'start', 'try', 'order', 'shop', 'book', 'reserve',
    'get your', 'yes', 'i want', 'send me', 'give me', 'show me', 'tell me', 'register'
];

const URGENCY_WORDS = [
    'now', 'today', 'tonight', 'immediately', 'instant', 'hurry', 'quick', 'fast', 'limited', 
    'deadline', 'expires', 'ending', 'last chance', 'final', 'only', 'hours', 'minutes', 
    'running out', 'almost gone', 'few left', 'act fast', 'don\'t wait', 'before it\'s gone'
];

function analyzeAd() {
    const headline = document.getElementById('headline').value.trim();
    const body = document.getElementById('body').value.trim();
    
    if (!headline && !body) {
        alert('Please enter at least a headline or body copy to analyze.');
        return;
    }

    const fullText = (headline + ' ' + body).toLowerCase();
    const results = {
        headline: analyzeHeadline(headline),
        clarity: analyzeClarity(headline, body),
        emotion: analyzeEmotion(fullText),
        urgency: analyzeUrgency(fullText),
        cta: analyzeCTA(fullText),
        power: analyzePowerWords(fullText)
    };

    displayResults(results);
}

function analyzeHeadline(headline) {
    let score = 50;
    let feedback = [];

    if (!headline) {
        return { score: 0, feedback: 'No headline provided. Headlines are crucial for grabbing attention!' };
    }

    const words = headline.split(/\s+/).length;
    
    // Length check (ideal: 6-12 words)
    if (words >= 6 && words <= 12) {
        score += 15;
        feedback.push('Good length');
    } else if (words < 6) {
        score -= 10;
        feedback.push('Could be more descriptive');
    } else {
        score -= 10;
        feedback.push('A bit long - consider shortening');
    }

    // Number in headline
    if (/\d/.test(headline)) {
        score += 15;
        feedback.push('Numbers grab attention ✓');
    }

    // Question format
    if (headline.includes('?')) {
        score += 10;
        feedback.push('Questions engage readers ✓');
    }

    // Power words in headline
    const headlineLower = headline.toLowerCase();
    const hasPowerWord = POWER_WORDS.some(word => headlineLower.includes(word));
    if (hasPowerWord) {
        score += 15;
        feedback.push('Contains power words ✓');
    }

    // Starts with action word or "How to"
    if (/^(how to|discover|get|learn|find|stop|start|why|what)/i.test(headline)) {
        score += 10;
        feedback.push('Strong opening ✓');
    }

    return { 
        score: Math.min(100, Math.max(0, score)), 
        feedback: feedback.length ? feedback.join(' • ') : 'Consider adding numbers or power words'
    };
}

function analyzeClarity(headline, body) {
    let score = 60;
    let feedback = [];
    const fullText = headline + ' ' + body;

    if (!body) {
        return { score: 30, feedback: 'Add body copy to communicate your full message' };
    }

    const sentences = body.split(/[.!?]+/).filter(s => s.trim());
    const words = body.split(/\s+/);
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);

    // Sentence length (ideal: 15-20 words average)
    if (avgWordsPerSentence <= 20) {
        score += 15;
        feedback.push('Easy to read ✓');
    } else if (avgWordsPerSentence > 25) {
        score -= 15;
        feedback.push('Sentences are too long');
    }

    // Check for jargon/complexity (simple heuristic)
    const complexWords = words.filter(w => w.length > 12).length;
    if (complexWords === 0) {
        score += 10;
        feedback.push('Simple language ✓');
    } else if (complexWords > 3) {
        score -= 10;
        feedback.push('Simplify some words');
    }

    // Has clear benefit statement
    const benefitWords = ['you will', 'you\'ll', 'you get', 'you can', 'your', 'for you'];
    const hasBenefit = benefitWords.some(w => fullText.toLowerCase().includes(w));
    if (hasBenefit) {
        score += 15;
        feedback.push('Customer-focused ✓');
    } else {
        feedback.push('Make it more about the reader');
    }

    return { 
        score: Math.min(100, Math.max(0, score)), 
        feedback: feedback.join(' • ') || 'Clear and readable'
    };
}

function analyzeEmotion(text) {
    let score = 30;
    let feedback = [];
    let triggersFound = [];

    EMOTIONAL_TRIGGERS.forEach(trigger => {
        if (text.includes(trigger)) {
            triggersFound.push(trigger);
        }
    });

    const triggerCount = triggersFound.length;
    
    if (triggerCount >= 5) {
        score = 95;
        feedback.push('Strong emotional appeal');
    } else if (triggerCount >= 3) {
        score = 75;
        feedback.push('Good emotional connection');
    } else if (triggerCount >= 1) {
        score = 55;
        feedback.push('Some emotional elements');
    } else {
        score = 25;
        feedback.push('Add emotional triggers to connect with readers');
    }

    if (triggersFound.length > 0) {
        feedback.push(`Found: ${triggersFound.slice(0, 3).join(', ')}`);
    }

    return { 
        score: Math.min(100, Math.max(0, score)), 
        feedback: feedback.join(' • ')
    };
}

function analyzeUrgency(text) {
    let score = 20;
    let feedback = [];
    let urgencyFound = [];

    URGENCY_WORDS.forEach(word => {
        if (text.includes(word)) {
            urgencyFound.push(word);
        }
    });

    const urgencyCount = urgencyFound.length;

    if (urgencyCount >= 4) {
        score = 95;
        feedback.push('Strong urgency created');
    } else if (urgencyCount >= 2) {
        score = 70;
        feedback.push('Good sense of urgency');
    } else if (urgencyCount >= 1) {
        score = 50;
        feedback.push('Light urgency present');
    } else {
        score = 20;
        feedback.push('Add urgency to drive action');
    }

    if (urgencyFound.length > 0) {
        feedback.push(`Found: ${urgencyFound.slice(0, 3).join(', ')}`);
    }

    return { 
        score: Math.min(100, Math.max(0, score)), 
        feedback: feedback.join(' • ')
    };
}

function analyzeCTA(text) {
    let score = 20;
    let feedback = [];
    let ctaFound = [];

    CTA_PHRASES.forEach(phrase => {
        if (text.includes(phrase)) {
            ctaFound.push(phrase);
        }
    });

    if (ctaFound.length >= 2) {
        score = 90;
        feedback.push('Clear calls to action');
    } else if (ctaFound.length === 1) {
        score = 70;
        feedback.push('Has a call to action');
    } else {
        score = 20;
        feedback.push('Add a clear call to action');
    }

    // Check for specific/benefit-driven CTA
    const specificCTA = ['get your', 'claim your', 'start your', 'grab your', 'get instant'];
    const hasSpecificCTA = specificCTA.some(cta => text.includes(cta));
    if (hasSpecificCTA) {
        score += 10;
        feedback.push('Benefit-driven CTA ✓');
    }

    return { 
        score: Math.min(100, Math.max(0, score)), 
        feedback: feedback.join(' • ')
    };
}

function analyzePowerWords(text) {
    let powerFound = [];

    POWER_WORDS.forEach(word => {
        if (text.includes(word)) {
            powerFound.push(word);
        }
    });

    const count = powerFound.length;
    let score, feedback;

    if (count >= 8) {
        score = 95;
        feedback = 'Loaded with power words!';
    } else if (count >= 5) {
        score = 80;
        feedback = 'Great use of power words';
    } else if (count >= 3) {
        score = 60;
        feedback = 'Good power word usage';
    } else if (count >= 1) {
        score = 40;
        feedback = 'Add more power words';
    } else {
        score = 15;
        feedback = 'No power words found - add some!';
    }

    if (powerFound.length > 0) {
        feedback += ` • Found: ${powerFound.slice(0, 4).join(', ')}`;
    }

    return { score, feedback };
}

function generateSuggestions(results) {
    const suggestions = [];

    if (results.headline.score < 60) {
        suggestions.push('Add a number or statistic to your headline for more impact');
    }
    if (results.clarity.score < 60) {
        suggestions.push('Shorten your sentences and use simpler words');
    }
    if (results.emotion.score < 60) {
        suggestions.push('Connect with your reader\'s pain points or desires');
    }
    if (results.urgency.score < 60) {
        suggestions.push('Add time-sensitive language like "today only" or "limited spots"');
    }
    if (results.cta.score < 60) {
        suggestions.push('Include a clear, action-oriented call to action');
    }
    if (results.power.score < 60) {
        suggestions.push('Sprinkle in power words like "proven", "instant", or "exclusive"');
    }

    // Always give at least one suggestion
    if (suggestions.length === 0) {
        suggestions.push('Great job! Consider A/B testing different headlines');
        suggestions.push('Try adding a specific number or timeframe for even more impact');
    }

    return suggestions;
}

function displayResults(results) {
    const resultsSection = document.getElementById('results');
    resultsSection.classList.remove('hidden');

    // Calculate overall score
    const scores = [
        results.headline.score,
        results.clarity.score,
        results.emotion.score,
        results.urgency.score,
        results.cta.score,
        results.power.score
    ];
    const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Animate overall score
    const overallEl = document.getElementById('overall-score');
    animateNumber(overallEl, 0, overall, 1000);

    // Update individual scores
    updateMetric('headline', results.headline);
    updateMetric('clarity', results.clarity);
    updateMetric('emotion', results.emotion);
    updateMetric('urgency', results.urgency);
    updateMetric('cta', results.cta);
    updateMetric('power', results.power);

    // Generate and display suggestions
    const suggestions = generateSuggestions(results);
    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateMetric(name, data) {
    const scoreBar = document.getElementById(`${name}-score`);
    const feedback = document.getElementById(`${name}-feedback`);
    
    setTimeout(() => {
        scoreBar.style.width = `${data.score}%`;
        
        // Color based on score
        if (data.score >= 70) {
            scoreBar.style.background = 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
        } else if (data.score >= 50) {
            scoreBar.style.background = 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)';
        } else {
            scoreBar.style.background = 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)';
        }
    }, 100);
    
    feedback.textContent = data.feedback;
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Event listeners
document.getElementById('analyze-btn').addEventListener('click', analyzeAd);

// Allow Enter key in headline to trigger analysis
document.getElementById('headline').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        analyzeAd();
    }
});
