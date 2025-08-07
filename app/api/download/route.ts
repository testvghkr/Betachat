import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('fileUrl');
  const fileName = searchParams.get('fileName') || 'download';

  if (!fileUrl) {
    return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', blob.type);
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    return new NextResponse(blob, { headers });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}
