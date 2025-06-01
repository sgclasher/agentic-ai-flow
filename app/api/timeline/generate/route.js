import { NextResponse } from 'next/server';
import { validateBusinessProfile, validateScenarioType, checkRateLimit } from '../../../utils/validation';
import { TimelineService } from '../../../services/timelineService';

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitCheck = checkRateLimit(`timeline-${clientIP}`, 5, 60000); // 5 timeline generations per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': rateLimitCheck.retryAfter.toString() } }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { businessProfile, scenarioType } = body;

    // Validate business profile
    const profileValidation = validateBusinessProfile(businessProfile);
    if (!profileValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid business profile', 
          details: profileValidation.errors 
        },
        { status: 400 }
      );
    }

    // Validate scenario type
    const scenarioValidation = validateScenarioType(scenarioType);
    if (!scenarioValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid scenario type: ${scenarioValidation.error}` },
        { status: 400 }
      );
    }

    // Generate timeline using the service
    try {
      const timelineData = await TimelineService.generateTimeline(
        profileValidation.sanitized,
        scenarioValidation.sanitized
      );

      return NextResponse.json({
        success: true,
        timeline: timelineData,
        generatedAt: new Date().toISOString()
      });

    } catch (serviceError) {
      console.error('Timeline generation service error:', serviceError);
      return NextResponse.json(
        { error: 'Failed to generate timeline', details: serviceError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Timeline API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 