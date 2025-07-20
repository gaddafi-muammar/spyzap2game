"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Phone, X, Lock, CheckCheck } from "lucide-react"
import Image from "next/image"

// Define the shape of a single message
type Message = {
  type: "incoming" | "outgoing"
  content: string
  time: string
  isBlocked?: boolean
}

// 1. UPDATED: ChatPopup is now dynamic and accepts props for chat data and title
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
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
                "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
              }
              alt="Profile"
              width={40}
              height={40}
              className="object-cover h-full w-full filter blur-sm"
              unoptimized
            />
          </div>
          <div className="flex items-center gap-2">
            {/* The name is now dynamic */}
            <span className="font-semibold">{conversationName.replace("🔒", "").trim()}</span>
            {/* Show lock icon if name includes it */}
            {conversationName.includes("🔒") && <Lock className="h-4 w-4" />}
          </div>
        </div>

        {/* Chat Body - Renders messages dynamically */}
        <div className="bg-gray-200 p-4 space-y-4 h-[28rem] overflow-y-scroll">
          {conversationData.map((msg, index) =>
            msg.type === "incoming" ? (
              // Incoming Message
              <div key={index} className="flex justify-start">
                <div className="bg-white rounded-lg p-3 max-w-[80%] shadow">
                  <p className={`text-sm ${msg.isBlocked ? "font-semibold text-red-500" : "text-gray-800"}`}>
                    {msg.content}
                  </p>
                  <p className="text-right text-xs text-gray-400 mt-1">{msg.time}</p>
                </div>
              </div>
            ) : (
              // Outgoing Message
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
  // 2. UPDATED: State now tracks the *index* of the selected conversation, or null if none is open
  const [selectedConvoIndex, setSelectedConvoIndex] = useState<number | null>(null)

  useEffect(() => {
    const storedPhoto = localStorage.getItem("profilePhoto")
    setProfilePhoto(
      storedPhoto ||
        "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    )
  }, [])

  const maleImages = [
    "/images/male/303.png",
    "/images/male/7.png",
    "/images/male/6.png",
    "/images/male/5.png",
    "/images/male/9.png",
    "/images/male/4.png",
  ]

  // 3. UPDATED: Conversation data now includes the full chat history for each popup
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
      msg: "Suspicious photos found", // Message updated as per your request
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
            <span className="font-semibold">148 suspicious conversations</span> were found during the analysis. The
            system was able to recover <span className="font-semibold">deleted messages</span> and some were classified
            as critical based on the content.
          </p>
          <p className="text-xs text-gray-500 mb-4">See the conversations in your Report</p>

          <div className="space-y-3">
            {/* 4. UPDATED: onClick now sets the index of the clicked conversation */}
            {conversations.map((convo, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedConvoIndex(index)} // This opens the specific popup
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                    <Image
                      src={convo.img}
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
            <span className="font-semibold">5 compromising audios</span> were recovered during the analysis.
            Additionally, the system found <span className="font-semibold">247 deleted photos</span> that may contain
            sensitive content.
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
            The system scanned <span className="font-semibold">4,327 messages</span> and identified several keywords
            that may indicate suspicious behavior.
          </p>

          <div className="space-y-2">
            {["Yes!", "Love", "Secret", "Baby", "Don't tell"].map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{keyword}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Suspicious Location */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Suspicious Location</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">The device location was tracked. Check below:</p>

          <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500">Map showing location in Lisbon</p>
            </div>
          </div>
        </div>

        {/* Phone Display */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Phone className="h-32 w-20 text-gray-400" />
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <strong>You have reached the end of your free consultation.</strong> I know you're tired of guessing and
              want some real answers.
            </p>
            <p>
              Our satellite tracking system is the most advanced technology to find out what's going on. But there's a
              catch: querying the satellites and servers running 24/7 is expensive.
            </p>
            <p>
              That's why, unfortunately, we can't provide <strong>free</strong> full access to the information we
              uncover for everyone.
            </p>
            <p>The good news? You don't have to spend a fortune to have a private investigator.</p>
            <p>
              We've developed an app that puts that same technology in your hands and lets you track everything
              discreetly and efficiently on your own device.
            </p>
            <p>
              And the best part? The costs are a fraction of what you'd pay for an investigator - just enough to keep
              our satellites and servers running.
            </p>
            <p>
              It's time to stop guessing and get the answers you deserve. You can try our{" "}
              <strong>ONE full report service</strong> - before it's too late.
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
              <span>This person's recently communicated details + private phone data</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Our AI detected a suspicious message</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>I was detected that this person cannot be trusted (TRUTH & dates today)</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>I was detected that this person cannot be trusted (TRUTH & dates yesterday)</span>
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

      {/* 5. UPDATED: Conditionally render the popup, passing the correct data */}
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
