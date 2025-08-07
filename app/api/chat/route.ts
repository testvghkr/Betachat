import { model } from '@/lib/google-ai';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const file = formData.get('file') as File | null;

    if (!prompt && !file) {
      return NextResponse.json({ error: 'No prompt or file provided' }, { status: 400 });
    }

    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (file) {
      const blob = await put(file.name, file, { access: 'public' });
      fileUrl = blob.url;
      fileName = file.name;
      console.log(`File uploaded to Vercel Blob: ${fileUrl}`);
    }

    const parts = [];
    if (prompt) {
      parts.push({ text: prompt });
    }
    if (fileUrl) {
      // For now, we'll just include the file URL in the prompt for the AI.
      // A more advanced integration would involve sending the file content to the AI.
      parts.push({ text: `[Bestand bijgevoegd: ${fileName || 'onbekend'}]` });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: parts }],
    });

    const responseText = result.response.text();

    return NextResponse.json({ response: responseText, fileUrl, fileName });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
