// app/api/whatsapp-photo/route.ts

import { type NextRequest, NextResponse } from "next/server"

// Constantes de configuração da API para fácil manutenção
const API_ENDPOINT = "https://whatsapp-data.p.rapidapi.com/wspicture";
const API_HOST = "whatsapp-data.p.rapidapi.com";
const FALLBACK_PHOTO_URL = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

export async function POST(request: NextRequest) {
  const rapidApiKey = process.env.RAPIDAPI_KEY;

  // Verificação de segurança: Garante que a chave da API está configurada no servidor
  if (!rapidApiKey) {
    console.error("ERRO CRÍTICO: A variável RAPIDAPI_KEY não foi encontrada nas variáveis de ambiente!");
    return NextResponse.json({ success: false, error: "Erro de configuração no servidor" }, { status: 500 });
  }
  
  try {
    const { phone } = await request.json();

    // Validação da requisição recebida do frontend
    if (!phone) {
      return NextResponse.json({ success: false, error: "O número de telefone é obrigatório" }, { status: 400 });
    }
    const fullNumber = String(phone).replace(/[^0-9]/g, "");
    if (fullNumber.length < 10) {
      return NextResponse.json({ success: false, error: "Número de telefone inválido ou muito curto" }, { status: 400 });
    }
    
    // Prepara e executa a chamada para a API externa
    const url = `${API_ENDPOINT}?phone=${fullNumber}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': API_HOST,
      },
      signal: AbortSignal.timeout?.(9_000), // Timeout de 25 segundos para evitar requisições presas
    };

    const response = await fetch(url, options);

    // Lida com casos onde a API externa retorna um erro (ex: 401, 403, 500)
    if (!response.ok) {
      console.error(`A API externa (${API_HOST}) retornou um erro com status: ${response.status}`);
      return NextResponse.json({ success: true, result: FALLBACK_PHOTO_URL, is_photo_private: true });
    }
    
    // Lógica crucial: lê a resposta como texto, pois a API pode retornar uma URL ou uma mensagem de erro em texto puro
    const responseBodyText = await response.text();

    // Verifica se a resposta é uma URL de imagem utilizável
    const isPhotoAvailable = responseBodyText && responseBodyText.startsWith('http');

    return NextResponse.json({ 
      success: true,
      result: isPhotoAvailable ? responseBodyText : FALLBACK_PHOTO_URL, 
      is_photo_private: !isPhotoAvailable,
    });

  } catch (err: any) {
    // Captura erros de rede, timeouts ou outras falhas inesperadas
    console.error("Ocorreu um erro inesperado na rota da API:", err);
    return NextResponse.json({ success: true, result: FALLBACK_PHOTO_URL, is_photo_private: true });
  }
}

// Função essencial para lidar com requisições de pre-flight (CORS)
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
