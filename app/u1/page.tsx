"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"

// --- Funções Auxiliares (As suas funções estão corretas e foram mantidas) ---
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
    console.log("[v0] Perfil do Instagram salvo em cache para:", user)
  } catch (e) {
    console.error("[v0] Erro ao salvar perfil no cache:", e)
  }
}

const getProfileFromCache = (user: string): any | null => {
  try {
    const key = "igProfileCacheV1"
    const cache = JSON.parse(localStorage.getItem(key) || "{}") || {}
    if (cache[user] && cache[user].profile) {
      console.log("[v0] Perfil encontrado no cache para:", user)
      return cache[user].profile
    }
  } catch (e) {
    console.error("[v0] Erro ao ler o cache do perfil:", e)
  }
  return null
}

// --- Componente da Nova Página (Substitui UpsellPage) ---
export default function NewUpsellPage() {
  const [instagramHandle, setInstagramHandle] = useState("")
  const [profileData, setProfileData] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [error, setError] = useState("")
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // --- Funções para extrair dados do perfil de forma segura ---
  // ATENÇÃO: A estrutura da API pode ser aninhada dentro de 'user'. Ajustei para refletir isso.
  const getUsername = (profile: any) => profile?.data?.user?.username || "carregando..."
  const getFollowerCount = (profile: any) => profile?.data?.user?.followers_count || 0
  const getMediaCount = (profile: any) => profile?.data?.user?.media_count || 0
  const getBiography = (profile: any) => profile?.data?.user?.biography || ""
  const getProfilePictureUrl = (profile: any) => profile?.data?.user?.profile_pic_url || ""

  // --- Lógica para buscar a imagem do perfil ---
  const fetchImage = async (imageUrl: string) => {
    try {
      const imageResponse = await fetch("/api/instagram/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })
      if (imageResponse.ok) {
        const imageData = await imageResponse.json()
        setProfileImage(imageData.data)
      }
    } catch (imageError) {
      console.error("Erro ao buscar a imagem do perfil:", imageError)
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

    if (sanitizedUser.length < 3) {
      return
    }

    setLoadingProfile(true) // Mostra o loading imediatamente

    debounceTimer.current = setTimeout(async () => {
      const cachedProfile = getProfileFromCache(sanitizedUser)
      if (cachedProfile) {
        setProfileData(cachedProfile)
        const picUrl = getProfilePictureUrl(cachedProfile)
        if (picUrl) await fetchImage(picUrl)
        setLoadingProfile(false)
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
        setProfileImage(null)
      } finally {
        setLoadingProfile(false)
      }
    }, 1000) // Espera 1 segundo após o usuário parar de digitar
  }

  // Limpa o timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#1a1a2e]">
      {/* Background com gradiente e pontos */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-red-900/40 opacity-90"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "25px 25px",
        }}
      ></div>

      <main className="relative z-10 w-full max-w-lg mx-auto text-center space-y-10">
        <h1 className="text-xl font-semibold text-white flex items-center justify-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-400">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          TARGET IDENTIFICATION: Enter the target Instagram
        </h1>

        <div className="relative w-full max-w-sm mx-auto">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="@target_user"
            className="w-full bg-gray-800/50 border-gray-700 text-white pl-10 h-12 text-base focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            value={instagramHandle}
            onChange={(e) => handleInstagramChange(e.target.value)}
          />
        </div>

        {/* --- Card de Resultado do Perfil --- */}
        <div className="w-full max-w-sm mx-auto h-36">
          {loadingProfile && <p className="text-white mt-4">Buscando perfil...</p>}
          {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
          
          {profileData && (
            <div className="p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg border-2 border-green-500 text-white animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 text-left">
                  {profileImage ? (
                     <img src={profileImage} alt="profile" className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-700 animate-pulse"></div>
                  )}
                  <div>
                    <p className="text-green-400 font-bold text-sm">Instagram Profile Detected</p>
                    <p className="font-bold text-lg">@{getUsername(profileData)}</p>
                    <p className="text-gray-300 text-sm">
                      {getMediaCount(profileData)} posts • {getFollowerCount(profileData)} followers
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center">
                   <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                </div>
              </div>
              {getBiography(profileData) && (
                <p className="text-gray-300 text-sm mt-2 text-left italic">
                  “{getBiography(profileData)}”
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
