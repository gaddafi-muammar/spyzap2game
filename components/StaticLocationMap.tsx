"use client"

import { useState, useEffect } from "react"
import { MapPin } from "lucide-react"

export default function StaticLocationMap() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationName, setLocationName] = useState<string>("Lisbon, Portugal")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })

          // Try to get location name from coordinates
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            )
            const data = await response.json()
            if (data.city && data.countryName) {
              setLocationName(`${data.city}, ${data.countryName}`)
            }
          } catch (error) {
            console.log("Could not fetch location name")
          }
        },
        (error) => {
          // Fallback to Lisbon coordinates
          setUserLocation({ lat: 38.7223, lng: -9.1393 })
          setLocationName("Lisbon, Portugal")
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000,
        },
      )
    } else {
      // Fallback to Lisbon coordinates
      setUserLocation({ lat: 38.7223, lng: -9.1393 })
      setLocationName("Lisbon, Portugal")
    }
  }, [mounted])

  if (!mounted || !userLocation) {
    return (
      <div className="h-72 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading location...</p>
        </div>
      </div>
    )
  }

  // Create static map URL using OpenStreetMap tiles via a static map service
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+ff0000(${userLocation.lng},${userLocation.lat})/${userLocation.lng},${userLocation.lat},13,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`

  // Fallback to a simple visual representation if the static map fails
  return (
    <div className="h-72 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden">
      {/* Background pattern to simulate map */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className={`border border-gray-300 ${
                Math.random() > 0.7 ? "bg-green-200" : Math.random() > 0.5 ? "bg-blue-200" : "bg-gray-100"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Location marker */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Pulsing circle effect */}
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-red-600 rounded-full p-3 shadow-lg">
            <MapPin className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Location info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-red-300">⚠️ SUSPICIOUS ACTIVITY DETECTED</span>
          </div>
          <p className="text-sm opacity-90">Location: {locationName}</p>
          <p className="text-xs opacity-75">
            Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
          <p className="text-xs opacity-75 mt-1">Device was tracked to this area</p>
        </div>
      </div>

      {/* Corner indicators */}
      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">LIVE</div>
      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">GPS TRACKING</div>
    </div>
  )
}
