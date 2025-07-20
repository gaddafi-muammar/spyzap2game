"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export default function Step4Male() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  useEffect(() => {
    // Get profile photo from localStorage (saved in step 2)
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Rachel B</p>
                  <p className="text-xs text-gray-500">Good morning message</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">Yesterday</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Rachel B</p>
                  <p className="text-xs text-gray-500">Message deleted</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">2 days ago</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-400 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Rachel B</p>
                  <p className="text-xs text-gray-500">Suspicious phone found</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">3 days ago</span>
            </div>
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
    </div>
  )
}
