// app/api/whatsapp-photo/route.ts

import { type NextRequest, NextResponse } from "next/server"

// --- CONFIGURAÇÃO DA API ---
const CORRECT_API_ENDPOINT = "https://whatsapp-data.p.rapidapi.com/wspicture";
const CORRECT_API_HOST = "whatsapp-data.p.rapidapi.com";
// ---------------------------------------------------------

const rapidApiKey = process.env.RAPIDAPI_KEY;
const FALLBACK_PHOTO_URL = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

export async function POST(request: NextRequest) {
  if (!rapidApiKey) {
    console.error("A variável RAPIDAPI_KEY não foi encontrada. Verifique seu arquivo .env.local");
    return NextResponse.json({ success: false, error: "Erro de configuração no servidor" }, { status: 500 });
  }
  
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ success: false, error: "O número de telefone é obrigatório" }, { status: 400 });
    }

    const fullNumber = String(phone).replace(/[^0-9]/g, "");
    if (fullNumber.length < 10) {
      return NextResponse.json({ success: false, error: "Número de telefone inválido ou muito curto" }, { status: 400 });
    }
    
    const url = `${CORRECT_API_ENDPOINT}?phone=${fullNumber}`;
    
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
      console.error(`A API (${CORRECT_API_HOST}) retornou o status: ${response.status} para o número: ${fullNumber}`);
      return NextResponse.json({ success: true, result: FALLBACK_PHOTO_URL, is_photo_private: true });
    }
    
    // --- MUDANÇA CRÍTICA AQUI ---
    // Em vez de 'response.json()', vamos ler como texto para evitar o erro de JSON inválido.
    const responseBodyText = await response.text();
    console.log(`Resposta bruta (texto) de ${CORRECT_API_HOST}:`, responseBodyText);

    // Verificamos se a resposta em texto é uma URL válida.
    const isPhotoAvailable = responseBodyText && responseBodyText.startsWith('http');

    return NextResponse.json({ 
      success: true,
      // Se for uma URL, usamos ela. Senão, usamos a imagem de fallback.
      result: isPhotoAvailable ? responseBodyText : FALLBACK_PHOTO_URL, 
      is_photo_private: !isPhotoAvailable,
    });

  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      console.error(`TimeoutError: A requisição para ${CORRECT_API_HOST} demorou demais.`);
    } else {
      console.error("Erro na rota da API:", err);
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
