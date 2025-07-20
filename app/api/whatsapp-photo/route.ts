import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // JSON-default de retorno em caso de falha da API externa
  const fallbackPayload = {
    success: true,
    result:
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    is_photo_private: true,
  }

  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Número de telefone é obrigatório" },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        },
      )
    }

    // --- MODIFICATION START ---
    // The old logic incorrectly assumed a number was from Brazil.
    // This new logic just cleans the number provided by the frontend.
    const fullNumber = String(phone).replace(/[^0-9]/g, "")

    if (fullNumber.length < 10) {
      return NextResponse.json(
        { success: false, error: "Número de telefone inválido ou muito curto" },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        },
      )
    }
    // --- MODIFICATION END ---

    const response = await fetch(
      `https://primary-production-aac6.up.railway.app/webhook/request_photo?tel=${fullNumber}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Origin: "https://whatspy.chat",
        },
        signal: AbortSignal.timeout?.(10_000),
      },
    )

    if (!response.ok) {
      console.error("API externa retornou status:", response.status)
      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    const data = await response.json()
    const isPhotoPrivate = !data?.link || data.link.includes("no-user-image-icon")

    return NextResponse.json(
      {
        success: true,
        result: isPhotoPrivate ? fallbackPayload.result : data.link,
        is_photo_private: isPhotoPrivate,
      },
      {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    )
  } catch (err) {
    console.error("Erro no webhook WhatsApp:", err)
    return NextResponse.json(fallbackPayload, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    })
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
  })
}
