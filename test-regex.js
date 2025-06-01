const markdown = `# Client Profile: Test Corp

## Company Overview
- **Company Name**: Test Corp
- **Industry**: Healthcare
- **Size**: 201-1000 employees
- **Annual Revenue**: $50M
- **Employee Count**: 500
- **Primary Location**: New York, NY

## Another Section
Content here`;

console.log('Original markdown:');
console.log(markdown);
console.log('\n---\n');

const heading = '## Company Overview';
const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
console.log('Escaped heading:', escapedHeading);

const regex = new RegExp(`${escapedHeading}\\n([\\s\\S]*?)(?=\\n##|$)`, 'm');
console.log('Regex:', regex);

const match = markdown.match(regex);
console.log('\nMatch result:', match);

if (match) {
  console.log('\nCaptured content:');
  console.log(JSON.stringify(match[1]));
} 