// Specialized API route to fetch all ServiceNow agentic AI data in one go

import { NextResponse } from 'next/server';

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
    // Parse request body
    const body = await request.json();
    const { instanceUrl, username, password, scopeId } = body;

    // Validate required parameters
    if (!instanceUrl || !username || !password || !scopeId) {
      return NextResponse.json(
        { error: 'Missing required parameters: instanceUrl, username, password, scopeId' },
        { status: 400 }
      );
    }

    // Make sure instanceUrl is properly formatted
    let formattedUrl = instanceUrl.trim();
    if (!formattedUrl.startsWith('https://') && !formattedUrl.startsWith('http://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    if (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.slice(0, -1);
    }

    // Create authorization header
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Use the new scripted REST API endpoint
    const apiUrl = `${formattedUrl}/api/x_nowge_rfx_ai/ai_relationship_explorer/relationships?app_scope_id=${scopeId}`;
    
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