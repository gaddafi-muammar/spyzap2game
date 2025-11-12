"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"

// --- Suas funções auxiliares (mantidas) ---
const sanitizeUsername = (username: string): string => {
  let u = (username || "").trim()
  if (u.startsWith("@")) u = u.slice(1)
  u = u.toLowerCase()
  return u.replace(/[^a-z0-9._]/g, "")
}

const setProfileLocalCache = (user: string, profile: any) => {
  if (!user || !profile) return
  try {
    const key = "igProfileCacheV1"
    const cache = JSON.parse(localStorage.getItem(key) || "{}") || {}
    // Armazena o objeto 'profile' diretamente
    cache[user] = { profile, ts: Date.now() }
    localStorage.setItem(key, JSON.stringify(cache))
  } catch (e) {
    console.error("[v0] Erro ao salvar perfil no cache:", e)
  }
}

const getProfileFromCache = (user: string): any | null => {
  try {
    const key = "igProfileCacheV1"
    const cache = JSON.parse(localStorage.getItem(key) || "{}") || {}
    if (cache[user] && cache[user].profile) {
      return cache[user].profile
    }
  } catch (e) {
    console.error("[v0] Erro ao ler o cache do perfil:", e)
  }
  return null
}

// --- Componente da Página com Design e Lógica Corrigidos ---
export default function TargetIdentificationPageV2() {
  const [instagramHandle, setInstagramHandle] = useState("")
  const [profileData, setProfileData] = useState<any>(null)
  // [CORREÇÃO 1] Armazenaremos a URL do proxy, não a imagem em base64
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // --- Lógica de busca automática ---
  const handleInstagramChange = (value: string) => {
    setInstagramHandle(value)
    const sanitizedUser = sanitizeUsername(value)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setError("")
    setProfileData(null)
    setProfileImageUrl(null)

    if (sanitizedUser.length < 3) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceTimer.current = setTimeout(async () => {
      const cachedProfile = getProfileFromCache(sanitizedUser)
      if (cachedProfile) {
        setProfileData(cachedProfile)
        if (cachedProfile.profile_pic_url) {
          const proxyUrl = `/api/instagram/image?url=${encodeURIComponent(cachedProfile.profile_pic_url)}`
          setProfileImageUrl(proxyUrl)
        }
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/instagram/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: sanitizedUser }),
        })
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Perfil não encontrado ou privado.")
        }
        
        // [CORREÇÃO 2] Acessa os dados de 'result.profile'
        const profile = result.profile
        setProfileData(profile)
        setProfileLocalCache(sanitizedUser, profile)

        // [CORREÇÃO 3] Cria a URL do proxy para o <img>
        if (profile.profile_pic_url) {
          const proxyUrl = `/api/instagram/image?url=${encodeURIComponent(profile.profile_pic_url)}`
          setProfileImageUrl(proxyUrl)
        }

      } catch (err: any) {
        setError(err.message)
        setProfileData(null)
      } finally {
        setIsLoading(false)
      }
    }, 1200)
  }
  
  useEffect(() => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }, [])

  const renderLoadingCard = () => (
    <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-400 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-left">
          <div className="w-14 h-14 rounded-full bg-pink-200"></div>
          <div>
            <p className="text-pink-600 font-bold text-sm">✓ Instagram Profile Detected</p>
            <p className="font-bold text-lg text-black">@desconhecido</p>
            <p className="text-gray-600 text-sm">0 posts • 0 followers</p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center opacity-50">
           <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
      </div>
    </div>
  );

  const renderProfileCard = () => (
    <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-400 text-black animate-fade-in">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-left">
                {profileImageUrl ? (
                    <img src={profileImageUrl} alt="profile" className="w-14 h-14 rounded-full object-cover" />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-300"></div>
                )}
                <div>
                    <p className="text-pink-600 font-bold text-sm">✓ Instagram Profile Detected</p>
                    {/* Acessa os dados diretamente do objeto 'profileData' */}
                    <p className="font-bold text-lg text-black">@{profileData.username}</p>
                    <p className="text-gray-600 text-sm">{profileData.media_count} posts • {profileData.follower_count} followers</p>
                </div>
            </div>
            <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
        </div>
    </div>
);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white">
      <main className="relative z-10 w-full max-w-md mx-auto text-center space-y-8">
        <div className="space-y-2">
            <div className="flex items-center justify-center gap-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
                <h1 className="text-2xl font-bold text-black tracking-wide">TARGET IDENTIFICATION</h1>
            </div>
            <p className="text-gray-600">Enter the target Instagram to begin</p>
        </div>

        <div className="relative w-full">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="madsonhenry"
            className="w-full bg-white border-2 border-black/20 text-black pl-12 h-14 text-base rounded-lg focus:border-pink-500 focus:ring-pink-500/50 shadow-inner"
            value={instagramHandle}
            onChange={(e) => handleInstagramChange(e.target.value)}
          />
        </div>

        <div className="w-full min-h-[96px]">
          {isLoading && renderLoadingCard()}
          {!isLoading && error && <p className="text-red-600 font-semibold">{error}</p>}
          {!isLoading && profileData && renderProfileCard()}
        </div>

        <button
            disabled={!profileData || isLoading}
            className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
            ➜ CONTINUE..
        </button>
      </main>
    </div>
  )
}
