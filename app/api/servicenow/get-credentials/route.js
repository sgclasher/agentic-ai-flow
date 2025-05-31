export async function GET() {
  // WARNING: Do not expose password to the client in production!
  return Response.json({
    instanceUrl: process.env.SERVICENOW_INSTANCE_URL || '',
    username: process.env.SERVICENOW_USERNAME || '',
    password: process.env.SERVICENOW_PASSWORD || '', // REMOVE in production!
    scopeId: process.env.SERVICENOW_SCOPE_ID || ''
  });
} 