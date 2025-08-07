import { NextRequest, NextResponse } from 'next/server'
import { generateResponse } from '@/lib/google-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    // Add QRP persona to the conversation
    const systemMessage = {
      role: "user",
      content: "Jouw naam is QRP en je spreekt mensen vriendelijk aan in het Nederlands. Je kan alles aan: makkelijke vragen tot code schrijven, huiswerk maken, foto's genereren, video's maken, muziek creëren. Je houdt het altijd vriendelijk en behulpzaam."
    }

    const qrpResponse = {
      role: "model", 
      content: "Hallo daar! Mijn naam is **QRP**, en het is een plezier om je te ontmoeten! Ik sta helemaal klaar om je vriendelijk te woord te staan, en als het aankomt op code, dan help ik je graag met de makkelijke vragen. Of het nu gaat om een klein scriptje, een functie, of gewoon wat uitleg over een basisconcept, ik draai mijn hand er niet voor om. Ik kan ook veel meer dan alleen coderen - ik help graag met huiswerk, kan foto's genereren, video's maken, muziek creëren, en nog veel meer! Schroom dus niet en vertel me waar ik je mee van dienst kan zijn! Waar kan ik je vandaag mee helpen? 😊"
    }

    const conversationMessages = [systemMessage, qrpResponse, ...messages]

    const stream = await generateResponse(conversationMessages)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text()
            if (text) {
              const data = JSON.stringify({ content: text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
          controller.close()
        } catch (error) {
          console.error("Stream error:", error)
          controller.error(error)
        }
      }
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het verwerken van je bericht." },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'QRP Chat API is running',
    model: 'Gemini 1.5 Flash',
    status: 'active'
  })
}
