import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { text, action, templateType } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.includes('your_gemini_api_key_here')) {
      console.error('❌ Gemini Error: API Key missing.');
      return NextResponse.json({ error: 'Gemini credentials missing.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let structuralRule = `
      CRITICAL DIRECTION:
      1. You are a production-grade automated text formatter.
      2. Output exactly ONE single, fully completed, professionally polished version of the document.
      3. Do NOT include markdown meta-explanations, chatty introductions, or separate suggestion lists.
      4. Carefully evaluate what standard industry sections or details are missing from this ${templateType} (e.g., portfolio links, contact info, specific metrics).
      5. Directly generate and embed these missing pieces into the text using clear brackets like "[Insert GitHub Link Here]" or "[Insert Key Metric/Achievement]" so the user can easily replace them with their own details.
      6. Use markdown headings (e.g., **EXPERIENCE**) to structure the layout perfectly.
    `;

    let systemInstruction = `You are an expert copywriter formatting text for a ${templateType}. ${structuralRule}`;
    
    if (action === 'professional') {
      systemInstruction += ' Action: Fix grammar, elevate vocabulary tone, seamlessly add bracketed placeholders for missing critical information, and ensure layout readiness.';
    } else if (action === 'summarize') {
      systemInstruction += ' Action: Distill text into high-impact executive summaries while embedding bracketed layout placeholders where additional context or data points belong.';
    }

    const prompt = `${systemInstruction}\n\nTarget Text:\n${text}`;
    const result = await model.generateContent(prompt);
    const outputText = result.response.text().trim();
    
    return NextResponse.json({ processedText: outputText });
  } catch (err: any) {
    console.error('❌ Server API Route Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}