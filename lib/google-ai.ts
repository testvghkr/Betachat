import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY environment variable is not set.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// Export generateResponse as requested by the error
export async function generateResponse(message: string, history: Array<{role: string, content: string}> = []): Promise<string> {
  try {
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Google AI API error:', error);
    throw new Error('Er ging iets mis bij het genereren van een antwoord');
  }
}
