// 👇 COPIE E COLE ESTE CÓDIGO INTEIRO NO SEU ARQUIVO 👇

"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Download, Lock, CheckCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// A comprehensive list of countries, as seen in the example
const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸", placeholder: "(555) 123-4567" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧", placeholder: "7911 123456" },
  { code: "+33", name: "France", flag: "🇫🇷", placeholder: "6 12 34 56 78" },
  { code: "+49", name: "Germany", flag: "🇩🇪", placeholder: "1512 3456789" },
  { code: "+39", name: "Italy", flag: "🇮🇹", placeholder: "312 345 6789" },
  { code: "+34", name: "Spain", flag: "🇪🇸", placeholder: "612 34 56 78" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", placeholder: "912 345 678" },
  { code: "+52", name: "Mexico", flag: "🇲🇽", placeholder: "55 1234 5678" },
  { code: "+55", name: "Brazil", flag: "🇧🇷", placeholder: "(11) 99999-9999" },
  { code: "+54", name: "Argentina", flag: "🇦🇷", placeholder: "11 1234-5678" },
  { code: "+56", name: "Chile", flag: "🇨🇱", placeholder: "9 1234 5678" },
  { code: "+57", name: "Colombia", flag: "🇨🇴", placeholder: "300 1234567" },
  { code: "+51", name: "Peru", flag: "🇵🇪", placeholder: "912 345 678" },
  { code: "+58", name: "Venezuela", flag: "🇻🇪", placeholder: "412-1234567" },
  { code: "+593", name: "Ecuador", flag: "🇪🇨", placeholder: "99 123 4567" },
  { code: "+595", name: "Paraguay", flag: "🇵🇾", placeholder: "961 123456" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾", placeholder: "94 123 456" },
  { code: "+591", name: "Bolivia", flag: "🇧🇴", placeholder: "71234567" },
  // ... (o resto da sua lista de países está ótimo)
]

export default function Step2() {
  const router = useRouter()

  // State for the phone input and country selector
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries.find(c => c.code === "+351") || countries[0]) // Default to Portugal or first
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")

  // State for the photo lookup feature
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState("")
  const [isPhotoPrivate, setIsPhotoPrivate] = useState(false)

  // Filter countries based on search input
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) || country.code.includes(countrySearch),
  )

  // Function to fetch the WhatsApp photo from your API
  const fetchWhatsAppPhoto = async (phone: string) => {
    if (phone.replace(/[^0-9]/g, "").length < 10) return

    setIsLoadingPhoto(true)
    setPhotoError("")
    setProfilePhoto(null)
    setIsPhotoPrivate(false)

    try {
      const response = await fetch("/api/whatsapp-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })

      let data: any
      try {
        data = await response.json()
      } catch {
        data = {}
      }

      if (!response.ok || !data?.success) {
        setProfilePhoto("/placeholder.svg")
        setIsPhotoPrivate(true)
        setPhotoError("Could not load photo.")
        setIsLoadingPhoto(false); // Adicionado para parar o loading no erro
        return
      }

      // ========================================================
      //  CORREÇÃO 1: Usar `data.result` que vem da nossa API
      // (Nossa API já renomeou `profilePic` para `result` para o frontend)
      // ========================================================
      setProfilePhoto(data.result)
      setIsPhotoPrivate(!!data.is_photo_private)

    } catch (error) {
      console.error("Error fetching photo:", error)
      setProfilePhoto("/placeholder.svg")
      setIsPhotoPrivate(true)
      setPhotoError("Error loading photo.")
    } finally {
      setIsLoadingPhoto(false)
    }
  }

  // =====================================================================================
  //  CORREÇÃO 2: Implementando o "DEBOUNCING" para evitar chamadas excessivas à API
  // =====================================================================================

  // Esta função agora APENAS atualiza o estado do que o usuário digita
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = e.target.value.replace(/[^0-9-()\s]/g, "")
    setPhoneNumber(formattedValue)
  }

  // Este useEffect "observa" o usuário digitar e chama a API após uma pausa
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phoneNumber.trim()) {
        const fullNumberForApi = selectedCountry.code + phoneNumber;
        const cleanPhone = fullNumberForApi.replace(/[^0-9]/g, "");
        if (cleanPhone.length >= 11) {
          fetchWhatsAppPhoto(cleanPhone);
        }
      } else {
        // Limpa a foto se o campo estiver vazio
        setProfilePhoto(null);
        setIsPhotoPrivate(false);
        setPhotoError("");
      }
    }, 800); // Espera 0.8 segundos após o usuário parar de digitar

    return () => clearTimeout(timer);
  }, [phoneNumber, selectedCountry]); // Roda quando o número ou o país mudam

  // =====================================================================================

  // Handles selecting a new country from the dropdown
  const handleSelectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country)
    setShowCountryDropdown(false)
    setCountrySearch("")
    setPhoneNumber("")
    setProfilePhoto(null)
    setIsPhotoPrivate(false)
    setPhotoError("")
  }

  // Submits the form and proceeds to the next step
  const handleCloneWhatsApp = () => {
    const fullNumber = (selectedCountry.code + phoneNumber).replace(/[^0-9+]/g, "")
    if (fullNumber.length > 10 && profilePhoto && !isPhotoPrivate) { // Só avança se tiver foto pública
      localStorage.setItem("profilePhoto", profilePhoto)
      localStorage.setItem("phoneNumber", fullNumber)
      router.push("/step-3")
    } else {
      setPhotoError("A valid public profile photo is required to proceed.")
    }
  }

  // Effect to close the country dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCountryDropdown) {
        const target = event.target as Element
        if (!target.closest(".country-selector-container")) {
          setShowCountryDropdown(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showCountryDropdown])

  // Resto do seu componente JSX (não precisa de alteração)
  return (
     <div className="min-h-screen bg-gray-100 flex flex-col">
       {/* Header */}
       <header className="flex justify-between items-center p-4">
         <Button variant="ghost" size="icon" className="text-gray-600">
           <Menu className="h-6 w-6" />
         </Button>
         <div className="flex items-center gap-2 text-green-500 font-semibold text-lg">
           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.051 3.488" />
           </svg>
           WhatsApp
         </div>
         <Button size="icon" className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12">
           <Download className="h-6 w-6" />
         </Button>
       </header>

       {/* Main Content */}
       <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
         {/* Profile Photo Display */}
         <div className="mb-6 h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
           {isLoadingPhoto ? (
             <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
           ) : profilePhoto ? (
             <Image
               src={profilePhoto || "/placeholder.svg"}
               alt="WhatsApp Profile"
               width={128}
               height={128}
               className="object-cover h-full w-full"
               unoptimized
               onError={() => setProfilePhoto("/placeholder.svg")}
             />
           ) : (
             <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-16 w-16 text-gray-400"
               viewBox="0 0 20 20"
               fill="currentColor"
             >
               <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
             </svg>
           )}
         </div>

         <div className="text-center w-full max-w-md mx-auto mb-8">
           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
             Congratulations, you've earned
             <br />1 free access!
           </h1>
           <p className="text-lg text-gray-500 mb-8">Enter the number below and start silent monitoring.</p>

           <div className="w-full mb-6 country-selector-container">
             <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-green-500">
               <div className="relative">
                 <button
                   type="button"
                   onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                   className="flex items-center gap-2 h-12 px-3 bg-gray-50 hover:bg-gray-100 rounded-l-xl transition-colors"
                 >
                   <span className="text-xl">{selectedCountry.flag}</span>
                   <span className="text-gray-700 font-medium">{selectedCountry.code}</span>
                 </button>

                 {showCountryDropdown && (
                   <div className="absolute top-full left-0 mt-2 bg-white border rounded-xl shadow-lg z-50 w-80 max-h-72 overflow-y-auto">
                     <div className="p-2 sticky top-0 bg-white border-b">
                       <Input
                         type="text"
                         placeholder="Search country or code..."
                         value={countrySearch}
                         onChange={(e) => setCountrySearch(e.target.value)}
                         className="w-full px-3 py-2 border rounded-lg text-sm"
                       />
                     </div>
                     <ul className="py-1">
                       {filteredCountries.length > 0 ? (
                         filteredCountries.map((country, index) => ( // Adicionado index para chave única
                           <li key={`${country.name}-${country.code}-${index}`}>
                             <button
                               type="button"
                               onClick={() => handleSelectCountry(country)}
                               className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
                             >
                               <span className="text-xl">{country.flag}</span>
                               <span className="text-gray-800 font-medium">{country.name}</span>
                               <span className="text-gray-500 ml-auto">{country.code}</span>
                             </button>
                           </li>
                         ))
                       ) : (
                         <li className="px-3 py-2 text-sm text-gray-500 text-center">No countries found.</li>
                       )}
                     </ul>
                   </div>
                 )}
               </div>

               <div className="h-6 w-px bg-gray-200"></div>

               <Input
                 type="tel"
                 placeholder={selectedCountry.placeholder || "Enter phone number"}
                 value={phoneNumber}
                 onChange={handlePhoneInputChange}
                 className="flex-1 h-12 border-none bg-transparent focus:ring-0"
               />
             </div>
           </div>

           <Button
             onClick={handleCloneWhatsApp}
             disabled={!phoneNumber.trim() || isLoadingPhoto}
             className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-2xl flex items-center justify-center gap-3 mb-8 disabled:bg-green-400 disabled:cursor-not-allowed"
           >
             {isLoadingPhoto ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
             Clone WhatsApp Now
           </Button>
           {photoError && <p className="text-red-500 text-sm mt-[-20px] mb-4">{photoError}</p>}
         </div>

         {/* Success Notifications */}
         <div className="space-y-3 w-full max-w-md">
           <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center gap-3">
             <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
             <span className="text-gray-700 text-sm">(312) 995-XX31 had conversations exposed!</span>
           </div>
           <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center gap-3">
             <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
             <span className="text-gray-700 text-sm">
               (213) 983-XX50 from Los Angeles was granted monitoring access!
             </span>
           </div>
           <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center gap-3">
             <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
             <span className="text-gray-700 text-sm">(305) 938-XX71 had messages intercepted!</span>
           </div>
         </div>
       </main>
     </div>
   )
}
