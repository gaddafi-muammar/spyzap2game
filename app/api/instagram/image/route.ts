import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL é obrigatório" }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://www.instagram.com/",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao buscar imagem" }, { status: 404 })
    }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const contentType = response.headers.get("content-type") || "image/jpeg"
    const dataUrl = `data:${contentType};base64,${base64}`

    return NextResponse.json({ data: dataUrl })
  } catch (error) {
    console.error("Image fetch error:", error)
    return NextResponse.json({ error: "Erro ao buscar imagem" }, { status: 500 })
  }
}
