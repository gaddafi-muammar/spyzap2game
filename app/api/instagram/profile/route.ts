import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username é obrigatório" }, { status: 400 })
    }

    const cleanUsername = username.replace("@", "").trim()
    const url = `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${cleanUsername}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.INSTAGRAM_RAPIDAPI_KEY || "",
        "X-RapidAPI-Host": "instagram-scraper-api2.p.rapidapi.com",
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Perfil do Instagram não encontrado" }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Instagram API error:", error)
    return NextResponse.json({ error: "Erro ao buscar dados do Instagram" }, { status: 500 })
  }
}
