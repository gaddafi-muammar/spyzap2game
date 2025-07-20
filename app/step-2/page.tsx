"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Download, Lock, CheckCircle, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Data for the country code selector
const countries = [
  { name: "USA", code: "+1", flag: "🇺🇸" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Portugal", code: "+351", flag: "🇵🇹" },
  { name: "Mexico", code: "+52", flag: "🇲🇽" },
  { name: "Spain", code: "+34", flag: "🇪🇸" },
]

export default function Step2() {
  const router = useRouter()

  // State for the phone input and country selector
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0]) // Default to USA
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)

  // State for the photo lookup feature
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false)
  const [isPhotoPrivate, setIsPhotoPrivate] = useState(false)
  const [photoError, setPhotoError] = useState("")

  // Function to fetch the WhatsApp photo from your API
  const fetchWhatsAppPhoto = async (phone: string) => {
    // Basic validation to avoid unnecessary API calls
    if (phone.replace(/[^0-9]/g, "").length < 10) return

    setIsLoadingPhoto(true)
    setPhotoError("")
    setProfilePhoto(null) // Reset photo on new fetch
    setIsPhotoPrivate(false)

    try {
      const response = await fetch("/api/whatsapp-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      })

      let data: any
      try {
        data = await response.json()
      } catch {
        data = {} // Fallback if response is not valid JSON
      }

      if (!response.ok || !data?.success) {
        setProfilePhoto(
          "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
        )
        setIsPhotoPrivate(true)
        setPhotoError("Could not load photo.")
        return
      }

      // Success
      setProfilePhoto(data.result)
      setIsPhotoPrivate(!!data.is_photo_private)
    } catch (error) {
      console.error("Error fetching photo:", error)
      setProfilePhoto(
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      )
      setIsPhotoPrivate(true)
      setPhotoError("Error loading photo.")
    } finally {
      setIsLoadingPhoto(false)
    }
  }

  // Handles changes in the phone number input field
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and formatting characters in input
    const formattedValue = e.target.value.replace(/[^0-9-()\s]/g, "")
    setPhoneNumber(formattedValue)

    // Prepare the full number for the API call (e.g., "+14155552671")
    const fullNumberForApi = selectedCountry.code + formattedValue
    const cleanPhone = fullNumberForApi.replace(/[^0-9]/g, "")

    // Trigger fetch when the number is potentially valid (e.g., country code + 10 digits)
    if (cleanPhone.length >= 11) {
      fetchWhatsAppPhoto(cleanPhone)
    } else {
      // Reset if the number becomes too short
      setProfilePhoto(null)
      setIsPhotoPrivate(false)
      setPhotoError("")
    }
  }

  // Handles selecting a new country from the dropdown
  const handleSelectCountry = (country: (typeof countries)[0]) => {
    setSelectedCountry(country)
    setShowCountryDropdown(false)
    setPhoneNumber("") // Reset input on country change for better UX
    setProfilePhoto(null)
    setIsPhotoPrivate(false)
    setPhotoError("")
  }

  // Submits the form and proceeds to the next step
  const handleCloneWhatsApp = () => {
    const fullNumber = (selectedCountry.code + phoneNumber).replace(/[^0-9+]/g, "")
    if (fullNumber.length > 10) {
      // --- THIS IS THE CORRECTED PART ---
      localStorage.setItem(
        "profilePhoto",
        profilePhoto || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
      )
      // --- END OF CORRECTION ---
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
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showCountryDropdown])

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
              src={profilePhoto}
              alt="WhatsApp Profile"
              width={128}
              height={128}
              className="object-cover h-full w-full"
              unoptimized // Recommended for external, user-provided image URLs
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

        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Congratulations, you've earned
            <br />1 free access!
          </h1>
          <p className="text-lg text-gray-500 mb-8">Enter the number below and start silent monitoring.</p>

          {/* Phone Input with Country Selector */}
          <div className="flex items-center max-w-md mx-auto mb-6 relative country-selector-container">
            <div className="relative">
              <button
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center gap-2 pl-3 pr-2 py-3 bg-white border border-r-0 border-gray-300 rounded-l-lg h-12"
              >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="text-gray-600">{selectedCountry.code}</span>
              </button>

              {showCountryDropdown && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <ul className="py-1">
                    {countries.map((country) => (
                      <li
                        key={country.code}
                        onClick={() => handleSelectCountry(country)}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer text-left"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-sm">{country.name}</span>
                        <span className="text-sm text-gray-500 ml-auto">{country.code}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={handlePhoneInputChange}
              className="flex-1 h-12 border-l-0 rounded-l-none rounded-r-lg focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <Button
            onClick={handleCloneWhatsApp}
            disabled={!phoneNumber.trim() || isLoadingPhoto}
            className="w-full max-w-md h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-2xl flex items-center justify-center gap-3 mb-8 disabled:bg-green-400 disabled:cursor-not-allowed"
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
