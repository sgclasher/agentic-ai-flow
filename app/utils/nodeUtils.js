/**
 * Generates ServiceNow URLs for different node types
 */

/**
 * Generates the appropriate ServiceNow URL based on node type and sys_id
 * @param {string} baseUrl - Base ServiceNow instance URL
 * @param {string} nodeType - Type of node (useCase, agent, tool, trigger)
 * @param {string} sysId - ServiceNow sys_id of the record
 * @param {string} toolType - Type of tool (only needed for tool nodes)
 * @returns {string} Complete URL to ServiceNow record
 */
export function generateServiceNowUrl(baseUrl, nodeType, sysId, toolType) {
  if (!baseUrl || !sysId) return null;
  
  // Remove trailing slash if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  switch (nodeType) {
    case 'useCase':
      return `${cleanBaseUrl}/now/agent-studio/usecase-guided-setup/${sysId}/params/step/details`;
      
    case 'agent':
      return `${cleanBaseUrl}/now/agent-studio/agent-setup/${sysId}`;
    
    case 'trigger':
      // Updated to match the format provided in the example
      return `${cleanBaseUrl}/now/nav/ui/classic/params/target/sn_aia_trigger_configuration.do%3Fsys_id%3D${sysId}%26sysparm_view%3D%26sysparm_record_target%3Dsn_aia_trigger_configuration%26sysparm_record_row%3D1%26sysparm_record_list%3DORDERBYusecase%26sysparm_record_rows%3D5`;
      
    case 'tool':
      // Use the standardized format for all tool types to match the example URL format
      return `${cleanBaseUrl}/now/nav/ui/classic/params/target/sn_aia_tool.do%3Fsys_id%3D${sysId}`;
      
    default:
      return null;
  }
}

/**
 * External link icon SVG as JSX
 */
export const ExternalLinkIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="external-link-icon"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
); 