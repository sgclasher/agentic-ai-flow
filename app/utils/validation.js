/**
 * Input validation utilities for API endpoints
 */

/**
 * Validate ServiceNow instance URL
 * @param {string} url - The URL to validate
 * @returns {Object} { isValid: boolean, error?: string, sanitized?: string }
 */
export function validateInstanceUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Instance URL is required' };
  }

  const trimmed = url.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Instance URL cannot be empty' };
  }

  if (trimmed.length > 500) {
    return { isValid: false, error: 'Instance URL is too long' };
  }

  // Sanitize and format URL
  let sanitized = trimmed;
  
  // Add https if no protocol specified
  if (!sanitized.match(/^https?:\/\//)) {
    sanitized = 'https://' + sanitized;
  }
  
  // Remove trailing slash
  if (sanitized.endsWith('/')) {
    sanitized = sanitized.slice(0, -1);
  }

  // Validate URL format
  try {
    const urlObj = new URL(sanitized);
    
    // Ensure it's HTTPS for security
    if (urlObj.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTPS URLs are allowed' };
    }
    
    // Basic ServiceNow domain validation
    if (!urlObj.hostname.includes('.service-now.com') && 
        !urlObj.hostname.includes('.servicenow.com') &&
        !urlObj.hostname.match(/^[\w-]+\.servicenowservices\.com$/)) {
      return { isValid: false, error: 'Invalid ServiceNow domain' };
    }
    
    return { isValid: true, sanitized: urlObj.origin };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Validate ServiceNow scope ID (sys_id)
 * @param {string} scopeId - The scope ID to validate
 * @returns {Object} { isValid: boolean, error?: string, sanitized?: string }
 */
export function validateScopeId(scopeId) {
  if (!scopeId || typeof scopeId !== 'string') {
    return { isValid: false, error: 'Scope ID is required' };
  }

  const trimmed = scopeId.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Scope ID cannot be empty' };
  }

  // ServiceNow sys_id is 32 characters long (UUID without dashes)
  const sysIdPattern = /^[a-f0-9]{32}$/i;
  
  // Also allow UUIDs with dashes
  const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  
  if (!sysIdPattern.test(trimmed) && !uuidPattern.test(trimmed)) {
    return { isValid: false, error: 'Invalid scope ID format (must be 32 hex characters or UUID)' };
  }

  // Normalize to 32-character format
  const sanitized = trimmed.replace(/-/g, '').toLowerCase();
  
  return { isValid: true, sanitized };
}

/**
 * Validate business profile data
 * @param {Object} profile - The profile to validate
 * @returns {Object} { isValid: boolean, errors: string[], sanitized?: Object }
 */
export function validateBusinessProfile(profile) {
  const errors = [];
  const sanitized = {};

  if (!profile || typeof profile !== 'object') {
    return { isValid: false, errors: ['Profile data is required'] };
  }

  // Company name validation
  if (!profile.companyName || typeof profile.companyName !== 'string') {
    errors.push('Company name is required');
  } else {
    const trimmed = profile.companyName.trim();
    if (trimmed.length === 0) {
      errors.push('Company name cannot be empty');
    } else if (trimmed.length > 200) {
      errors.push('Company name is too long (max 200 characters)');
    } else {
      sanitized.companyName = trimmed;
    }
  }

  // Industry validation
  const validIndustries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 
    'Retail', 'Education', 'Real Estate', 'Transportation', 
    'Energy', 'Other'
  ];
  
  if (!profile.industry || !validIndustries.includes(profile.industry)) {
    errors.push('Valid industry selection is required');
  } else {
    sanitized.industry = profile.industry;
  }

  // Company size validation
  const validSizes = ['startup', 'small', 'medium', 'large'];
  
  if (!profile.companySize || !validSizes.includes(profile.companySize)) {
    errors.push('Valid company size is required');
  } else {
    sanitized.companySize = profile.companySize;
  }

  // AI maturity level validation
  const validMaturityLevels = ['beginner', 'emerging', 'developing', 'advanced'];
  
  if (!profile.aiMaturityLevel || !validMaturityLevels.includes(profile.aiMaturityLevel)) {
    errors.push('Valid AI maturity level is required');
  } else {
    sanitized.aiMaturityLevel = profile.aiMaturityLevel;
  }

  // Primary goals validation (array)
  if (!Array.isArray(profile.primaryGoals)) {
    errors.push('Primary goals must be an array');
  } else if (profile.primaryGoals.length === 0) {
    errors.push('At least one primary goal is required');
  } else if (profile.primaryGoals.length > 10) {
    errors.push('Too many primary goals selected (max 10)');
  } else {
    sanitized.primaryGoals = profile.primaryGoals.filter(goal => 
      typeof goal === 'string' && goal.trim().length > 0
    );
  }

  // Optional fields
  if (profile.currentTechStack && Array.isArray(profile.currentTechStack)) {
    sanitized.currentTechStack = profile.currentTechStack.filter(tech => 
      typeof tech === 'string' && tech.trim().length > 0
    );
  }

  if (profile.budget && typeof profile.budget === 'string') {
    sanitized.budget = profile.budget.trim();
  }

  if (profile.timeframe && typeof profile.timeframe === 'string') {
    sanitized.timeframe = profile.timeframe.trim();
  }

  if (profile.currentChallenges && typeof profile.currentChallenges === 'string') {
    const trimmed = profile.currentChallenges.trim();
    if (trimmed.length <= 2000) { // Reasonable limit
      sanitized.currentChallenges = trimmed;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: errors.length === 0 ? sanitized : undefined
  };
}

/**
 * Validate scenario type
 * @param {string} scenarioType - The scenario type to validate
 * @returns {Object} { isValid: boolean, error?: string, sanitized?: string }
 */
export function validateScenarioType(scenarioType) {
  const validScenarios = ['conservative', 'balanced', 'aggressive'];
  
  if (!scenarioType || typeof scenarioType !== 'string') {
    return { isValid: true, sanitized: 'balanced' }; // Default
  }

  const trimmed = scenarioType.trim().toLowerCase();
  
  if (!validScenarios.includes(trimmed)) {
    return { isValid: false, error: 'Invalid scenario type' };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * General purpose string sanitization
 * @param {string} input - String to sanitize
 * @param {number} maxLength - Maximum length allowed
 * @returns {string} Sanitized string
 */
export function sanitizeString(input, maxLength = 500) {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input.trim().slice(0, maxLength);
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const requestCounts = new Map();

export function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean old entries
  for (const [key, timestamps] of requestCounts.entries()) {
    const validTimestamps = timestamps.filter(ts => ts > windowStart);
    if (validTimestamps.length === 0) {
      requestCounts.delete(key);
    } else {
      requestCounts.set(key, validTimestamps);
    }
  }
  
  // Check current identifier
  const timestamps = requestCounts.get(identifier) || [];
  const recentRequests = timestamps.filter(ts => ts > windowStart);
  
  if (recentRequests.length >= maxRequests) {
    return { allowed: false, retryAfter: Math.ceil((timestamps[0] + windowMs - now) / 1000) };
  }
  
  // Add current request
  recentRequests.push(now);
  requestCounts.set(identifier, recentRequests);
  
  return { allowed: true };
} 