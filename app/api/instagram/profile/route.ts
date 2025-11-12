// app/api/instagram/profile/route.ts

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // --- SUGESTÃO APLICADA ---
  // Verifica se a variável de ambiente da chave da API está configurada.
  // Se não estiver, retorna um erro de servidor para evitar que a aplicação
  // tente fazer uma chamada com uma chave inválida.
  if (!process.env.INSTAGRAM_RAPIDAPI_KEY) {
    console.error("ERRO CRÍTICO: A variável de ambiente INSTAGRAM_RAPIDAPI_KEY não está configurada.");
    return NextResponse.json(
      { error: "Erro de configuração interna do servidor." },
      { status: 500 }
    );
  }
  // --- FIM DA SUGESTÃO ---

  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username é obrigatório" }, { status: 400 })
    }

    const cleanUsername = username.replace("@", "").trim()
    const url = `https://instagram-scraper-api2.p.rapida pi.com/v1/info?username_or_id_or_url=${cleanUsername}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        // Agora podemos usar a chave diretamente, pois já foi validada.
        "X-RapidAPI-Key": process.env.INSTAGRAM_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "instagram-scraper-api2.p.rapidapi.com",
      },
      // Define um tempo limite de 10 segundos para a requisição.
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      // Se a resposta da API externa não for bem-sucedida (ex: 404, 401, etc.)
      console.warn(`[API Instagram] Falha ao buscar o perfil '${cleanUsername}'. Status: ${response.status}`);
      return NextResponse.json({ error: "Perfil do Instagram não encontrado ou a API externa falhou" }, { status: response.status })
    }

    const data = await response.json()

    console.log(`[API Instagram] Sucesso ao buscar o perfil: ${cleanUsername}`);

    return NextResponse.json({ data })
  } catch (error: any) {
    // Captura erros de rede, timeout, ou falhas no JSON.
    if (error.name === 'TimeoutError') {
      console.error("[API Instagram] Erro: A requisição para a RapidAPI demorou muito para responder (timeout).");
      return NextResponse.json({ error: "O serviço externo demorou muito para responder. Tente novamente." }, { status: 504 }); // Gateway Timeout
    }
    
    console.error("[API Instagram] Erro inesperado:", error)
    return NextResponse.json({ error: "Erro ao buscar dados do Instagram" }, { status: 500 })
  }
}
