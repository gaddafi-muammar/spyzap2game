"use client"
import { useState, useEffect, useCallback, useMemo } from "react" // 1. Importado o 'useMemo'
import Script from "next/script"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Zap, AlertTriangle, Flame, Lock, Camera, ChevronLeft, ChevronRight, CheckCircle, Users, MapPin, X } from "lucide-react"

// --- DEFINIÇÃO DE TIPO PARA OS DADOS DO MATCH (sem alteração) ---
interface Match {
  name: string; age: number; lastSeen: string; avatar: string; verified: boolean; identity: string; location: string; distance: string; bio: string; zodiac: string; mbti: string; passion: string; interests: string[];
}

// --- TODOS OS COMPONENTES AUXILIARES (sem alteração) ---
const PrevButton = (props: any) => { const { enabled, onClick } = props; return ( <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity z-10" onClick={onClick} disabled={!enabled}> <ChevronLeft size={20} /> </button> ) }
const NextButton = (props: any) => { const { enabled, onClick } = props; return ( <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full disabled:opacity-30 transition-opacity z-10" onClick={onClick} disabled={!enabled}> <ChevronRight size={20} /> </button> ) }
function MatchDetailModal({ match, onClose }: { match: Match; onClose: () => void }) { useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = 'unset'; }; }, []); return ( <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}> <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}> <button onClick={onClose} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 z-10"> <X size={20} /> </button> <img src={match.avatar} alt={match.name} className="w-full h-80 object-cover rounded-t-2xl" /> <div className="p-5"> <div className="flex items-center gap-2"> <h1 className="text-3xl font-bold text-gray-800">{match.name}</h1> {match.verified && <CheckCircle className="text-blue-500" fill="white" size={28} />} </div> <div className="flex flex-col gap-1 text-gray-600 mt-2 text-sm"> <div className="flex items-center gap-1.5"><Users size={16} /><p>{match.identity}</p></div> <div className="flex items-center gap-1.5"><MapPin size={16} /><p>{match.location}</p></div> <div className="flex items-center gap-1.5"><p>📍 {match.distance} away</p></div> </div> <div className="mt-6"> <h2 className="font-bold text-gray-800">About Me</h2> <p className="text-gray-600 mt-1">{match.bio}</p> </div> <div className="flex flex-wrap gap-2 mt-4 text-sm"> <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.zodiac}</span> <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.mbti}</span> <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{match.passion}</span> </div> <div className="mt-6"> <h2 className="font-bold text-gray-800">My Interests</h2> <div className="flex flex-wrap gap-2 mt-2 text-sm"> {match.interests.map(interest => ( <span key={interest} className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full">{interest}</span> ))} </div> </div> </div> <div className="sticky bottom-0 grid grid-cols-2 gap-4 bg-white p-4 border-t border-gray-200"> <button className="bg-gray-200 text-gray-800 font-bold py-3 rounded-full hover:bg-gray-300 transition-colors">Pass</button> <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity">Like</button> </div> </div> </div> ) }


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function Upsell2Page() {
  // Lógicas do Carrossel e do Timer (sem alteração)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: true })]); const [prevBtnEnabled, setPrevBtnEnabled] = useState(false); const [nextBtnEnabled, setNextBtnEnabled] = useState(false); const [selectedIndex, setSelectedIndex] = useState(0); const [scrollSnaps, setScrollSnaps] = useState<number[]>([]); const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]); const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]); const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]); const onSelect = useCallback(() => { if (!emblaApi) return; setSelectedIndex(emblaApi.selectedScrollSnap()); setPrevBtnEnabled(emblaApi.canScrollPrev()); setNextBtnEnabled(emblaApi.canScrollNext()); }, [emblaApi, setSelectedIndex]); useEffect(() => { if (!emblaApi) return; onSelect(); setScrollSnaps(emblaApi.scrollSnapList()); emblaApi.on("select", onSelect); emblaApi.on("reInit", onSelect); }, [emblaApi, setScrollSnaps, onSelect]); const [timeLeft, setTimeLeft] = useState(5 * 60); useEffect(() => { if (timeLeft === 0) return; const timer = setInterval(() => { setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); }, 1000); return () => clearInterval(timer); }, [timeLeft]); const formatTime = (seconds: number) => { const minutes = Math.floor(seconds / 60); const remainingSeconds = seconds % 60; return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`; }

  // Lógica do Modal (sem alteração)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // --- 2. NOVO ESTADO E LÓGICA PARA BUSCAR A LOCALIZAÇÃO ---
  const [userLocation, setUserLocation] = useState<string>("sua cidade"); // Inicia com um valor padrão

  useEffect(() => {
    // Função que chama a sua API de localização
    const fetchLocation = async () => {
      try {
        const response = await fetch('/api/location');
        if (!response.ok) throw new Error('API response not OK');
        
        const data = await response.json();
        if (data.city) {
          setUserLocation(data.city); // Atualiza o estado com a cidade encontrada
        }
      } catch (error) {
        console.error("Could not fetch location, using default.");
        // Em caso de erro, mantém o valor padrão "sua cidade"
      }
    };
    fetchLocation();
  }, []); // O array vazio [] garante que a busca ocorra apenas uma vez

  // --- 3. DADOS SIMULADOS AGORA SÃO DINÂMICOS ---
  const fakeMatches: Match[] = useMemo(() => [
    { name: "Mila", age: 26, lastSeen: "6h ago", avatar: "/images/tinder/mila.jpg", verified: true, identity: "Bisexual", location: `Lives in ${userLocation}`, distance: "2 km", bio: "Part dreamer, part doer, all about good vibes. Ready to make some memories?", zodiac: "Virgo", mbti: "KU", passion: "Coffee", interests: ["Hiking", "Green Living", "Live Music", "Pottery"] },
    { name: "John", age: 25, lastSeen: "4h ago", avatar: "/images/tinder/john.jpg", verified: true, identity: "Bisexual", location: `Lives in ${userLocation}`, distance: "2 km", bio: "Half adrenaline junkie, half cozy blanket enthusiast. What’s your vibe?", zodiac: "Leo", mbti: "BU", passion: "Fitness", interests: ["Meditation", "Books", "Wine", "Music"] },
    { name: "Harper", age: 21, lastSeen: "3h ago", avatar: "/images/tinder/harper.jpg", verified: false, identity: "Woman", location: `Lives in ${userLocation}`, distance: "5 km", bio: "Just a girl who loves sunsets and long walks on the beach. Looking for someone to share adventures with.", zodiac: "Leo", mbti: "UVA", passion: "Yoga", interests: ["Travel", "Photography", "Podcasts"] },
    { name: "Will", age: 23, lastSeen: "2h ago", avatar: "/images/tinder/emma.jpg", verified: true, identity: "Man", location: `Lives in ${userLocation}`, distance: "8 km", bio: "Fluent in sarcasm and movie quotes. Let's find the best pizza place in town.", zodiac: "Gemini", mbti: "OHY", passion: "Baking", interests: ["Concerts", "Netflix", "Dogs"] },
  ], [userLocation]); // Recalcula estes dados sempre que 'userLocation' mudar
  
  const censoredPhotos = ["/images/censored/photo1.jpg", "/images/censored/photo2.jpg", "/images/censored/photo3.jpg", "/images/censored/photo4.jpg"];

  // LÓGICA DA HOTMART (sem alteração)
  useEffect(() => {
    if (typeof (window as any).checkoutElements !== "undefined") {
      try { (window as any).checkoutElements.init("salesFunnel").mount("#hotmart-sales-funnel"); }
      catch (e) { console.error("Failed to mount Hotmart widget:", e); }
    }
  }, []);

  return (
    <>
      <Script src="https://checkout.hotmart.com/lib/hotmart-checkout-elements.js" strategy="afterInteractive" />

      {selectedMatch && <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <main className="w-full max-w-md mx-auto space-y-4">
          
          {/* O restante do JSX é exatamente o mesmo que você já tinha */}
          <div className="bg-red-600 text-white p-3 rounded-lg shadow-lg flex items-center gap-3"><Zap size={24} /><div><h1 className="font-bold text-base">PROFILE FOUND - THEY ARE ACTIVE ON TINDER</h1><p className="text-xs text-red-200">Last seen: <span className="font-semibold">Online now</span></p></div></div>
          <div className="bg-orange-500 text-white p-3 rounded-lg shadow-lg flex items-center gap-3"><AlertTriangle size={24} /><p className="text-sm font-semibold"><span className="font-bold">ATTENTION: ACTIVE PROFILE FOUND!</span> We confirm this number is linked to an ACTIVE Tinder profile. Latest usage records detected in {userLocation}.</p></div>
          <div className="grid grid-cols-4 gap-3 text-center"><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-red-600">6</p><p className="text-xs text-gray-500 font-semibold">MATCHES (7 DAYS)</p></div><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-orange-500">30</p><p className="text-xs text-gray-500 font-semibold">LIKES (7 DAYS)</p></div><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-purple-600">4</p><p className="text-xs text-gray-500 font-semibold">ACTIVE CHATS</p></div><div className="bg-white p-3 rounded-lg shadow-md"><p className="text-2xl font-bold text-gray-800">18h</p><p className="text-xs text-gray-500 font-semibold">LAST ACTIVE</p></div></div>
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-5 rounded-lg shadow-2xl"><div className="flex items-center gap-2 mb-2"><Flame className="text-orange-400" size={20} /><h2 className="text-lg font-bold">RECENT MATCHES FOUND</h2></div><p className="text-sm text-gray-400 mb-5">Tap on a match to view more information</p><div className="space-y-4">{fakeMatches.map((match, index) => (<div key={index} onClick={() => setSelectedMatch(match)} className="flex items-center gap-4 bg-slate-700/50 p-3 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"><img src={match.avatar} alt={match.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-600" /><div className="flex-grow"><p className="font-bold">{match.name}, {match.age}</p><p className="text-xs text-gray-400">Last seen: {match.lastSeen}</p><p className="text-xs font-semibold text-green-400">Active chat: frequently online</p></div><div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div></div>))}</div></div>
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 text-white p-5 rounded-lg shadow-2xl"><div className="flex items-center gap-2"><Camera className="text-slate-300" size={20} /><h2 className="text-lg font-bold">CENSORED PHOTOS</h2></div><p className="text-sm text-gray-400 mb-4">See all their profile photos (including the ones you've never seen)</p><div className="overflow-hidden relative" ref={emblaRef}><div className="flex">{censoredPhotos.map((src, index) => (<div className="relative flex-[0_0_100%] aspect-video bg-gray-700 rounded-lg overflow-hidden" key={index}><img src={src} className="w-full h-full object-cover filter blur-md" alt="Censored content"/><div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white"><Lock size={32} /><span className="font-bold mt-1 text-sm tracking-widest">BLOCKED</span></div></div>))}</div><PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} /><NextButton onClick={scrollNext} enabled={nextBtnEnabled} /></div><div className="flex justify-center items-center mt-4 gap-2">{scrollSnaps.map((_, index) => (<button key={index} onClick={() => scrollTo(index)} className={`w-2 h-2 rounded-full transition-colors ${index === selectedIndex ? 'bg-white' : 'bg-slate-600'}`}/>))}</div></div>
          <div className="bg-white p-5 rounded-lg shadow-xl text-center"><div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-cyan-500 flex items-center justify-center mb-4"><Lock className="text-white" size={32} /></div><h2 className="text-xl font-bold text-gray-800"><span className="text-yellow-600">🔓</span> UNLOCK COMPLETE REPORT</h2><p className="text-gray-600 mt-1">Get instant access to the full report with uncensored photos and complete conversation history.</p><div className="bg-red-100 border-2 border-red-500 text-red-800 p-4 rounded-lg mt-5"><div className="flex items-center justify-center gap-2"><AlertTriangle className="text-red-600" /><h3 className="font-bold">THE REPORT WILL BE DELETED IN:</h3></div><p className="text-4xl font-mono font-bold my-1">{formatTime(timeLeft)}</p><p className="text-xs text-red-700">After the time expires, this report will be permanently deleted for privacy reasons. This offer cannot be recovered at a later date.</p></div><div id="hotmart-sales-funnel" className="w-full pt-4"></div></div>
        
        </main>
      </div>
    </>
  )
}
