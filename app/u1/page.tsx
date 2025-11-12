"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Camera,
  Upload,
  User,
  CheckCircle,
  Flame,
  Heart,
  MapPin,
  Phone,
  Lock,
  MessageCircle,
  ScanEye,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// --- Funções Auxiliares (reutilizadas do seu código) ---
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
    console.error("Erro ao salvar perfil no cache:", e)
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
    console.error("Erro ao ler o cache do perfil:", e)
  }
  return null
}

// --- Componente da Nova Página ---
export default function SpyFunnelPage() {
  // Estado para controlar a etapa do funil
  const [stage, setStage] = useState<'initial' | 'loading' | 'results'>('initial')

  // Estados para os dados do formulário
  const [instagramHandle, setInstagramHandle] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  // Estados para os dados da API
  const [profileData, setProfileData] = useState<any>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Estados de controle de UI
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisMessage, setAnalysisMessage] = useState("Initializing scan...")
  const [error, setError] = useState("")
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // --- Funções para extrair dados do perfil ---
  const getUsername = (profile: any) => profile?.data?.user?.username || "..."
  const getFollowerCount = (profile: any) => profile?.data?.user?.followers_count || 0
  const getMediaCount = (profile: any) => profile?.data?.user?.media_count || 0
  const getBiography = (profile: any) => profile?.data?.user?.biography || ""
  const getProfilePictureUrl = (profile: any) => profile?.data?.user?.profile_pic_url || ""

  // --- Lógica de busca de imagem (base64) ---
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

  // --- Lógica de busca de perfil do Instagram ---
  const handleInstagramChange = (value: string) => {
    setInstagramHandle(value)
    const sanitizedUser = sanitizeUsername(value)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setError("")
    setProfileData(null)
    setProfileImage(null)

    if (sanitizedUser.length < 3) return

    debounceTimer.current = setTimeout(async () => {
      setLoadingProfile(true)
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
        if (!response.ok) throw new Error("Perfil não encontrado.")
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
    }, 1000)
  }

  // --- Lógica de seleção de arquivo ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setFileName(file.name)
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(URL.createObjectURL(file))
    }
  }

  // --- Lógica da Animação de Análise ---
  const startAnalysis = () => {
    setStage('loading')
    setIsAnalyzing(true)
    let progress = 0
    const messages = [
      "Initializing secure connection...",
      "Cross-referencing encrypted public databases...",
      "Analyzing social network APIs...",
      "Decrypting hidden profiles & shadow accounts...",
      "Extracting private message logs...",
      "Identifying interaction patterns...",
      "Compiling intelligence report...",
      "Finalizing data extraction...",
    ]
    const interval = setInterval(() => {
      progress += 2
      setAnalysisProgress(progress)
      const messageIndex = Math.floor((progress / 100) * (messages.length - 1))
      setAnalysisMessage(messages[messageIndex])

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => setStage('results'), 1000)
      }
    }, 150)
  }

  // --- Renderização da Etapa 1: Formulário Inicial ---
  const renderInitialStage = () => (
    <div className="w-full max-w-2xl mx-auto space-y-12 animate-fade-in">
      {/* 1. Seção de Upload de Foto */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white flex items-center justify-center gap-3 mb-4">
          <Camera />
          Select a photo for facial analysis...
        </h2>
        <div className="relative w-full max-w-md mx-auto border-2 border-dashed border-gray-600 p-6 rounded-lg text-gray-400 flex flex-col items-center justify-center gap-3 bg-gray-800/30 hover:border-gray-500 transition-colors duration-200">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Preview" className="max-h-32 object-contain rounded-md" />
          ) : (
            <Upload size={40} className="text-gray-500" />
          )}
          <p className="text-base">{fileName ? `File selected: ${fileName}` : "Drag and drop or click to select"}</p>
          {fileName && (
            <div className="mt-2 text-green-400 flex items-center gap-2">
              <ScanEye size={20} />
              <span className="text-lg">Ready to scan!</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Seção de Identificação do Instagram */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white flex items-center justify-center gap-3 mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ícone de alvo customizado */}
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          TARGET IDENTIFICATION: Enter the target Instagram
        </h2>
        <div className="relative w-full max-w-sm mx-auto">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="@target_user"
            className="w-full bg-gray-800/50 border-gray-700 text-white pl-10"
            value={instagramHandle}
            onChange={(e) => handleInstagramChange(e.target.value)}
          />
        </div>

        {/* Card de Resultado do Perfil */}
        {loadingProfile && <p className="text-white mt-4">Searching...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {profileData && profileImage && (
          <div className="mt-4 max-w-sm mx-auto p-4 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-lg border-2 border-green-500 text-white animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4 text-left">
                <img src={profileImage} alt="profile" className="w-14 h-14 rounded-full object-cover" />
                <div>
                  <p className="text-green-400 font-bold text-sm">Instagram Profile Detected</p>
                  <p className="font-bold text-lg">@{getUsername(profileData)}</p>
                  <p className="text-gray-300 text-sm">
                    {getMediaCount(profileData)} posts • {getFollowerCount(profileData)} followers
                  </p>
                </div>
              </div>
              <CheckCircle className="text-green-400 text-2xl" />
            </div>
            {getBiography(profileData) && (
              <p className="text-gray-300 text-sm mt-2 text-left italic">“{getBiography(profileData)}”</p>
            )}
          </div>
        )}
      </div>

      {/* 3. Botão de Continuar e Seção de Loading (se aplicável) */}
      <div className="text-center pt-4">
        {stage === 'loading' && isAnalyzing && renderLoadingSection()}

        <Button
          onClick={startAnalysis}
          disabled={!imagePreviewUrl || !profileData || isAnalyzing}
          className="mt-6 px-10 py-6 text-lg font-bold uppercase bg-gradient-to-r from-pink-500 to-red-600 text-white shadow-lg hover:from-pink-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="mr-2" /> {isAnalyzing ? "ANALYZING..." : "CONTINUE"}
        </Button>
      </div>
    </div>
  )

  // --- Renderização da Etapa 2: Seção de Loading ---
  const renderLoadingSection = () => (
    <div className="w-full max-w-md mx-auto mt-8 space-y-3 animate-fade-in p-4 bg-gray-800/30 rounded-lg border border-gray-700">
      <p className="text-xl font-bold text-white font-mono">
        <span className="text-green-400">[SCANNING]</span> {analysisMessage} ({analysisProgress}%)
      </p>
      <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
        <div
          className="bg-gradient-to-r from-pink-500 to-red-600 h-3 rounded-full transition-all duration-200 ease-linear"
          style={{ width: `${analysisProgress}%` }}
        ></div>
      </div>
      <p className="text-lg font-bold text-gray-300 animate-pulse mt-3 font-mono">
        <span className="text-yellow-400">[STATUS]</span> Searching for connected accounts...
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="relative w-full h-24 rounded-md overflow-hidden bg-gray-700 animate-pulse">
            {/* Placeholder para imagens que ciclam */}
          </div>
        ))}
      </div>
    </div>
  )

  // --- Renderização da Etapa 3: Resultados Finais ---
  const renderResultsStage = () => (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in text-white">
      {/* Resumo das Detecções */}
      <div className="grid gap-3 text-left">
        <p className="text-lg text-green-400 flex items-center gap-2"><CheckCircle /> Instagram account found. Last access: 3h ago.</p>
        <p className="text-lg text-red-400 flex items-center gap-2"><Flame /> Hidden Tinder profile detected.</p>
        <p className="text-lg text-blue-400 flex items-center gap-2"><MessageCircle /> Private messages found.</p>
        <p className="text-lg text-pink-400 flex items-center gap-2"><Heart /> Suspicious likes identified on old posts.</p>
        <p className="text-lg text-purple-400 flex items-center gap-2"><MapPin /> Location detected: madri.</p>
        <div className="mt-2 flex items-center gap-3 p-3 bg-green-900/30 rounded-lg border border-green-700">
          <Phone className="text-green-400" size={28} />
          <div>
            <p className="text-lg text-green-400 font-bold">PHONE FOUND</p>
            <p className="text-sm text-gray-300">+351 919388230</p>
          </div>
        </div>
      </div>

      {/* System Log */}
      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 font-mono text-left">
        <p><span className="text-green-400">[SYSTEM_LOG]</span> New activity detected:</p>
        <p className="ml-4"><span className="text-blue-400">[INSTAGRAM]</span> @alexia_30 liked your photo.</p>
        <p className="ml-4"><span className="text-blue-400">[INSTAGRAM]</span> New message from @izes.</p>
      </div>

      {/* Notificações Falsas */}
      <div className="space-y-3 text-left">
        {/* Notificações individuais aqui... */}
      </div>

      {/* Curtidas Interceptadas */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          <span className="text-red-400">INTERCEPTED:</span> Suspicious Likes from {instagramHandle}
        </h2>
        <div className="space-y-6">
          {/* Imagem 1 */}
          <div className="bg-gray-800/40 p-3 rounded-lg">
            <div className="relative w-full h-64 rounded-md overflow-hidden">
              <img src="/images/liked-photo-1.jpeg" alt="Liked Photo 1" className="w-full h-full object-cover filter blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50"><Lock size={48} /></div>
            </div>
            <div className="flex items-center gap-2 mt-2"><Heart size={16} className="text-pink-400" /><span className="text-sm">1.2K likes</span></div>
            <div className="flex items-center gap-3 mt-2">
              <img src={profileImage || ""} alt="User" className="w-8 h-8 rounded-full object-cover" />
              <p className="text-sm"><b>{instagramHandle}</b> “That drink looks great! Miss a hangout like that.”</p>
            </div>
          </div>
          {/* Adicione mais imagens aqui seguindo o mesmo padrão */}
        </div>
      </div>

      <div className="text-center pt-8">
        <Button className="px-10 py-6 text-lg font-bold uppercase bg-gradient-to-r from-pink-500 to-red-600 text-white shadow-lg hover:from-pink-600 hover:to-red-700">
          SEE MORE
        </Button>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#1a1a2e]">
      {/* Background com gradiente e pontos */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] opacity-80"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <main className="relative z-10 w-full">
        {stage !== 'results' && renderInitialStage()}
        {stage === 'results' && renderResultsStage()}
      </main>
    </div>
  )
}
