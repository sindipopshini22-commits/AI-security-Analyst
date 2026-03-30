/**
 * Phishing Analyzer Engine By Antigravity (Advanced Version)
 * Performs heuristic analysis on URLs and text.
 */

export const analyzeInput = (input) => {
  if (!input || input.trim().length === 0) return null;

  let score = 0;
  const indicators = [];
  
  // URL Pattern detection
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = input.match(urlPattern) || [];
  
  if (urls.length > 0) {
    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        const host = urlObj.hostname.toLowerCase();
        const path = urlObj.pathname.toLowerCase();
        
        // 1. IP address as host
        if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host)) {
          score += 45;
          indicators.push(`Host is an IP address: ${host}`);
        }
        
        // 2. HTTPS usage
        if (urlObj.protocol !== 'https:') {
          score += 20;
          indicators.push("Unsecured protocol (HTTP) used");
        }
        
        // 3. Subdomain depth
        const parts = host.split('.');
        if (parts.length > 3) {
          score += 15 * (parts.length - 3);
          indicators.push(`Excessive subdomains: ${host}`);
        }
        
        // 4. Suspicious TLDs
        const dangerousTLDs = ['.xyz', '.top', '.pw', '.online', '.site', '.click', '.date', '.loan', '.review', '.zip'];
        dangerousTLDs.forEach(tld => {
          if (host.endsWith(tld)) {
            score += 25;
            indicators.push(`Suspicious TLD detected: ${tld}`);
          }
        });

        // 5. Keywords in domain/path
        const brandKeywords = ['amazon', 'paypal', 'microsoft', 'google', 'apple', 'netflix', 'facebook', 'instagram', 'twitter', 'linkedin', 'bank', 'chase', 'wellsfargo', 'bofa', 'citibank'];
        const actionKeywords = ['login', 'secure', 'verify', 'update', 'account', 'signin', 'support', 'billing', 'billing-update', 'resolution', 'safety', 'security'];
        
        brandKeywords.forEach(kw => {
          if (host.includes(kw)) {
             // Check if it's the official domain
             const isOfficial = brandKeywords.some(bk => host === `${bk}.com` || host.endsWith(`.${bk}.com`) || host === `${bk}.net` || host.endsWith(`.${bk}.net`));
             if (!isOfficial) {
                score += 35;
                indicators.push(`Brand impersonation attempt: '${kw}'`);
             }
          }
        });

        actionKeywords.forEach(kw => {
          if (host.includes(kw)) {
            score += 25;
            indicators.push(`Suspicious term in domain: '${kw}'`);
          }
          if (path.includes(kw)) {
            score += 15;
            indicators.push(`Suspicious term in path: '${kw}'`);
          }
        });

        // 6. Special characters in URL
        if (url.includes('@')) {
          score += 30;
          indicators.push("URL contains '@' character (common redirection trick)");
        }
        if (url.includes('//') && url.lastIndexOf('//') > 7) {
          score += 25;
          indicators.push("Multiple protocol indicators detected (redirection attempt)");
        }

      } catch (e) {
        // Invalid URL
      }
    });
  }

  // Text Phishing logic (Urgency, fear, authority)
  const phishingPatterns = [
    { regex: /urgent|immediate|action required|important notice/i, weight: 15, label: 'Urgency language' },
    { regex: /suspended|restricted|locked|closed|disabled/i, weight: 20, label: 'Account status threat' },
    { regex: /verify|confirm|identity|validate|update/i, weight: 15, label: 'Action-oriented phrasing' },
    { regex: /unauthorized|compromised|hack|breach/i, weight: 20, label: 'Fear-based security alert' },
    { regex: /password|social security|ssn|credit card|cvv|pin/i, weight: 30, label: 'Request for PII/Credentials' },
    { regex: /dear customer|dear user|dear member/i, weight: 10, label: 'Generic greeting' }
  ];

  phishingPatterns.forEach(pattern => {
    if (pattern.regex.test(input)) {
      score += pattern.weight;
      if (!indicators.includes(pattern.label)) {
        indicators.push(pattern.label);
      }
    }
  });

  // Cap score at 100
  score = Math.min(score, 100);

  let riskLevel = "Low";
  let classification = "SAFE";
  
  if (score >= 65) { // Lowered threshold for PHISHING
    riskLevel = "High";
    classification = "PHISHING";
  } else if (score >= 25) { // Lowered threshold for SUSPICIOUS
    riskLevel = "Medium";
    classification = "SUSPICIOUS";
  }

  // Generate explanation
  let explanation = "";
  if (classification === "SAFE") {
    explanation = "The input shows no significant deviations from safe communication patterns. Domain and protocol checks passed.";
  } else {
    explanation = `Critical indicators detected: ${indicators.slice(0, 3).join(', ')}. The presence of ${classification === 'PHISHING' ? 'highly malicious' : 'suspicious'} patterns suggests a social engineering risk.`;
  }

  // Recommendation
  let recommendation = "Proceed with caution.";
  if (classification === "PHISHING") {
    recommendation = "🛑 AVOID ENTIRELY. This is a high-confidence phishing attempt. Do not interact, report immediately.";
  } else if (classification === "SUSPICIOUS") {
    recommendation = "⚠️ USE CAUTION. Verify the source manually. Do not click links unless you are 100% certain of the sender.";
  }

  return {
    score,
    level: riskLevel,
    classification,
    indicators: indicators.length > 0 ? indicators : ["No suspicious patterns found"],
    explanation,
    recommendation
  };
};
