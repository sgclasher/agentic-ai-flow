export async function GET() {
  // Only return non-sensitive connection details
  // Credentials should be handled server-side only
  return Response.json({
    instanceUrl: process.env.SERVICENOW_INSTANCE_URL || '',
    // Remove username and password from client exposure
    scopeId: process.env.SERVICENOW_SCOPE_ID || ''
  });
} 