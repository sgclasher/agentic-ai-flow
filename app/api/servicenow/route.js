// Next.js API route to proxy requests to ServiceNow
// This avoids CORS issues by making server-to-server requests

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      instanceUrl, 
      username, 
      password, 
      tableName, 
      fields = [], 
      scope = '',
      query = ''
    } = body;

    // Validate required parameters
    if (!instanceUrl || !username || !password || !tableName) {
      return NextResponse.json(
        { error: 'Missing required parameters: instanceUrl, username, password, tableName' },
        { status: 400 }
      );
    }

    // Construct the ServiceNow API URL
    let url = `${instanceUrl}/api/now/table/${tableName}?`;
    
    // Add query parameters if provided
    const queryParams = [];
    
    if (scope) {
      queryParams.push(`sysparm_query=sys_scope=${scope}${query ? '^' + query : ''}`);
    } else if (query) {
      queryParams.push(`sysparm_query=${query}`);
    }
    
    if (fields.length > 0) {
      queryParams.push(`sysparm_fields=${fields.join(',')}`);
    }
    
    queryParams.push('sysparm_display_value=false');
    queryParams.push('sysparm_exclude_reference_link=true');
    
    url += queryParams.join('&');
    
    console.log(`Proxying request to: ${url}`);
    
    // Make the authenticated request to ServiceNow
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ServiceNow Error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { 
          error: `ServiceNow request failed with status ${response.status}`,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    // Parse and return the ServiceNow response
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in ServiceNow proxy API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 