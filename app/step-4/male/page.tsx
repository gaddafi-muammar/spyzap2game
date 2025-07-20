"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, X, Lock, CheckCheck } from "lucide-react"
import Image from "next/image"
import StaticLocationMap from "@/components/StaticLocationMap"

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
                "/placeholder.svg" ||
                "/placeholder.svg" ||
                "/placeholder.svg"
              }
              alt="Profile"
              width={40}
              height={40}
              className="object-cover h-full w-full filter blur-sm"
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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [selectedConvoIndex, setSelectedConvoIndex] = useState<number | null>(null)

  useEffect(() => {
    const storedPhoto = localStorage.getItem("profilePhoto")
    setProfilePhoto(
      storedPhoto ||
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    )
  }, [])

  const maleImages = [
    "/images/male/4.png",
    "/images/male/7.png",
    "/images/male/6.png",
    "/images/male/5.png",
    "/images/male/9.png",
    "/images/male/8.png",
  ]

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
        { type: "outgoing", content: "Blocked content", time: "2:47 PM", isBlocked: true },
        { type: "incoming", content: "Blocked content", time: "2:49 PM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "2:49 PM", isBlocked: true },
        { type: "incoming", content: "Blocked content", time: "2:52 PM", isBlocked: true },
      ] as Message[],
    },
    {
      img: "/images/male/303.png",
      name: "Blocked 🔒",
      msg: "Suspicious audio detected",
      time: "2 days ago",
      popupName: "Blocked",
      chatData: [
        { type: "incoming", content: "Hey handsome", time: "2:38 PM" },
        { type: "outgoing", content: "I'm here, my love", time: "2:40 PM" },
        { type: "incoming", content: "Blocked content", time: "2:43 PM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "2:47 PM", isBlocked: true },
        { type: "incoming", content: "Blocked content", time: "2:49 PM", isBlocked: true },
        { type: "outgoing", content: "Blocked content", time: "2:49 PM", isBlocked: true },
        { type: "incoming", content: "Blocked content", time: "2:52 PM", isBlocked: true },
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
        { type: "outgoing", content: "Blocked content", time: "11:53 AM", isBlocked: true },
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-green-500 text-white text-center py-4">
        <h1 className="text-xl font-bold">WhatsApp Access Report - Male Profile</h1>
        <p className="text-sm opacity-90">Check below the most relevant from the analysis of the personal mobile</p>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Detected User */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Detected user</h2>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              {profilePhoto ? (
                <Image
                  src={profilePhoto || "/placeholder.svg"}
                  alt="WhatsApp Profile"
                  width={80}
                  height={80}
                  className="object-cover h-full w-full"
                  unoptimized
                />
              ) : (
                <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Conversation Analysis */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Conversation Analysis</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-red-500">148 suspicious conversations</span> were found during the
            analysis. The system was able to recover{" "}
            <span className="font-semibold text-orange-500">deleted messages</span> and some were classified as critical
            based on the content.
          </p>
          <p className="text-xs text-gray-500 mb-4">Tap a conversation below to view details.</p>

          <div className="space-y-3">
            {conversations.map((convo, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedConvoIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                    <Image
                      src={convo.img || "/placeholder.svg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{convo.name}</p>
                    <p className="text-xs text-gray-500">{convo.msg}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{convo.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recovered Media */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Recovered Media</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-semibold text-red-500">5 compromising audios</span> were recovered during the
            analysis. Additionally, the system found{" "}
            <span className="font-semibold text-red-500">247 deleted photos</span> that may contain sensitive content.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {maleImages.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Recovered media ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Suspicious Keywords */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Suspicious Keywords</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The system scanned <span className="font-semibold text-red-500">4,327 messages</span> and identified several
            keywords that may indicate suspicious behavior.
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
        </div>

        {/* Suspicious Location with Static Map */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Suspicious Location</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">The device location was tracked. Check below:</p>

          <StaticLocationMap />
        </div>

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
              <strong>You have reached the end of your free consultation. I know you're tired of guessing and
              want some real answers.</strong>
            </p>
            <p>
              Our satellite tracking system is the most advanced technology to find out what’s going on. But there’s a catch: keeping the satellites and servers running 24/7 is expensive.
            </p>
            <p>
              That’s why, unfortunately, we can’t provide more than 5% of the information we uncover for free.
            </p>
            <p>The good news? You don’t have to spend a fortune to hire a private investigator.</p>
            <p>
              We’ve developed an app that puts that same technology in your hands and lets you track everything discreetly and efficiently on your own.
            </p>
            <p>
              And the best part? The costs are a fraction of what you’d pay for an investigator – just enough to keep our satellites and system running.
            </p>
            <p>
              It’s time to stop guessing and find out the truth. The answers are waiting for you. Click now and get instant access – before it’s too late!
            </p>
          </div>
        </div>

        {/* Exclusive Discount */}
        <div className="bg-gradient-to-b from-green-600 to-green-800 text-white rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">EXCLUSIVE DISCOUNT</h2>
          <div className="text-4xl font-bold mb-4">$47</div>

          <div className="space-y-2 text-sm mb-6">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>This person recently communicated whith 3 people from (IP)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Our AI detected a suspicious message</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>It was deteced that this person viewed the status of contact ****** 6 times today</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>It was detected that this person archived 2 conversations yesterday</span>
            </div>
          </div>

          <Button className="w-full bg-green-400 hover:bg-green-300 text-green-900 font-bold py-3 text-lg rounded-full">
            BUY NOW →
          </Button>
        </div>

        {/* 30 Days Guarantee */}
        <div className="text-center py-8">
          <div className="inline-block relative">
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-yellow-500">
              <div className="text-center">
                <div className="text-xs font-bold text-red-600">30 DAYS</div>
                <div className="text-xs font-bold text-red-600">GUARANTEE</div>
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">
              GUARANTEE
            </div>
          </div>
        </div>
      </div>

      {/* Conditionally render the popup */}
      {selectedConvoIndex !== null && (
        <ChatPopup
          onClose={() => setSelectedConvoIndex(null)}
          profilePhoto={profilePhoto}
          conversationData={conversations[selectedConvoIndex].chatData}
          conversationName={conversations[selectedConvoIndex].popupName}
        />
      )}
    </div>
  )
}
