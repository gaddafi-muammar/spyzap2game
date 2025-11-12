"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { User, CheckCircle } from "lucide-react"

// --- Funções Auxiliares (Mantidas, pois estão corretas) ---
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

// --- Componente da Página (Versão Final) ---
export default function TargetIdentificationPage() {
  const [step, setStep] = useState(1) // Added step management for multi-step flow
  const [instagramHandle, setInstagramHandle] = useState("")
  const [profileData, setProfileData] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0) // Added loading progress
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // --- Funções para extrair dados do perfil ---
  const getUsername = (profile: any) => profile?.data?.user?.username || "desconhecido"
  const getFollowerCount = (profile: any) => profile?.data?.user?.followers_count || 0
  const getMediaCount = (profile: any) => profile?.data?.user?.media_count || 0
  const getBiography = (profile: any) => profile?.data?.user?.biography || ""
  const getProfilePictureUrl = (profile: any) => profile?.data?.user?.profile_pic_url || ""

  // --- Lógica para buscar a imagem do perfil ---
  const fetchImage = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/instagram/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })
      if (response.ok) {
        const imageData = await response.json()
        setProfileImage(imageData.data)
      }
    } catch (e) {
      console.error("Erro ao buscar imagem do perfil:", e)
    }
  }

  // --- Lógica de busca automática ao digitar ---
  const handleInstagramChange = (value: string) => {
    setInstagramHandle(value)
    const sanitizedUser = sanitizeUsername(value)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setError("")
    setProfileData(null)
    setProfileImage(null)
    setStep(1)

    if (sanitizedUser.length < 3) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceTimer.current = setTimeout(async () => {
      const cachedProfile = getProfileFromCache(sanitizedUser)
      if (cachedProfile) {
        setProfileData(cachedProfile)
        const picUrl = getProfilePictureUrl(cachedProfile)
        if (picUrl) await fetchImage(picUrl)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/instagram/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: sanitizedUser }),
        })
        if (!response.ok) throw new Error("Perfil não encontrado ou privado.")
        const profile = await response.json()
        setProfileData(profile)
        setProfileLocalCache(sanitizedUser, profile)
        const picUrl = getProfilePictureUrl(profile)
        if (picUrl) await fetchImage(picUrl)
      } catch (err: any) {
        setError(err.message)
        setProfileData(null)
      } finally {
        setIsLoading(false)
      }
    }, 1200)
  }

  const handleContinueClick = () => {
    setStep(2)
    setLoadingProgress(0)

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 30
      })
    }, 300)

    // Complete loading after 3 seconds
    setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setStep(3)
      }, 500)
    }, 3000)
  }

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    },
    [],
  )

  const renderProfileCard = () => (
    <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-2 border-pink-500 text-black animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-left">
          {profileImage ? (
            <img
              src={profileImage || "/placeholder.svg"}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 border-2 border-pink-500"></div>
          )}
          <div>
            <p className="text-pink-600 font-bold text-sm">✓ Instagram Profile Detected</p>
            <p className="font-bold text-lg text-black">@{getUsername(profileData)}</p>
            <p className="text-gray-700 text-sm">
              {getMediaCount(profileData)} posts • {getFollowerCount(profileData)} followers
            </p>
            {getBiography(profileData) && (
              <p className="text-gray-600 text-xs mt-1 italic">{getBiography(profileData)}</p>
            )}
          </div>
        </div>
        <div className="w-6 h-6 rounded-full border-2 border-pink-500 flex items-center justify-center bg-pink-500">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  )

  const renderLoadingStep = () => (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h2 className="text-2xl font-bold text-black">Analyzing Profile...</h2>

      {renderProfileCard()}

      <div className="w-full space-y-4">
        <div className="text-sm text-gray-700 font-mono">
          <p className="text-yellow-600 font-bold">[SCANNING]</p>
          <p className="text-black">
            Cross-referencing encrypted public and private databases... ({Math.floor(loadingProgress)}%)
          </p>
        </div>

        <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>

        <div className="text-sm text-gray-700 font-mono">
          <p className="text-blue-600 font-bold">[STATUS]</p>
          <p className="text-black">Searching for connected accounts...</p>
        </div>
      </div>

      {/* Grid de fotos simuladas */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg animate-pulse"
          />
        ))}
      </div>

      <button
        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
        disabled
      >
        ANALYZING...
      </button>
    </div>
  )

  const renderResultsStep = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex items-center gap-2 text-green-600 font-bold">
        <CheckCircle size={20} />
        Analysis Complete
      </div>

      {renderProfileCard()}

      <div className="w-full space-y-4">
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded text-black">
          <p className="font-bold text-green-700">✓ Instagram account found</p>
          <p className="text-sm text-gray-700">Last access: 3h ago</p>
        </div>

        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded text-black">
          <p className="font-bold text-red-700">🔴 Hidden Tinder profile detected</p>
        </div>

        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-black">
          <p className="font-bold text-blue-700">💬 Private messages found</p>
        </div>
      </div>

      <button
        onClick={() => setStep(1)}
        className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all w-full"
      >
        Search Another Profile
      </button>
    </div>
  )

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-white">
      <main className="relative z-10 w-full max-w-lg mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-pink-500"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <h1 className="text-2xl font-bold text-black">TARGET IDENTIFICATION</h1>
          </div>
          <p className="text-gray-700">Enter the target Instagram to begin</p>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="relative w-full">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="@target_user"
                className="w-full bg-white border-2 border-gray-300 text-black pl-12 h-12 text-base rounded-lg focus:border-pink-500 focus:ring-pink-500/50"
                value={instagramHandle}
                onChange={(e) => handleInstagramChange(e.target.value)}
              />
            </div>

            <div className="w-full min-h-[120px]">
              {isLoading && (
                <div className="p-4 bg-gray-100 rounded-lg border-2 border-gray-300 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-400" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-400 rounded w-3/4" />
                      <div className="h-3 bg-gray-400 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              )}
              {!isLoading && error && <p className="text-red-600 font-semibold">{error}</p>}
              {!isLoading && profileData && renderProfileCard()}
            </div>

            {profileData && !isLoading && (
              <button
                onClick={handleContinueClick}
                className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
              >
                ➜ CONTINUE
              </button>
            )}
          </div>
        )}

        {/* Step 2: Loading */}
        {step === 2 && renderLoadingStep()}

        {/* Step 3: Results */}
        {step === 3 && renderResultsStep()}
      </main>
    </div>
  )
}
