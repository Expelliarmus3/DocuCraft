import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAppCheck } from 'firebase-admin/app-check';

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (privateKey && clientEmail && projectId) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    try {
      initializeApp({
        projectId,
      });
    } catch (e) {
      console.warn('⚠️ Firebase Admin SDK initialized with default settings:', e);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Extract App Check Token from headers
    const appCheckToken = req.headers.get('x-firebase-appcheck');

    if (!appCheckToken) {
      console.error('❌ App Check Error: x-firebase-appcheck header is missing.');
      return NextResponse.json({ error: 'App Check token is missing.' }, { status: 401 });
    }

    // 2. Validate App Check Token via Admin SDK
    try {
      if (process.env.NODE_ENV === 'development' && appCheckToken === 'local-dev-bypass-token') {
        console.info('ℹ️ Bypassed App Check verification in development mode.');
      } else {
        const appCheck = getAppCheck();
        await appCheck.verifyToken(appCheckToken);
      }
    } catch (appCheckErr: any) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ App Check verification failed in development. Bypassing check:', appCheckErr.message);
      } else {
        console.error('❌ App Check Verification Failed:', appCheckErr);
        return NextResponse.json({ error: 'Unauthorized: Invalid App Check token.' }, { status: 403 });
      }
    }

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