
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message, conversation } = body;

    // Create context-aware prompt for wedding planning
    const systemPrompt = `You are an expert AI wedding planning assistant. You help couples plan their perfect wedding by providing personalized advice, recommendations, and guidance. You have extensive knowledge about:

- Wedding budgeting and cost management
- Wedding timelines and planning schedules  
- Global wedding venues and vendors
- Wedding traditions from various cultures and religions
- Wedding attire and fashion advice
- Catering and menu planning
- Photography and videography
- Flowers and decorations
- Music and entertainment
- Legal requirements for marriages worldwide
- Wedding etiquette and protocols

Always provide helpful, accurate, and practical advice. Be warm, encouraging, and supportive. If you don't know something specific, acknowledge it and suggest ways the couple can find the information they need.

Provide global wedding advice and adapt recommendations based on the couple's location when mentioned.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation?.slice(-5)?.map((msg: any) => ({
        role: msg?.type === 'user' ? 'user' : 'assistant',
        content: msg?.content
      })) || [],
      { role: 'user', content: message }
    ];

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: messages,
        stream: true,
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        
        try {
          while (true) {
            const { done, value } = await reader?.read() || { done: true, value: undefined };
            if (done) break;
            
            const chunk = decoder.decode(value);
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('AI Assistant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
