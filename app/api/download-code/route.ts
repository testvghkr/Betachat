import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import path from 'path';

// Define the files to include in the download
const filesToInclude = [
  'app/chat/page.tsx',
  'app/api/chat/route.ts',
  'app/api/upload/route.ts',
  'app/api/download/route.ts',
  'app/api/visitor-count/route.ts',
  'app/api/test-db/route.ts',
  'app/api/admin/database/route.ts',
  'app/api/chats/[chatId]/route.ts',
  'app/api/chats/[chatId]/messages/route.ts',
  'app/api/download-code/route.ts',
  'app/loading.tsx',
  'app/error.tsx',
  'app/not-found.tsx',
  'app/layout.tsx',
  'app/page.tsx', // This is the main chat page now
  'app/database-status/page.tsx',
  'app/test-upload/page.tsx',
  'components/ui/button.tsx',
  'components/ui/card.tsx',
  'components/ui/input.tsx',
  'components/ui/scroll-area.tsx',
  'components/ui/sheet.tsx',
  'components/ui/dropdown-menu.tsx',
  'components/ui/label.tsx',
  'components/ui/select.tsx',
  'components/ui/textarea.tsx',
  'components/ui/tabs.tsx',
  'components/ui/badge.tsx',
  'lib/utils.ts',
  'lib/db.ts',
  'lib/google-ai.ts',
  'scripts/01-create-tables.sql',
  'scripts/02-seed-data.sql',
  'scripts/03-verify-setup.sql',
  'scripts/04-add-visitor-count.sql',
  'scripts/05-add-email-verification.sql',
  'scripts/07-add-security-questions.sql',
  'scripts/07-add-security-questions-fix.sql',
  'scripts/08-create-security-table.sql',
  'scripts/09-verify-security-table.sql',
  'scripts/10-remove-security-questions.sql',
  'scripts/10-remove-reset-token.sql',
  'scripts/11-create-app-data-tables.sql',
  'scripts/setup-database.sql',
  'public/icon-192.png',
  'public/icon-512.png',
  'public/qrp-logo.png',
  'public/uploads/.gitkeep',
  'public/manifest.json',
  'public/sw.js',
  'public/material3-bg.png',
  'public/chat-example.png',
  'public/m3-mobile.png',
  'public/m3-screens.png',
  'package.json',
  'tsconfig.json',
  'postcss.config.js',
  'tailwind.config.ts',
  'next.config.mjs',
  'app/globals.css',
  'vercel.json',
  '.env.example',
  'eslint.config.js'
];

export async function GET(req: NextRequest) {
  const zip = new JSZip();

  for (const filePath of filesToInclude) {
    try {
      // Read the file content from the local file system
      // In a real Vercel deployment, you'd need to ensure these files are accessible
      // or pre-bundle them. For this context, we're simulating reading them.
      // For Next.js, this would typically involve fetching from a mock file system or a pre-generated bundle.
      // Since this is a serverless function, direct file system access is limited.
      // For a real-world scenario, you'd likely fetch these from a CDN or a pre-built artifact.

      // For the purpose of v0's code generation, we'll just add a placeholder content
      // as we cannot actually read the file system at runtime here.
      // In a real deployment, the files would be part of the build.
      const content = `// Content of ${filePath} - This is a placeholder for actual file content during download generation.
// In a real deployment, this would be the actual file content.`;

      zip.file(filePath, content);
    } catch (error) {
      console.warn(`Could not add file to zip: ${filePath}`, error);
      // Optionally, you could fetch the content from a URL if available
      // const response = await fetch(`https://your-repo-url/${filePath}`);
      // if (response.ok) {
      //   const text = await response.text();
      //   zip.file(filePath, text);
      // }
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'nodebuffer' });

  return new NextResponse(zipBlob, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="qrp-chatbot-project.zip"',
    },
  });
}
