"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, MessageSquare, ImageIcon, Video, Phone, AlertTriangle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import type { LatLngExpression } from "leaflet"

// Dynamically import the MapComponent to prevent SSR issues with Leaflet
const LocationMapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
})

// Define image paths for the female profile
const femaleImages = [
  "/images/female/1-h.png",
  "/images/female/2-h.png",
  "/images/female/3-h.png",
  "/images/female/4-h.png",
  "/images/female/5-h.png",
  "/images/female/6-h.png",
  "/images/female/7-h.png",
  "/images/female/8-h.png",
  "/images/female/9-h.png",
]

export default function Step4Female() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [location, setLocation] = useState<string>("Detecting location...")
  const [mapCenter, setMapCenter] = useState<LatLngExpression | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    const storedPhone = localStorage.getItem("phoneNumber")
    const storedPhoto = localStorage.getItem("profilePhoto")

    setPhoneNumber(storedPhone || "Number not found")
    setProfilePhoto(storedPhoto || "/placeholder.svg")

    const fetchLocationAndMap = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        if (!response.ok) throw new Error("Failed to fetch location")
        const data = await response.json()
        const detectedLocation = data.city || "Unknown Location"
        setLocation(detectedLocation)

        // Set map center to detected location or a default (Lisbon)
        if (data.latitude && data.longitude) {
          setMapCenter([data.latitude, data.longitude])
        } else {
          // Default to Lisbon coordinates if geolocation fails
          setMapCenter([38.7223, -9.1393])
          setMapError("Could not detect precise location. Showing Lisbon.")
        }
      } catch (error) {
        console.error("Location fetch error:", error)
        setLocation("Unknown Location")
        setMapCenter([38.7223, -9.1393]) // Fallback to Lisbon
        setMapError("Error detecting location. Showing Lisbon.")
      }
    }

    fetchLocationAndMap()
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">
            WhatsApp Access Report - Female Profile
          </h1>
          <div className="w-10" /> {/* Placeholder for alignment */}
        </div>

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image
                src={profilePhoto || "/placeholder.svg"}
                alt="Profile"
                width={48}
                height={48}
                className="rounded-full object-cover"
                unoptimized
              />
              <span>Profile Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Phone Number:</span> {phoneNumber}
              </p>
              <p className="text-gray-600 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-semibold">Location:</span> {location}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span>Messages: Recovered</span>
              </div>
              <div className="flex items-center gap-1">
                <ImageIcon className="h-4 w-4 text-purple-500" />
                <span>Photos: Recovered</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4 text-red-500" />
                <span>Videos: Recovered</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-green-500" />
                <span>Calls: Recovered</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suspicious Activity Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Suspicious Activity Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 w-full">
            {mapError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{mapError}</span>
              </div>
            )}
            {mapCenter ? (
              <LocationMapComponent center={mapCenter} zoom={13} markerText="Suspicious Activity Detected Here" />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
                <p className="text-gray-500">Loading map...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recovered Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-purple-500" />
              <span>Recovered Media</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {femaleImages.map((src, index) => (
                <div key={index} className="relative w-full aspect-square rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Recovered media ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center pt-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to take action?</h2>
          <p className="text-lg text-gray-600 mb-6">Download the full report to get detailed insights and evidence.</p>
          <Button className="w-full max-w-xs h-12 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-lg">
            Download Full Report
          </Button>
        </div>
      </div>
    </div>
  )
}
