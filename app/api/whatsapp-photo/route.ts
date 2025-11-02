// app/api/whatsapp-photo/route.ts

import { type NextRequest, NextResponse } from "next/server"

const CORRECT_API_ENDPOINT = "https://whatsapp-data.p.rapidapi.com/wspicture";
const CORRECT_API_HOST = "whatsapp-data.p.rapidapi.com";
const FALLBACK_PHOTO_URL = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

export async function POST(request: NextRequest) {
  // --- LOG 1: VERIFICANDO A CHAVE DE API ---
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  console.log("--- INICIANDO REQUISIÇÃO ---");
  if (!rapidApiKey) {
    console.error("ERRO CRÍTICO: A variável RAPIDAPI_KEY não foi encontrada!");
    return NextResponse.json({ success: false, error: "Erro de configuração no servidor" }, { status: 500 });
  }
  console.log("Chave de API carregada com sucesso."); // Se esta mensagem não aparecer, o problema é aqui.
  
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ success: false, error: "O número de telefone é obrigatório" }, { status: 400 });
    }

    const fullNumber = String(phone).replace(/[^0-9]/g, "");
    if (fullNumber.length < 10) {
      return NextResponse.json({ success: false, error: "Número de telefone inválido ou muito curto" }, { status: 400 });
    }

    // --- LOG 2: VERIFICANDO O NÚMERO E A URL ---
    const url = `${CORRECT_API_ENDPOINT}?phone=${fullNumber}`;
    console.log(`Enviando requisição para a API com o número: ${fullNumber}`);
    console.log(`URL completa da requisição: ${url}`);
    
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': CORRECT_API_HOST,
      },
      signal: AbortSignal.timeout?.(25_000),
    };

    const response = await fetch(url, options);

    // --- LOG 3: VERIFICANDO A RESPOSTA ---
    const responseBodyText = await response.text();
    console.log(`Status da resposta da API: ${response.status}`);
    console.log(`Resposta bruta (texto) de ${CORRECT_API_HOST}:`, responseBodyText);

    if (!response.ok) {
      console.error(`A API retornou um erro (status: ${response.status})`);
      return NextResponse.json({ success: true, result: FALLBACK_PHOTO_URL, is_photo_private: true });
    }

    const isPhotoAvailable = responseBodyText && responseBodyText.startsWith('http');
    console.log(`A foto está disponível? ${isPhotoAvailable ? "SIM" : "NÃO"}`);
    
    return NextResponse.json({ 
      success: true,
      result: isPhotoAvailable ? responseBodyText : FALLBACK_PHOTO_URL, 
      is_photo_private: !isPhotoAvailable,
    });

  } catch (err: any) {
    console.error("Ocorreu um erro dentro do bloco try...catch:", err);
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
