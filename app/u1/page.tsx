"use client"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { User, CheckCircle, Heart, MessageCircle, Lock } from "lucide-react"
import Script from "next/script"


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

// --- Componente da Página com Fluxo Completo ---
export default function TargetIdentificationFlowPage() {
  const [step, setStep] = useState(1) 
  
  // --- [CORREÇÃO APLICADA AQUI] ---
  // Garante que o estado inicial é uma string vazia (""), sem espaços.
  const [instagramHandle, setInstagramHandle] = useState("")
  
  const [profileData, setProfileData] = useState<any>(null)
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  
  useEffect(() => {
    if (step === 3) {
      if (typeof (window as any).checkoutElements !== 'undefined') {
        try {
          (window as any).checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
        } catch (e) {
            console.error("Failed to mount Hotmart widget:", e);
        }
      }
    }
  }, [step]);

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
        const profile = result.profile
        setProfileData(profile)
        setProfileLocalCache(sanitizedUser, profile)
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

  const handleContinueClick = () => {
    setStep(2)
    setLoadingProgress(0)
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + Math.random() * 20
      })
    }, 400)
    setTimeout(() => {
      setLoadingProgress(100)
      setTimeout(() => {
        setStep(3)
      }, 500)
    }, 4000)
  }

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
  }, [])

  const renderProfileCard = (profile: any) => (
    <div
        className="p-4 rounded-lg border-2 border-green-500/50 text-white animate-fade-in relative overflow-hidden"
        style={{
        backgroundColor: "rgba(26, 44, 36, 0.9)",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "15px 15px",
        }}
    >
        <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 text-left">
            {profileImageUrl ? (
            <img
                src={profileImageUrl}
                alt="profile"
                className="w-14 h-14 rounded-full object-cover filter grayscale"
            />
            ) : (
            <div className="w-14 h-14 rounded-full bg-gray-700 animate-pulse"></div>
            )}
            <div>
            <p className="text-green-400 font-bold text-sm">Instagram Profile Detected</p>
            <p className="font-bold text-lg text-white">@{profile.username}</p>
            <p className="text-gray-400 text-sm">
                {profile.media_count} posts • {profile.follower_count} followers
            </p>
            </div>
        </div>
        <div className="w-7 h-7 rounded-full border-2 border-green-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
            </svg>
        </div>
        </div>
        {profile.biography && (
        <div className="border-t border-green-500/20 mt-3 pt-3 text-left">
            <p className="text-gray-300 text-sm">{profile.biography}</p>
        </div>
        )}
    </div>
  );

  const renderInitialStep = () => (
    <>
      <div className="space-y-6">
        <div className="text-center space-y-2">
            <p className="text-lg text-gray-800">
                <span className="font-bold text-red-600">ATTENTION!</span> Our system has identified that many of the new numbers saved on WhatsApp came directly from Instagram.
            </p>
            <p className="text-gray-600">
                Enter the @Instagram username below and perform a quick search.
            </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" /><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>
          <h1 className="text-2xl font-bold text-black tracking-wide">TARGET IDENTIFICATION</h1>
        </div>
      </div>
      
      <div className="relative w-full">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="username"
          autoComplete="off"
          className="w-full bg-white border-2 border-black/20 text-black pl-12 h-14 text-base rounded-lg focus:border-pink-500 focus:ring-pink-500/50 shadow-inner"
          value={instagramHandle}
          onChange={(e) => handleInstagramChange(e.target.value)}
        />
      </div>
      <div className="w-full min-h-[140px]">
        {isLoading && (
            <div className="p-4 bg-pink-50 rounded-lg border-2 border-pink-400 animate-pulse">
                <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-full bg-pink-200"></div><div className="flex-1 space-y-2"><div className="h-4 bg-pink-200 rounded w-3/4"></div><div className="h-3 bg-pink-200 rounded w-1/2"></div></div></div>
            </div>
        )}
        {!isLoading && error && <p className="text-red-600 font-semibold">{error}</p>}
        {!isLoading && profileData && renderProfileCard(profileData)}
      </div>
      <button
        onClick={handleContinueClick}
        disabled={!profileData || isLoading}
        className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        ➜ CONTINUE
      </button>
    </>
  );

  const renderLoadingStep = () => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-black">Analyzing Profile...</h2>
        {profileData && renderProfileCard(profileData)}
        <div className="w-full space-y-3">
            <p className="font-mono text-sm text-gray-700">[SCANNING] Cross-referencing databases... ({Math.floor(loadingProgress)}%)</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-gradient-to-r from-pink-500 to-purple-600 h-2.5 rounded-full" style={{ width: `${loadingProgress}%` }}></div></div>
        </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xl"><CheckCircle size={24} /> Analysis Complete</div>
      {profileData && renderProfileCard(profileData)}
      <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg font-mono text-sm text-left">
          <p><span className="text-green-600 font-bold">[SYSTEM_LOG]</span> New activity detected:</p>
          <p className="ml-4"><span className="text-blue-600">[INSTAGRAM]</span> @alexis_30 liked your photo.</p>
          <p className="ml-4"><span className="text-blue-600">[INSTAGRAM]</span> New message from @izes.</p>
      </div>
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><img src="/images/female/perfil1.jpg" alt="User Avatar" className="w-10 h-10 rounded-full object-cover"/><div className="flex-1 text-sm"><p className="text-gray-800"><span className="font-semibold">@alexis_30</span> liked your photo</p><p className="text-gray-500 text-xs">1 minutes ago</p></div><Heart className="text-pink-500" size={18} /></div>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><img src="/images/female/perfil2.jpg" alt="User Avatar" className="w-10 h-10 rounded-full object-cover"/><div className="flex-1 text-sm"><p className="text-gray-800"><span className="font-semibold">@jessy_nutty</span> liked your photo</p><p className="text-gray-500 text-xs">2 minutes ago</p></div><Heart className="text-pink-500" size={18} /></div>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><img src="/images/female/perfil3.jpg" alt="Message Avatar" className="w-10 h-10 rounded-full object-cover"/><div className="flex-1 text-sm"><p className="text-gray-800"><span className="font-semibold">@izes</span> sent you a message</p><p className="text-gray-500 text-xs">5 minutes ago</p></div><MessageCircle className="text-blue-500" size={18} /></div>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><img src={profileImageUrl || ""} alt="Target Avatar" className="w-10 h-10 rounded-full object-cover"/><div className="flex-1 text-sm"><p className="text-gray-800"><span className="font-semibold">{instagramHandle}</span> is typing...</p><p className="text-gray-500 text-xs">Just now</p></div><span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse ml-auto"></span></div>
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><img src={profileImageUrl || ""} alt="Target Avatar" className="w-10 h-10 rounded-full object-cover"/><div className="flex-1 text-sm"><p className="text-gray-800"><span className="font-semibold">{instagramHandle}</span> sent a new message.</p><p className="text-gray-500 text-xs">1 minute ago</p></div><MessageCircle className="text-blue-500 ml-auto" size={18} /></div>
      </div>
      <div className="space-y-5 text-left">
        <h2 className="text-xl font-bold text-black text-center"><span className="text-red-600">INTERCEPTED:</span> Suspicious Likes from {instagramHandle}</h2>
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><div className="relative w-full h-56 rounded-md overflow-hidden"><img src="/images/liked-photo-3.jpeg" alt="Liked Photo 3" className="w-full h-full object-cover filter blur-sm"/><div className="absolute inset-0 flex items-center justify-center bg-black/40"><Lock size={40} className="text-white"/></div></div><div className="flex items-center gap-2 mt-2"><Heart size={16} className="text-pink-500" /><span className="text-sm text-gray-600">1.2K likes</span></div><div className="flex items-center gap-3 mt-2"><img src={profileImageUrl || ""} alt="User" className="w-8 h-8 rounded-full object-cover"/><p className="text-sm text-gray-800"><b>{instagramHandle}</b> “Wow, what a beautiful little doll🥰”</p></div></div>
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"><div className="relative w-full h-56 rounded-md overflow-hidden"><img src="/images/liked-story3.jpg" alt="Liked Story 3" className="w-full h-full object-cover filter blur-sm"/><div className="absolute inset-0 flex items-center justify-center bg-black/40"><Lock size={40} className="text-white"/></div></div><div className="flex items-center gap-2 mt-2"><Heart size={16} className="text-pink-500" /><span className="text-sm text-gray-600">876 likes</span></div><div className="flex items-center gap-3 mt-2"><img src={profileImageUrl || ""} alt="User" className="w-8 h-8 rounded-full object-cover"/><p className="text-sm text-gray-800"><b>{instagramHandle}</b> "🫣😏"</p></div></div>
      </div>
       <p className="text-center text-gray-700 font-semibold mt-8 mb-2 px-4">
        Click the button below and unlock the full Instagram report, gain access to all conversations and liked photos
      </p>
      <div id="hotmart-sales-funnel" className="w-full pt-4"></div>
    </div>
  );

  return (
    <>
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-white pt-12">
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center p-2 font-bold text-sm shadow-lg z-20">
            <span>Attention: do not close this page, </span>
            <span className="text-yellow-300">Your payment is still being processed.</span>
        </div>
        <main className="relative z-10 w-full max-w-md mx-auto text-center space-y-8">
          {step === 1 && renderInitialStep()}
          {step === 2 && renderLoadingStep()}
          {step === 3 && renderResultsStep()}
        </main>
      </div>
    </>
  )
}
