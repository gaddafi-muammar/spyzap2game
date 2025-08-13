import { type NextRequest, NextResponse } from "next/server"

// Enhanced cache with TTL to prevent stale data and reduce API calls
interface CacheEntry {
  data: any
  timestamp: number
  ttl: number // Time to live in milliseconds
}

const phoneCache = new Map<string, CacheEntry>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours
const RATE_LIMIT_CACHE_TTL = 60 * 1000 // 1 minute for rate limited responses

let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // Minimum 1 second between requests
let consecutiveRateLimits = 0

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < entry.ttl
}

function cleanExpiredCache() {
  const now = Date.now()
  for (const [key, entry] of phoneCache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      phoneCache.delete(key)
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function POST(request: NextRequest) {
  const fallbackPayload = {
    success: true,
    result:
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    is_photo_private: true,
  }

  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json({ success: false, error: "Número de telefone é obrigatório" }, { status: 400 })
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "")
    const fullNumber = cleanPhone

    cleanExpiredCache()
    const cachedEntry = phoneCache.get(fullNumber)
    if (cachedEntry && isCacheValid(cachedEntry)) {
      console.log(`CACHE HIT: Retornando dados do cache para o número: ${fullNumber}`)
      return NextResponse.json(cachedEntry.data, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
      console.log(`Rate limiting prevention: waiting ${waitTime}ms before API call`)
      await delay(waitTime)
    }

    if (consecutiveRateLimits > 0) {
      const backoffDelay = Math.min(1000 * Math.pow(2, consecutiveRateLimits), 30000) // Max 30 seconds
      console.log(
        `Exponential backoff: waiting ${backoffDelay}ms due to ${consecutiveRateLimits} consecutive rate limits`,
      )
      await delay(backoffDelay)
    }

    lastRequestTime = Date.now()
    console.log(`CACHE MISS: Buscando dados da API para o número: ${fullNumber}`)

    const apiUrl = `https://whatsapp-data1.p.rapidapi.com/number/${fullNumber}`
    const apiOptions = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        "x-rapidapi-host": "whatsapp-data1.p.rapidapi.com",
      },
      signal: AbortSignal.timeout?.(15_000),
    }

    const response = await fetch(apiUrl, apiOptions)

    if (response.status === 429) {
      consecutiveRateLimits++
      console.error(`Rate limit hit (${consecutiveRateLimits} consecutive). Caching fallback response.`)

      // Cache the fallback response for a shorter time to retry sooner
      const rateLimitEntry: CacheEntry = {
        data: fallbackPayload,
        timestamp: Date.now(),
        ttl: RATE_LIMIT_CACHE_TTL,
      }
      phoneCache.set(fullNumber, rateLimitEntry)

      return NextResponse.json(fallbackPayload, {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      })
    }

    if (!response.ok) {
      console.error(`RapidAPI retornou um erro: ${response.status}`, await response.text())
      const errorEntry: CacheEntry = {
        data: fallbackPayload,
        timestamp: Date.now(),
        ttl: RATE_LIMIT_CACHE_TTL,
      }
      phoneCache.set(fullNumber, errorEntry)
      return NextResponse.json(fallbackPayload, { status: 200 })
    }

    consecutiveRateLimits = 0

    const data = await response.json()
    console.log("Resposta da RapidAPI:", data)

    const imageUrl = data?.profilePic // Use o campo correto: profilePic
    const isPhotoPrivate = !imageUrl || imageUrl.includes("g.gif") // A lógica de foto privada pode continuar

    const finalPayload = {
      success: true,
      result: isPhotoPrivate ? fallbackPayload.result : imageUrl, // Agora usa a variável correta
      is_photo_private: isPhotoPrivate,
    }

    const successEntry: CacheEntry = {
      data: finalPayload,
      timestamp: Date.now(),
      ttl: CACHE_TTL,
    }
    phoneCache.set(fullNumber, successEntry)

    return NextResponse.json(finalPayload, {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    })
  } catch (err) {
    console.error("Erro no handler da API:", err)
    return NextResponse.json(fallbackPayload, { status: 200 })
  }
}

// Handler para requisições OPTIONS (necessário para CORS)
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
