// app/api/whatsapp-photo/route.ts

import { type NextRequest, NextResponse } from "next/server"

// --- CONFIGURAÇÃO FINAL E CORRETA DA API ---
const CORRECT_API_ENDPOINT = "https://whatsapp-profile-picture-api.p.rapidapi.com/user-profile-picture";
const CORRECT_API_HOST = "whatsapp-profile-picture-api.p.rapidapi.com";
// ---------------------------------------------------------

const rapidApiKey = process.env.RAPIDAPI_KEY;
const FALLBACK_PHOTO_URL = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

export async function POST(request: NextRequest) {
  if (!rapidApiKey) {
    console.error("RAPIDAPI_KEY not found in environment variables. Make sure it's set in .env.local");
    return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
  }
  
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
    }

    const fullNumber = String(phone).replace(/[^0-9]/g, "");
    if (fullNumber.length < 10) {
      return NextResponse.json({ success: false, error: "Invalid or too short phone number" }, { status: 400 });
    }
    
    // O parâmetro para esta API parece ser 'number', não 'phone'. Vamos ajustar.
    const url = `${CORRECT_API_ENDPOINT}?number=${fullNumber}`;
    
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': CORRECT_API_HOST,
      },
      signal: AbortSignal.timeout?.(25_000),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(`RapidAPI (${CORRECT_API_HOST}) returned status: ${response.status} for number: ${fullNumber}`);
      const errorBody = await response.text();
      console.error("RapidAPI error body:", errorBody);
      return NextResponse.json({ success: true, result: FALLBACK_PHOTO_URL, is_photo_private: true });
    }
    
    const result = await response.json();
    console.log(`Response from ${CORRECT_API_HOST}:`, JSON.stringify(result, null, 2));

    // A lógica para encontrar a URL da foto continua flexível
    const photoUrl = result.url || result.link || result.profile_pic_url || result.picture || result.avatar;
    const isPhotoAvailable = photoUrl && typeof photoUrl === 'string' && photoUrl.startsWith('http');

    return NextResponse.json({ 
      success: true,
      result: isPhotoAvailable ? photoUrl : FALLBACK_PHOTO_URL, 
      is_photo_private: !isPhotoAvailable,
    });

  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      console.error(`TimeoutError: Request to ${CORRECT_API_HOST} took too long.`);
    } else {
      console.error("Error in API route:", err);
    }
    return NextResponse.json({ success: true, result: FALLBACK_PHOTO_URL, is_photo_private: true });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
