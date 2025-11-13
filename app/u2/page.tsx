"use client"
import { useState, useEffect, useCallback } from "react"
import Script from "next/script"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Zap, AlertTriangle, Flame, Lock, Camera, ChevronLeft, ChevronRight } from "lucide-react"

// Componente para os botões de navegação do Carrossel
const PrevButton = (props: any) => {
  const { enabled, onClick } = props
  return (
    <button
      className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity"
      onClick={onClick}
      disabled={!enabled}
    >
      <ChevronLeft size={20} />
    </button>
  )
}

const NextButton = (props: any) => {
  const { enabled, onClick } = props
  return (
    <button
      className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity"
      onClick={onClick}
      disabled={!enabled}
    >
      <ChevronRight size={20} />
    </button>
  )
}

export default function Upsell2Page() {
  // --- LÓGICA DO CARROSSEL ---
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: true })])
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, setScrollSnaps, onSelect])

  // --- LÓGICA DO CONTADOR ---
  const [timeLeft, setTimeLeft] = useState(5 * 60) // 5 minutos em segundos

  useEffect(() => {
    if (timeLeft === 0) return
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // --- DADOS SIMULADOS (JÁ EXISTENTES) ---
  const fakeMatches = [
    // ... seus dados de matches aqui ...
    { name: "Mila", age: 22, lastSeen: "4h ago", avatar: "/images/tinder/mila.jpg" },
    { name: "Harper", age: 21, lastSeen: "3h ago", avatar: "/images/tinder/harper.jpg" },
    { name: "Emma", age: 22, lastSeen: "2h ago", avatar: "/images/tinder/emma.jpg" },
  ]

  const censoredPhotos = [
    "/images/censored/photo1.jpg",
    "/images/censored/photo2.jpg",
    "/images/censored/photo3.jpg",
    "/images/censored/photo4.jpg",
  ]

  useEffect(() => {
    if (typeof (window as any).checkoutElements !== "undefined") {
      try {
        ;(window as any).checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel")
      } catch (e) {
        console.error("Failed to mount Hotmart widget:", e)
      }
    }
  }, [])

  return (
    <>
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <main className="w-full max-w-md mx-auto space-y-4">
          {/* --- SEÇÕES EXISTENTES (TINDER) --- */}
          <div className="bg-red-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-3">
            {" "}
            <Zap size={24} />{" "}
            <div>
              {" "}
              <h1 className="font-bold text-base">PROFILE FOUND - THEY ARE ACTIVE ON TINDER</h1>{" "}
              <p className="text-xs text-red-200">
                Last seen: <span className="font-semibold">Online now</span>
              </p>{" "}
            </div>{" "}
          </div>
          <div className="bg-orange-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-3">
            {" "}
            <AlertTriangle size={24} />{" "}
            <p className="text-sm font-semibold">
              <span className="font-bold">ATTENTION: ACTIVE PROFILE FOUND!</span> We confirm this number is linked to an
              ACTIVE Tinder profile. Latest usage records detected in Lisbon.
            </p>{" "}
          </div>
          <div className="grid grid-cols-4 gap-3 text-center">
            {" "}
            <div className="bg-white p-3 rounded-lg shadow-md">
              {" "}
              <p className="text-2xl font-bold text-red-600">6</p>{" "}
              <p className="text-xs text-gray-500 font-semibold">MATCHES (7 DAYS)</p>{" "}
            </div>{" "}
            <div className="bg-white p-3 rounded-lg shadow-md">
              {" "}
              <p className="text-2xl font-bold text-orange-500">30</p>{" "}
              <p className="text-xs text-gray-500 font-semibold">LIKES (7 DAYS)</p>{" "}
            </div>{" "}
            <div className="bg-white p-3 rounded-lg shadow-md">
              {" "}
              <p className="text-2xl font-bold text-purple-600">4</p>{" "}
              <p className="text-xs text-gray-500 font-semibold">ACTIVE CHATS</p>{" "}
            </div>{" "}
            <div className="bg-white p-3 rounded-lg shadow-md">
              {" "}
              <p className="text-2xl font-bold text-gray-800">18h</p>{" "}
              <p className="text-xs text-gray-500 font-semibold">LAST ACTIVE</p>{" "}
            </div>{" "}
          </div>
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-5 rounded-lg shadow-2xl">
            {" "}
            <div className="flex items-center gap-2 mb-2">
              {" "}
              <Flame className="text-orange-400" size={20} />{" "}
              <h2 className="text-lg font-bold">RECENT MATCHES FOUND</h2>{" "}
            </div>{" "}
            <p className="text-sm text-gray-400 mb-5">Tap on a match to view more information</p>{" "}
            <div className="space-y-4">
              {" "}
              {fakeMatches.map((match, index) => (
                <div key={index} className="flex items-center gap-4 bg-slate-700/50 p-3 rounded-lg">
                  {" "}
                  <img
                    src={match.avatar || "/placeholder.svg"}
                    alt={match.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                  />{" "}
                  <div className="flex-grow">
                    {" "}
                    <p className="font-bold">
                      {match.name}, {match.age}
                    </p>{" "}
                    <p className="text-xs text-gray-400">Last seen: {match.lastSeen}</p>{" "}
                    <p className="text-xs font-semibold text-green-400">Active chat: frequently online</p>{" "}
                  </div>{" "}
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>

          {/* --- NOVA SEÇÃO: FOTOS CENSURADAS --- */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-5 rounded-lg shadow-2xl">
            <div className="flex items-center gap-2">
              <Camera className="text-slate-300" size={20} />
              <h2 className="text-lg font-bold">CENSORED PHOTOS</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              See all their profile photos (including the ones you've never seen)
            </p>

            <div className="overflow-hidden relative" ref={emblaRef}>
              <div className="flex">
                {censoredPhotos.map((src, index) => (
                  <div
                    className="relative flex-[0_0_100%] aspect-video bg-gray-700 rounded-lg overflow-hidden"
                    key={index}
                  >
                    <img
                      src={src || "/placeholder.svg"}
                      className="w-full h-full object-cover filter blur-md"
                      alt="Censored content"
                    />
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white">
                      <Lock size={32} />
                      <span className="font-bold mt-1 text-sm tracking-widest">BLOCKED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center items-center mt-4 gap-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`transition-all ${
                    index === selectedIndex ? "w-8 h-2 bg-white" : "w-2 h-2 bg-slate-500 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
          </div>

          {/* --- NOVA SEÇÃO: CHAMADA PARA AÇÃO COM CONTADOR --- */}
          <div className="bg-white p-5 rounded-lg shadow-xl text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              <span className="text-yellow-600">🔓</span> UNLOCK COMPLETE REPORT
            </h2>
            <p className="text-gray-600 mt-1">
              Get instant access to the full report with uncensored photos and complete conversation history.
            </p>

            <div className="bg-red-100 border-2 border-red-500 text-red-800 p-4 rounded-lg mt-5">
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="text-red-600" />
                <h3 className="font-bold">THE REPORT WILL BE DELETED IN:</h3>
              </div>
              <p className="text-4xl font-mono font-bold my-1">{formatTime(timeLeft)}</p>
              <p className="text-xs text-red-700">
                After the time expires, this report will be permanently deleted for privacy reasons. This offer cannot
                be recovered at a later date.
              </p>
            </div>

            {/* O botão da Hotmart será montado aqui, substituindo o botão rosa */}
            <div id="hotmart-sales-funnel"></div>
          </div>
        </main>
      </div>
    </>
  )
}
