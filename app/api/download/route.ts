import { NextRequest, NextResponse } from 'next/server';
import { getBlobUrl } from '@vercel/blob';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('fileUrl');
  const fileName = searchParams.get('fileName');

  if (!fileUrl || !fileName) {
    return NextResponse.json({ error: 'Missing fileUrl or fileName' }, { status: 400 });
  }

  try {
    // If the fileUrl is a Vercel Blob URL, we can use getBlobUrl to ensure it's valid
    // Otherwise, we assume it's a direct URL that can be fetched
    const finalUrl = fileUrl.startsWith('blob:') ? getBlobUrl(fileUrl) : fileUrl;

    const response = await fetch(finalUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', blob.type);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Length', blob.size.toString());

    return new NextResponse(blob, { headers });
  } catch (error: any) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: error.message || 'Failed to download file' }, { status: 500 });
  }
}
