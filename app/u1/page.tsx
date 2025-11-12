"use client"

import type React from "react"

import { useState } from "react"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

// --- Funções Auxiliares do SpySystem ---
// Sanitiza o nome de usuário, removendo caracteres indesejados e o "@"
const sanitizeUsername = (username: string): string => {
  let u = (username || "").trim()
  if (u.startsWith("@")) u = u.slice(1)
  u = u.toLowerCase()
  return u.replace(/[^a-z0-9._]/g, "")
}

// Salva os dados do perfil no cache do navegador (localStorage)
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

// Recupera os dados do perfil do cache do navegador
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
// --- Fim das Funções Auxiliares ---

export default function UpsellPage() {
  const [instagramHandle, setInstagramHandle] = useState("")
  const [profileData, setProfileData] = useState<any>(null) // Mudei para 'any' para flexibilidade
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFetchInstagram = async (e: React.FormEvent) => {
    e.preventDefault()

    const sanitizedUser = sanitizeUsername(instagramHandle)

    if (!sanitizedUser) {
      setError("Por favor, insira um @Instagram válido")
      return
    }

    setLoading(true)
    setError("")
    setProfileData(null)

    // 1. Tenta buscar do cache primeiro
    const cachedProfile = getProfileFromCache(sanitizedUser)
    if (cachedProfile) {
      setProfileData(cachedProfile)
      setLoading(false)
      return
    }

    // 2. Se não estiver no cache, busca na API
    try {
      const profileResponse = await fetch("/api/instagram/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: sanitizedUser }),
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        throw new Error(errorData.message || "Erro ao buscar perfil")
      }
      const profile = await profileResponse.json()

      console.log("[v0] Dados do perfil recebidos:", profile)
      setProfileData(profile)

      // 3. Salva o resultado no cache para futuras buscas
      setProfileLocalCache(sanitizedUser, profile)
    } catch (err: any) {
      setError("Erro ao buscar dados do Instagram. Verifique o @ e tente novamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // --- Funções para extrair dados do objeto de perfil de forma segura ---
  const getUsername = (profile: any) =>
    profile?.data?.username || profile?.data?.user?.username || "desconhecido"
  const getFollowerCount = (profile: any) =>
    profile?.data?.follower_count || profile?.data?.followers_count || profile?.data?.user?.followers_count || 0
  const getMediaCount = (profile: any) =>
    profile?.data?.media_count || profile?.data?.posts_count || profile?.data?.user?.media_count || 0
  const getBiography = (profile: any) => profile?.data?.biography || profile?.data?.user?.biography || ""
  const getProfilePictureUrl = (profile: any) =>
    profile?.data?.profile_picture_url || profile?.data?.picture_url || profile?.data?.user?.profile_pic_url || ""

  return (
    <>
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />
      <Script id="hotmart-init" strategy="afterInteractive">
        {`
          if (typeof checkoutElements !== 'undefined') {
            checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel')
          }
        `}
      </Script>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Parabéns! Sua compra está sendo finalizada</h1>
          </div>

          {/* Warning Section */}
          <Card className="bg-red-50 border-red-200 mb-8 p-4">
            <p className="text-red-700 font-semibold text-center">
              ⚠️ Por favor, não feche esta página ou você pode perder toda a verdade.
            </p>
          </Card>

          {/* Main Content */}
          <Card className="mb-8 p-8 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Você gostaria de recuperar conversas, fotos e vídeos que foram deletados do celular?
            </h2>

            <p className="text-gray-700 mb-4 text-center">
              Você pode restaurar todas as mensagens deletadas, fotos e vídeos dos últimos 90 dias, dando a você acesso
              a tudo o que estava oculto. Esta restauração é realizada usando
              <span className="font-bold"> inteligência artificial</span>, que reconstrói arquivos contendo conteúdo
              sensível.
            </p>

            <p className="text-gray-600 mb-8 text-center">
              A recuperação de arquivos perdidos é um processo intensivo em dados, é por isso que cobramos uma pequena
              taxa para quem deseja acesso a todos os segredos anteriormente deletados.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📱 Conecte seu Instagram para continuar:</h3>

              <form onSubmit={handleFetchInstagram} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="@seu_instagram"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                    {loading ? "Buscando..." : "Conectar"}
                  </Button>
                </div>
              </form>

              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

              {/* --- Bloco de Exibição do Perfil Atualizado --- */}
              {profileData && (
                <div className="mt-6 p-4 bg-gray-900 rounded-lg border-2 border-green-500 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getProfilePictureUrl(profileData) && (
                        <img
                          src={getProfilePictureUrl(profileData)}
                          alt="profile"
                          className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-green-400 font-bold text-sm mb-1">Instagram Profile Detected</p>
                        <p className="font-bold text-white text-lg">@{getUsername(profileData)}</p>
                        <p className="text-gray-300 text-sm mt-1">
                          {getMediaCount(profileData)} posts • {getFollowerCount(profileData)} followers
                        </p>
                        {getBiography(profileData) && (
                          <p className="text-gray-400 text-sm mt-2 italic">"{getBiography(profileData)}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-green-400 text-3xl font-bold flex-shrink-0">✓</div>
                  </div>
                </div>
              )}
              {/* --- Fim do Bloco de Exibição --- */}
            </div>

            {/* Bonuses Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-blue-600 mb-4">Bônus exclusivos inclusos gratuitamente:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <div>
                    <p className="font-semibold">Recuperação com Prioridade</p>
                    <p className="text-sm text-gray-600">
                      Seus arquivos são processados com prioridade para resultados mais rápidos
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <div>
                    <p className="font-semibold">Suporte 24h</p>
                    <p className="text-sm text-gray-600">Suporte dedicado para qualquer dúvida sobre sua recuperação</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <div>
                    <p className="font-semibold">Garantia de Segurança de Dados</p>
                    <p className="text-sm text-gray-600">
                      Todos os arquivos restaurados são criptografados e deletados de nossos servidores após download
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <div>
                    <p className="font-semibold">Relatório Detalhado de Recuperação</p>
                    <p className="text-sm text-gray-600">
                      Você recebe um relatório completo com tudo o que foi recuperado
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 font-bold">✓</span>
                  <div>
                    <p className="font-semibold">Desconto em Recuperação Futura</p>
                    <p className="text-sm text-gray-600">
                      Receba um cupom de desconto para sua próxima solicitação de recuperação
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </Card>

          {/* Hotmart Widget */}
          <div className="mb-8">
            <div id="hotmart-sales-funnel"></div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">Clique no botão acima para receber seus arquivos restaurados.</p>
          </div>
        </div>
      </div>
    </>
  )
}
