const markdown = `# Client Profile: Test Corp

## Company Overview
- **Company Name**: Test Corp
- **Industry**: Healthcare
- **Size**: 201-1000 employees
- **Annual Revenue**: $50M
- **Employee Count**: 500
- **Primary Location**: New York, NY`;

function extractSection(markdown, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedHeading}\\n([\\s\\S]*?)(?=\\n##|$)`, 'm');
  const match = markdown.match(regex);
  return match ? match[1].trim() : '';
}

function parseCompanyOverview(markdown) {
  const section = extractSection(markdown, '## Company Overview');
  console.log('Section:', JSON.stringify(section));
  const data = {};
  
  const patterns = {
    companyName: /\*\*Company Name\*\*:\s*(.+)/,
    industry: /\*\*Industry\*\*:\s*(.+)/,
    size: /\*\*Size\*\*:\s*(.+)/,
    annualRevenue: /\*\*Annual Revenue\*\*:\s*\$(.+)/,
    employeeCount: /\*\*Employee Count\*\*:\s*(.+)/,
    primaryLocation: /\*\*Primary Location\*\*:\s*(.+)/
  };

  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = section.match(pattern);
    console.log(`${key}: pattern=${pattern}, match=${match}`);
    if (match) data[key] = match[1].trim();
  });

  return data;
}

const result = parseCompanyOverview(markdown);
console.log('Final result:', result); 