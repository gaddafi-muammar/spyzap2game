// app/api/location/route.ts

import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // =======================================================
    //     A CORREÇÃO FINAL ESTÁ AQUI                        
    // Mudamos a URL de volta para HTTP, pois a ip-api.com
    // não permite HTTPS no plano gratuito. Como estamos no
    // servidor, isso não causa erro de conteúdo misto.
    // =======================================================
    const apiUrl = `http://ip-api.com/json`;
    
    const apiResponse = await fetch(apiUrl, { cache: 'no-store' });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`A API externa respondeu com o status: ${apiResponse.status}`, errorText);
      throw new Error(`A API externa respondeu com o status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    if (data.status !== 'success') {
      console.warn('ip-api.com não conseguiu localizar o IP:', data.message);
      return NextResponse.json(
        { error: 'Não foi possível determinar a localização.', details: data.message },
        { status: 404 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro na API Route de localização:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao buscar a localização.' },
      { status: 500 }
    );
  }
}
