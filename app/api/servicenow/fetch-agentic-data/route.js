// Specialized API route to fetch all ServiceNow agentic AI data in one go

import { NextResponse } from 'next/server';
import { validateInstanceUrl, validateScopeId, checkRateLimit } from '../../../utils/validation';

// Helper to safely get nested properties
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
};

export async function POST(request) {
  try {
    // Rate limiting (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitCheck = checkRateLimit(clientIP, 20, 60000); // 20 requests per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': rateLimitCheck.retryAfter.toString() } }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { instanceUrl, scopeId } = body;

    // Validate instanceUrl
    const urlValidation = validateInstanceUrl(instanceUrl);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid instance URL: ${urlValidation.error}` },
        { status: 400 }
      );
    }

    // Validate scopeId
    const scopeValidation = validateScopeId(scopeId);
    if (!scopeValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid scope ID: ${scopeValidation.error}` },
        { status: 400 }
      );
    }

    // Get credentials from environment variables (server-side only)
    const username = process.env.SERVICENOW_USERNAME;
    const password = process.env.SERVICENOW_PASSWORD;

    // Validate server-side credentials
    if (!username || !password) {
      console.error('Server configuration error: ServiceNow credentials not found in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Authentication credentials not configured' },
        { status: 500 }
      );
    }

    // Use validated and sanitized values
    const formattedUrl = urlValidation.sanitized;
    const sanitizedScopeId = scopeValidation.sanitized;

    // Create authorization header using server-side credentials
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Use the new scripted REST API endpoint with sanitized scope ID
    const apiUrl = `${formattedUrl}/api/x_nowge_rfx_ai/ai_relationship_explorer/relationships?app_scope_id=${sanitizedScopeId}`;
    
    console.log(`Fetching from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch data from scripted REST API: ${response.status} ${response.statusText}. Details: ${errorText}`);
    }

    // Get the response data
    const data = await response.json();
    
    // Add debug logging
    console.log('API Response Structure:', JSON.stringify(data, null, 2));
    
    // Check if the data is nested in an x_nowge_rfx_ai object
    if (data.x_nowge_rfx_ai && data.x_nowge_rfx_ai.use_cases) {
      // Return the data with use_cases directly at the top level
      return NextResponse.json({ use_cases: data.x_nowge_rfx_ai.use_cases });
    } else if (data.result && data.result.use_cases) {
      // If it's under a result property, extract it
      return NextResponse.json({ use_cases: data.result.use_cases });
    } else if (data.use_cases) {
      // Data already has use_cases at the top level
      return NextResponse.json(data);
    } else {
      // If we can't find use_cases in the expected places, return what we have
      // and let the error handling catch it
      console.error('Could not find use_cases in the API response:', data);
      return NextResponse.json(data);
    }

  } catch (error) {
    console.error('Error in fetch-agentic-data API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch or process ServiceNow data' },
      { status: 500 }
    );
  }
} 