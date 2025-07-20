"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  MessageSquare,
  ImageIcon,
  Video,
  Phone,
  AlertTriangle,
  ArrowLeft,
  X,
  CheckCheck,
  Lock,
} from "lucide-react"
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

// Define image paths for the male profile
const maleImages = [
  "/images/male/3.png",
  "/images/male/4.png",
  "/images/male/5.png",
  "/images/male/6.png",
  "/images/male/7.png",
  "/images/male/8.png",
  "/images/male/9.png",
  "/images/male/303.png",
  "/images/male/331.png",
]

// Define the shape of a single message
type Message = {
  type: "incoming" | "outgoing"
  content: string
  time: string
  isBlocked?: boolean
}

// ChatPopup component
const ChatPopup = ({
  onClose,
  profilePhoto,
  conversationData,
  conversationName,
}: {
  onClose: () => void
  profilePhoto: string | null
  conversationData: Message[]
  conversationName: string
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-teal-600 text-white p-3 flex items-center gap-3">
          <button onClick={onClose} className="p-1 rounded-full hover:bg-teal-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={
                profilePhoto ||
                "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=" ||
                "/placeholder.svg"
              }
              alt="Profile"
              width={40}
              height={40}
              className="object-cover h-full w-full" // Removi o blur para a foto do popup
              unoptimized
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{conversationName.replace("🔒", "").trim()}</span>
            {conversationName.includes("🔒") && <Lock className="h-4 w-4" />}
          </div>
        </div>

        {/* Chat Body */}
        <div className="bg-gray-200 p-4 space-y-4 h-[28rem] overflow-y-scroll">
          {conversationData.map((msg, index) =>
            msg.type === "incoming" ? (
              <div key={index} className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-[80%] shadow">
                  <p className={`text-sm ${msg.isBlocked ? "font-semibold text-red-500" : "text-gray-800"}`}>
                    {msg.content}
                  </p>
                  <p className="text-right text-xs text-gray-400 mt-1">{msg.time}</p>
                </div>
              </div>
            ) : (
              <div key={index} className="flex justify-end">
                <div className="bg-lime-200 rounded-lg p-3 max-w-[80%] shadow">
                  <p className={`text-sm ${msg.isBlocked ? "font-semibold text-red-500" : "text-gray-800"}`}>
                    {msg.content}
                  </p>
                  <div className="flex justify-end items-center mt-1">
                    <span className="text-xs text-gray-500 mr-1">{msg.time}</span>
                    <CheckCheck className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Unlock Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-center bg-gradient-to-t from-white via-white/95 to-transparent">
          <p className="text-gray-700 font-medium">To view the full conversation, you need to unlock the chats.</p>
        </div>
      </div>
    </div>
  )
}

export default function Step4Male() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [location, setLocation] = useState<string>("Detecting location...")
  const [mapCenter, setMapCenter] = useState<LatLngExpression | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [selectedConvoIndex, setSelectedConvoIndex] = useState<number | null>(null)

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

  const conversations = [
    {
      img: "/images/male/3.png",
      name: "Blocked 🔒",
      msg: "Recovered deleted message",
      time: "Yesterday",
      popupName: "Blocked 🔒",
      chatData: [
        { type: "incoming", content: "Hi, how are you?", time: "2:38 PM" },
        { type: "outgoing", content: "I'm good, and you?", time: "2:40 PM" },
        { type: "incoming", content: "Blocked content", time: "2:43 PM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "2:43 PM", isBlocked: true },
        { type: "incoming", content: "Blocked content", time: "2:45 PM", isBlocked: true },
      ] as Message[],
    },
    {
      img: "/images/male/303.png",
      name: "Blocked 🔒",
      msg: "Suspicious audio detected",
      time: "2 days ago",
      popupName: "Blocked",
      chatData: [
        { type: "incoming", content: "Hey handsome", time: "10:21 PM" },
        { type: "outgoing", content: "I'm here, my love", time: "10:27 PM" },
        { type: "incoming", content: "Blocked content", time: "10:29 PM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "10:34 PM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "10:35 PM", isBlocked: true },
        { type: "incoming", content: "Blocked content", time: "10:36 PM", isBlocked: true },
      ] as Message[],
    },
    {
      img: "/images/male/331.png",
      name: "Blocked 🔒",
      msg: "Suspicious photos found",
      time: "3 days ago",
      popupName: "Blocked",
      chatData: [
        { type: "incoming", content: "Hi, how have you been?", time: "11:45 AM" },
        { type: "outgoing", content: "I'm fine, thanks! What about you?", time: "11:47 AM" },
        { type: "incoming", content: "Blocked content", time: "11:50 AM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "11:51 AM", isBlocked: true },
      ] as Message[],
    },
  ]

  const suspiciousKeywords = [
    { word: "Naughty", count: 13 },
    { word: "Love", count: 22 },
    { word: "Secret", count: 7 },
    { word: "Hidden", count: 11 },
    { word: "Don't tell", count: 5 },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack}>
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 text-center flex-1">WhatsApp Access Report - Male Profile</h1>
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
              {maleImages.map((src, index) => (
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

        {/* Suspicious Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Suspicious Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              The system scanned <span className="font-semibold text-red-500">4,327 messages</span> and identified
              several keywords that may indicate suspicious behavior.
            </p>

            <div className="space-y-1">
              {suspiciousKeywords.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200"
                >
                  <span className="text-lg text-gray-800">"{item.word}"</span>
                  <div className="flex items-center justify-center w-7 h-7 bg-green-500 rounded-full text-white text-sm font-bold">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phone Display */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Image
                src="/images/celulares.webp"
                alt="Phone"
                width={300}
                height={300}
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong>
                You have reached the end of your free consultation. I know you're tired of guessing and want some real
                answers.
              </strong>
            </p>
            <p>
              Our satellite tracking system is the most advanced technology to find out what’s going on. But there’s a
              catch: keeping the satellites and servers running 24/7 is expensive.
            </p>
            <p>That’s why, unfortunately, we can’t provide more than 5% of the information we uncover for free.</p>
            <p>The good news? You don’t have to spend a fortune to hire a private investigator.</p>
            <p>
              We’ve developed an app that puts that same technology in your hands and lets you track everything
              discreetly and efficiently on your own.
            </p>
            <p>
              And the best part? The costs are a fraction of what you’d pay for an investigator – just enough to keep
              our satellites and system running.
            </p>
            <p>
              It’s time to stop guessing and find out the truth. The answers are waiting for you. Click now and get
              instant access – before it’s too late!
            </p>
          </div>
        </div>

        {/* Exclusive Discount */}
        <div className="bg-[#0A3622] text-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center">EXCLUSIVE DISCOUNT</h2>
          <div className="text-xl text-red-400 line-through text-center my-2">$197</div>
          <div className="text-4xl font-bold mb-4 text-center">$47</div>

          <div className="space-y-2 text-sm mb-6 text-left">
            <div className="flex items-center gap-4">
              <img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" />
              <span>This person recently communicated whith 3 people from (IP)</span>
            </div>
            <div className="flex items-center gap-4">
              <img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" />
              <span>Our AI detected a suspicious message</span>
            </div>
            <div className="flex items-center gap-4">
              <img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" />
              <span>It was deteced that this person viewed the status of contact ****** 6 times today</span>
            </div>
            <div className="flex items-center gap-4">
              <img src="/images/icone-check.png" alt="Ícone de verificação" className="h-8 w-8" />
              <span>It was detected that this person archived 2 conversations yesterday</span>
            </div>
          </div>
          <Button className="w-full rounded-full bg-[#26d366] py-3 text-lg font-bold text-white shadow-[0_4px_12px_rgba(38,211,102,0.3)] transition duration-150 ease-in-out hover:bg-[#22b858] hover:shadow-lg">
            BUY NOW →
          </Button>
        </div>

        {/* 30 Days Guarantee */}
        <div className="text-center py-8">
          <img src="/images/30en.png" alt="Selo de 30 dias de garantia" className="w-64 h-64 block mx-auto" />
        </div>
      </div>

      {/* Conditionally render the popup */}
      {selectedConvoIndex !== null && (
        <ChatPopup
          onClose={() => setSelectedConvoIndex(null)}
          profilePhoto={conversations[selectedConvoIndex].img}
          conversationData={conversations[selectedConvoIndex].chatData}
          conversationName={conversations[selectedConvoIndex].popupName}
        />
      )}
    </div>
  )
}
