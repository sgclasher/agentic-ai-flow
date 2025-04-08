import './globals.css';

export const metadata = {
  title: 'Agentic AI Flow',
  description: 'A Next.js app with React Flow visualization',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 