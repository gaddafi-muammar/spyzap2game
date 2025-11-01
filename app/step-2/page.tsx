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
  { code: "+1", name: "Canada", flag: "🇨🇦", placeholder: "(555) 123-4567" },
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
  { code: "+81", name: "Japan", flag: "🇯🇵", placeholder: "90-1234-5678" },
  { code: "+82", name: "South Korea", flag: "🇰🇷", placeholder: "10-1234-5678" },
  { code: "+86", name: "China", flag: "🇨🇳", placeholder: "138 0013 8000" },
  { code: "+91", name: "India", flag: "🇮🇳", placeholder: "81234 56789" },
  { code: "+61", name: "Australia", flag: "🇦🇺", placeholder: "412 345 678" },
  { code: "+64", name: "New Zealand", flag: "🇳🇿", placeholder: "21 123 4567" },
  { code: "+27", name: "South Africa", flag: "🇿🇦", placeholder: "71 123 4567" },
  { code: "+20", name: "Egypt", flag: "🇪🇬", placeholder: "100 123 4567" },
  { code: "+234", name: "Nigeria", flag: "🇳🇬", placeholder: "802 123 4567" },
  { code: "+254", name: "Kenya", flag: "🇰🇪", placeholder: "712 123456" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪", placeholder: "50 123 4567" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", placeholder: "50 123 4567" },
  { code: "+90", name: "Turkey", flag: "🇹🇷", placeholder: "501 234 56 78" },
  { code: "+7", name: "Russia", flag: "🇷🇺", placeholder: "912 345-67-89" },
  { code: "+380", name: "Ukraine", flag: "🇺🇦", placeholder: "50 123 4567" },
  { code: "+48", name: "Poland", flag: "🇵🇱", placeholder: "512 345 678" },
  { code: "+31", name: "Netherlands", flag: "🇳🇱", placeholder: "6 12345678" },
  { code: "+32", name: "Belgium", flag: "🇧🇪", placeholder: "470 12 34 56" },
  { code: "+41", name: "Switzerland", flag: "🇨🇭", placeholder: "78 123 45 67" },
  { code: "+43", name: "Austria", flag: "🇦🇹", placeholder: "664 123456" },
  { code: "+45", name: "Denmark", flag: "🇩🇰", placeholder: "20 12 34 56" },
  { code: "+46", name: "Sweden", flag: "🇸🇪", placeholder: "70-123 45 67" },
  { code: "+47", name: "Norway", flag: "🇳🇴", placeholder: "406 12 345" },
  { code: "+358", name: "Finland", flag: "🇫🇮", placeholder: "50 123 4567" },
  { code: "+65", name: "Singapore", flag: "🇸🇬", placeholder: "8123 4567" },
  { code: "+63", name: "Philippines", flag: "🇵🇭", placeholder: "912 345 6789" },
  { code: "+62", name: "Indonesia", flag: "🇮🇩", placeholder: "0812 3456 789" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾", placeholder: "012-345 6789" },
  { code: "+66", name: "Thailand", flag: "🇹🇭", placeholder: "081 234 5678" },
  { code: "+84", name: "Vietnam", flag: "🇻🇳", placeholder: "091 234 56 78" },
  { code: "+92", name: "Pakistan", flag: "🇵🇰", placeholder: "0300 1234567" },
  { code: "+98", name: "Iran", flag: "🇮🇷", placeholder: "0912 345 6789" },
  { code: "+94", name: "Sri Lanka", flag: "🇱🇰", placeholder: "071 123 4567" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", placeholder: "01712 345678" },
  { code: "+855", name: "Cambodia", flag: "🇰🇭", placeholder: "092 123 456" },
  { code: "+673", name: "Brunei", flag: "🇧🇳", placeholder: "872 1234" },
  { code: "+679", name: "Fiji", flag: "🇫🇯", placeholder: "920 1234" },
  { code: "+675", name: "Papua New Guinea", flag: "🇵🇬", placeholder: "723 45678" },
  { code: "+677", name: "Solomon Islands", flag: "🇸🇧", placeholder: "742 1234" },
  { code: "+678", name: "Vanuatu", flag: "🇻🇺", placeholder: "778 1234" },
  { code: "+691", name: "Micronesia", flag: "🇫🇲", placeholder: "920 1234" },
  { code: "+692", name: "Marshall Islands", flag: "🇲🇭", placeholder: "692 1234" },
  { code: "+680", name: "Palau", flag: "🇵🇼", placeholder: "620 1234" },
  { code: "+685", name: "Samoa", flag: "🇼🇸", placeholder: "722 1234" },
  { code: "+676", name: "Tonga", flag: "🇹🇴", placeholder: "771 1234" },
  { code: "+682", name: "Cook Islands", flag: "🇨🇰", placeholder: "722 1234" },
  { code: "+683", name: "Niue", flag: "🇳🇺", placeholder: "811 1234" },
  { code: "+672", name: "Norfolk Island", flag: "🇳🇫", placeholder: "512 1234" },
  { code: "+670", name: "Timor-Leste", flag: "🇹🇱", placeholder: "771 1234" },
  { code: "+688", name: "Tuvalu", flag: "🇹🇻", placeholder: "771 1234" },
  { code: "+690", name: "Tokelau", flag: "🇹🇰", placeholder: "811 1234" },
  { code: "+239", name: "Sao Tome and Principe", flag: "🇸🇹", placeholder: "981 1234" },
  { code: "+240", name: "Equatorial Guinea", flag: "🇬🇶", placeholder: "222 123 456" },
  { code: "+241", name: "Gabon", flag: "🇬🇦", placeholder: "06 12 34 56 78" },
  { code: "+242", name: "Republic of the Congo", flag: "🇨🇬", placeholder: "06 123 4567" },
  { code: "+243", name: "Democratic Republic of the Congo", flag: "🇨🇩", placeholder: "081 123 4567" },
  { code: "+244", name: "Angola", flag: "🇦🇴", placeholder: "923 123 456" },
  { code: "+245", name: "Guinea-Bissau", flag: "🇬🇼", placeholder: "955 123 456" },
  { code: "+246", name: "Diego Garcia", flag: "🇮🇴", placeholder: "380 1234" },
  { code: "+247", name: "Ascension Island", flag: "🇦🇨", placeholder: "650 1234" },
  { code: "+248", name: "Seychelles", flag: "🇸🇨", placeholder: "2 510 123" },
  { code: "+249", name: "Sudan", flag: "🇸🇩", placeholder: "091 123 4567" },
  { code: "+250", name: "Rwanda", flag: "🇷🇼", placeholder: "072 123 4567" },
  { code: "+251", name: "Ethiopia", flag: "🇪🇹", placeholder: "091 123 4567" },
  { code: "+252", name: "Somalia", flag: "🇸🇴", placeholder: "61 123 4567" },
  { code: "+253", name: "Djibouti", flag: "🇩🇯", placeholder: "77 123 456" },
  { code: "+255", name: "Tanzania", flag: "🇹🇿", placeholder: "071 123 4567" },
  { code: "+256", name: "Uganda", flag: "🇺🇬", placeholder: "070 123 4567" },
  { code: "+257", name: "Burundi", flag: "🇧🇮", placeholder: "79 123 456" },
  { code: "+258", name: "Mozambique", flag: "🇲🇿", placeholder: "82 123 4567" },
  { code: "+260", name: "Zambia", flag: "🇿🇲", placeholder: "095 123 4567" },
  { code: "+261", name: "Madagascar", flag: "🇲🇬", placeholder: "032 12 345 67" },
  { code: "+262", name: "Reunion", flag: "🇷🇪", placeholder: "0692 12 34 56" },
  { code: "+263", name: "Zimbabwe", flag: "🇿🇼", placeholder: "071 123 456" },
  { code: "+264", name: "Namibia", flag: "🇳🇦", placeholder: "081 123 4567" },
  { code: "+265", name: "Malawi", flag: "🇲🇼", placeholder: "099 123 4567" },
  { code: "+266", name: "Lesotho", flag: "🇱🇸", placeholder: "501 123 456" },
  { code: "+267", name: "Botswana", flag: "🇧🇼", placeholder: "71 123 456" },
  { code: "+268", name: "Eswatini", flag: "🇸🇿", placeholder: "761 123 456" },
  { code: "+269", name: "Comoros", flag: "🇰🇲", placeholder: "321 1234" },
  { code: "+290", name: "Saint Helena", flag: "🇸🇭", placeholder: "659 1234" },
  { code: "+291", name: "Eritrea", flag: "🇪🇷", placeholder: "07 123 456" },
  { code: "+297", name: "Aruba", flag: "🇦🇼", placeholder: "560 1234" },
  { code: "+298", name: "Faroe Islands", flag: "🇫🇴", placeholder: "211234" },
  { code: "+299", name: "Greenland", flag: "🇬🇱", placeholder: "221234" },
  { code: "+350", name: "Gibraltar", flag: "🇬🇮", placeholder: "571 12345" },
  { code: "+351", name: "Portugal", flag: "🇵🇹", placeholder: "912 345 678" },
  { code: "+352", name: "Luxembourg", flag: "🇱🇺", placeholder: "621 123 456" },
  { code: "+353", name: "Ireland", flag: "🇮🇪", placeholder: "083 123 4567" },
  { code: "+354", name: "Iceland", flag: "🇮🇸", placeholder: "611 1234" },
  { code: "+355", name: "Albania", flag: "🇦🇱", placeholder: "067 123 4567" },
  { code: "+356", name: "Malta", flag: "🇲🇹", placeholder: "799 12345" },
  { code: "+357", name: "Cyprus", flag: "🇨🇾", placeholder: "961 12345" },
  { code: "+358", name: "Finland", flag: "🇫🇮", placeholder: "50 123 4567" },
  { code: "+359", name: "Bulgaria", flag: "🇧🇬", placeholder: "088 123 4567" },
  { code: "+370", name: "Lithuania", flag: "🇱🇹", placeholder: "601 12345" },
  { code: "+371", name: "Latvia", flag: "🇱🇻", placeholder: "200 12345" },
  { code: "+372", name: "Estonia", flag: "🇪🇪", placeholder: "501 1234" },
  { code: "+373", name: "Moldova", flag: "🇲🇩", placeholder: "068 123 456" },
  { code: "+374", name: "Armenia", flag: "🇦🇲", placeholder: "091 123 456" },
  { code: "+375", name: "Belarus", flag: "🇧🇾", placeholder: "029 123 4567" },
  { code: "+376", name: "Andorra", flag: "🇦🇩", placeholder: "606 123 456" },
  { code: "+377", name: "Monaco", flag: "🇲🇨", placeholder: "06 12 34 56 78" },
  { code: "+378", name: "San Marino", flag: "🇸🇲", placeholder: "333 123456" },
  { code: "+379", name: "Vatican City", flag: "🇻🇦", placeholder: "333 123456" },
  { code: "+381", name: "Serbia", flag: "🇷🇸", placeholder: "061 123 4567" },
  { code: "+382", name: "Montenegro", flag: "🇲🇪", placeholder: "067 123 456" },
  { code: "+383", name: "Kosovo", flag: "🇽🇰", placeholder: "049 123 456" },
  { code: "+385", name: "Croatia", flag: "🇭🇷", placeholder: "091 123 4567" },
  { code: "+386", name: "Slovenia", flag: "🇸🇮", placeholder: "031 123 456" },
  { code: "+387", name: "Bosnia and Herzegovina", flag: "🇧🇦", placeholder: "061 123 456" },
  { code: "+389", name: "North Macedonia", flag: "🇲🇰", placeholder: "070 123 456" },
  { code: "+420", name: "Czech Republic", flag: "🇨🇿", placeholder: "601 123 456" },
  { code: "+421", name: "Slovakia", flag: "🇸🇰", placeholder: "0911 123 456" },
  { code: "+423", name: "Liechtenstein", flag: "🇱🇮", placeholder: "660 123 456" },
  { code: "+500", name: "Falkland Islands", flag: "🇫🇰", placeholder: "51234" },
  { code: "+501", name: "Belize", flag: "🇧🇿", placeholder: "622 1234" },
  { code: "+502", name: "Guatemala", flag: "🇬🇹", placeholder: "5512 3456" },
  { code: "+503", name: "El Salvador", flag: "🇸🇻", placeholder: "7012 3456" },
  { code: "+504", name: "Honduras", flag: "🇭🇳", placeholder: "9123 4567" },
  { code: "+505", name: "Nicaragua", flag: "🇳🇮", placeholder: "8712 3456" },
  { code: "+506", name: "Costa Rica", flag: "🇨🇷", placeholder: "8312 3456" },
  { code: "+507", name: "Panama", flag: "🇵🇦", placeholder: "6712 3456" },
  { code: "+508", name: "Saint Pierre and Miquelon", flag: "🇵🇲", placeholder: "551 1234" },
  { code: "+509", name: "Haiti", flag: "🇭🇹", placeholder: "3412 3456" },
  { code: "+590", name: "Guadeloupe", flag: "🇬🇵", placeholder: "0690 12 34 56" },
  { code: "+591", name: "Bolivia", flag: "🇧🇴", placeholder: "71234567" },
  { code: "+592", name: "Guyana", flag: "🇬🇾", placeholder: "612 3456" },
  { code: "+593", name: "Ecuador", flag: "🇪🇨", placeholder: "99 123 4567" },
  { code: "+594", name: "French Guiana", flag: "🇬🇫", placeholder: "0694 12 34 56" },
  { code: "+595", name: "Paraguay", flag: "🇵🇾", placeholder: "961 123456" },
  { code: "+596", name: "Martinique", flag: "🇲🇶", placeholder: "0696 12 34 56" },
  { code: "+597", name: "Suriname", flag: "🇸🇷", placeholder: "741 1234" },
  { code: "+598", name: "Uruguay", flag: "🇺🇾", placeholder: "94 123 456" },
  { code: "+599", name: "Curaçao", flag: "🇨🇼", placeholder: "9 561 1234" },
  { code: "+670", name: "Timor-Leste", flag: "🇹🇱", placeholder: "771 1234" },
  { code: "+672", name: "Australian Antarctic Territory", flag: "🇦🇶", placeholder: "512 1234" },
  { code: "+673", name: "Brunei", flag: "🇧🇳", placeholder: "872 1234" },
  { code: "+674", name: "Nauru", flag: "🇳🇷", placeholder: "555 1234" },
  { code: "+675", name: "Papua New Guinea", flag: "🇵🇬", placeholder: "723 45678" },
  { code: "+676", name: "Tonga", flag: "🇹🇴", placeholder: "771 1234" },
  { code: "+677", name: "Solomon Islands", flag: "🇸🇧", placeholder: "742 1234" },
  { code: "+678", name: "Vanuatu", flag: "🇻🇺", placeholder: "778 1234" },
  { code: "+679", name: "Fiji", flag: "🇫🇯", placeholder: "920 1234" },
  { code: "+680", name: "Palau", flag: "🇵🇼", placeholder: "620 1234" },
  { code: "+681", name: "Wallis and Futuna", flag: "🇼🇫", placeholder: "721 1234" },
  { code: "+682", name: "Cook Islands", flag: "🇨🇰", placeholder: "722 1234" },
  { code: "+683", name: "Niue", flag: "🇳🇺", placeholder: "811 1234" },
  { code: "+685", name: "Samoa", flag: "🇼🇸", placeholder: "722 1234" },
  { code: "+686", name: "Kiribati", flag: "🇰🇮", placeholder: "720 1234" },
  { code: "+687", name: "New Caledonia", flag: "🇳🇨", placeholder: "750 1234" },
  { code: "+688", name: "Tuvalu", flag: "🇹🇻", placeholder: "771 1234" },
  { code: "+689", name: "French Polynesia", flag: "🇵🇫", placeholder: "87 12 34 56" },
  { code: "+690", name: "Tokelau", flag: "🇹🇰", placeholder: "811 1234" },
  { code: "+691", name: "Micronesia", flag: "🇫🇲", placeholder: "920 1234" },
  { code: "+692", name: "Marshall Islands", flag: "🇲🇭", placeholder: "692 1234" },
  { code: "+850", name: "North Korea", flag: "🇰🇵", placeholder: "191 123 4567" },
  { code: "+852", name: "Hong Kong", flag: "🇭🇰", placeholder: "6123 4567" },
  { code: "+853", name: "Macau", flag: "🇲🇴", placeholder: "6612 3456" },
  { code: "+855", name: "Cambodia", flag: "🇰🇭", placeholder: "092 123 456" },
  { code: "+856", name: "Laos", flag: "🇱🇦", placeholder: "020 1234 5678" },
  { code: "+880", name: "Bangladesh", flag: "🇧🇩", placeholder: "01712 345678" },
  { code: "+886", name: "Taiwan", flag: "🇹🇼", placeholder: "0912 345 678" },
  { code: "+960", name: "Maldives", flag: "🇲🇻", placeholder: "777 1234" },
  { code: "+961", name: "Lebanon", flag: "🇱🇧", placeholder: "03 123 456" },
  { code: "+962", name: "Jordan", flag: "🇯🇴", placeholder: "079 123 4567" },
  { code: "+963", name: "Syria", flag: "🇸🇾", placeholder: "093 123 456" },
  { code: "+964", name: "Iraq", flag: "🇮🇶", placeholder: "0790 123 4567" },
  { code: "+965", name: "Kuwait", flag: "🇰🇼", placeholder: "600 12345" },
  { code: "+966", name: "Saudi Arabia", flag: "🇸🇦", placeholder: "50 123 4567" },
  { code: "+967", name: "Yemen", flag: "🇾🇪", placeholder: "711 123 456" },
  { code: "+968", name: "Oman", flag: "🇴🇲", placeholder: "921 12345" },
  { code: "+970", name: "Palestine", flag: "🇵🇸", placeholder: "0599 123 456" },
  { code: "+971", name: "United Arab Emirates", flag: "🇦🇪", placeholder: "50 123 4567" },
  { code: "+972", name: "Israel", flag: "🇮🇱", placeholder: "052-123-4567" },
  { code: "+973", name: "Bahrain", flag: "🇧🇭", placeholder: "3600 1234" },
  { code: "+974", name: "Qatar", flag: "🇶🇦", placeholder: "3312 3456" },
  { code: "+975", name: "Bhutan", flag: "🇧🇹", placeholder: "17 123 456" },
  { code: "+976", name: "Mongolia", flag: "🇲🇳", placeholder: "8812 3456" },
  { code: "+977", name: "Nepal", flag: "🇳🇵", placeholder: "984 123 4567" },
  { code: "+992", name: "Tajikistan", flag: "🇹🇯", placeholder: "917 123 456" },
  { code: "+993", name: "Turkmenistan", flag: "🇹🇲", placeholder: "66 123 4567" },
  { code: "+994", name: "Azerbaijan", flag: "🇦🇿", placeholder: "050 123 45 67" },
  { code: "+995", name: "Georgia", flag: "🇬🇪", placeholder: "555 12 34 56" },
  { code: "+996", name: "Kyrgyzstan", flag: "🇰🇬", placeholder: "0700 123 456" },
  { code: "+998", name: "Uzbekistan", flag: "🇺🇿", placeholder: "90 123 45 67" },
]

export default function Step2() {
  const router = useRouter()

  // State for the phone input and country selector
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0]) // Default to USA
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState("") // State for the search input

  // State for the photo lookup feature
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState("")
  const [isPhotoPrivate, setIsPhotoPrivate] = useState(false)

   const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)

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
        return
      }

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

    // --- FUNÇÃO DE INPUT ATUALIZADA COM DEBOUNCE ---
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = e.target.value.replace(/[^0-9-()\s]/g, "")
    setPhoneNumber(formattedValue)

    // 1. Limpa qualquer timer anterior. Se o usuário digitar de novo, o timer antigo é cancelado.
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    // 2. Cria um novo timer para executar a busca após 7 segundos.
    const newTimeout = setTimeout(() => {
      const fullNumberForApi = selectedCountry.code + formattedValue
      const cleanPhone = fullNumberForApi.replace(/[^0-9]/g, "")

      if (cleanPhone.length >= 11) {
        fetchWhatsAppPhoto(cleanPhone)
      } else {
        // Se o número for muito curto após o timer, reseta a imagem.
        setProfilePhoto("/placeholder.svg")
        setIsPhotoPrivate(false)
        setPhotoError("")
      }
    }, 2000) // 2000 milissegundos = 2 segundos

    // 3. Guarda o ID do novo timer no estado.
    setDebounceTimeout(newTimeout)
  }

  // Handles selecting a new country from the dropdown
  const handleSelectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country)
    setShowCountryDropdown(false)
    setCountrySearch("") // Clear search on selection
    setPhoneNumber("")
    setProfilePhoto(null)
    setIsPhotoPrivate(false)
    setPhotoError("")
    // Limpa o timer se o país for trocado
    if (debounceTimeout) clearTimeout(debounceTimeout)
  }

  // Submits the form and proceeds to the next step
  const handleCloneWhatsApp = () => {
    const fullNumber = (selectedCountry.code + phoneNumber).replace(/[^0-9+]/g, "")
    if (fullNumber.length > 10) {
      localStorage.setItem("profilePhoto", profilePhoto || "/placeholder.svg")
      localStorage.setItem("phoneNumber", fullNumber)
      router.push("/step-3")
    } else {
      setPhotoError("Please enter a valid phone number.")
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
    
    // Boa prática: Limpa o timer se o componente for "desmontado" (se o usuário sair da página)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    }
  }, [showCountryDropdown, debounceTimeout]) // Adiciona debounceTimeout às dependências


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
                        filteredCountries.map((country) => (
                          <li key={`${country.name}-${country.code}`}>
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
