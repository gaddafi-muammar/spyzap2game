// app/api/location/route.ts

import { NextRequest, NextResponse } from "next/server";

// Força a rota a ser dinâmica para garantir que sempre execute no servidor a cada requisição.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // =======================================================
    //     MUDANÇA PRINCIPAL AQUI                              
    // Simplificamos a lógica. Não precisamos mais extrair o IP manualmente.
    // A ip-api.com detectará automaticamente o IP do visitante que
    // originou a requisição para o nosso servidor Vercel.
    // =======================================================
    const apiUrl = `https://ip-api.com/json`;
    
    // O fetch agora é feito do nosso servidor para a API externa.
    const apiResponse = await fetch(apiUrl, {
      // Adicionamos um cache 'no-store' para garantir que cada usuário receba sua própria localização.
      cache: 'no-store' 
    });

    if (!apiResponse.ok) {
      // Se a API externa falhar, logamos o erro e retornamos uma resposta clara.
      const errorText = await apiResponse.text();
      console.error(`A API externa respondeu com o status: ${apiResponse.status}`, errorText);
      throw new Error(`A API externa respondeu com o status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    if (data.status !== 'success') {
      console.warn('ip-api.com não conseguiu localizar o IP:', data.message);
      // Retornamos um erro claro para o frontend, em vez de um 500 genérico.
      return NextResponse.json(
        { error: 'Não foi possível determinar a localização.', details: data.message },
        { status: 404 }
      );
    }

    // Retorna os dados com sucesso para o frontend.
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro na API Route de localização:', error);
    // Este é o bloco que retorna o erro 500, agora com mais detalhes no log do servidor.
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar a localização.' },
      { status: 500 }
    );
  }
}
