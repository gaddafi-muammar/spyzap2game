"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Loader2, CheckCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProgressStep {
  id: string
  text: string
  status: "pending" | "loading" | "completed"
}

export default function Step3() {
  const router = useRouter()
  
  // State for data from Step 2
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [location, setLocation] = useState<string>("Detecting location...")

  // State for loading simulation
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // Fetch IP-based location and data from localStorage on mount
  useEffect(() => {
    // Retrieve data from Step 2
    const storedPhone = localStorage.getItem("phoneNumber")
    const storedPhoto = localStorage.getItem("profilePhoto")
    
    setPhoneNumber(storedPhone || "Number not found")
    setProfilePhoto(storedPhoto || "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=")

    // Fetch user's location based on their IP address
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        if (!response.ok) throw new Error("Failed to fetch location")
        const data = await response.json()
        setLocation(data.city || "Unknown Location")
      } catch (error) {
        console.error("Location fetch error:", error)
        setLocation("Unknown Location") // Fallback
      }
    }
    
    fetchLocation()
  }, [])

  // Memoize the steps array to update dynamically when location is fetched
  const steps: ProgressStep[] = useMemo(() => [
    { id: "initiating", text: "Initiating connection with WhatsApp servers...", status: "pending" },
    { id: "locating", text: "Locating the nearest server...", status: "pending" },
    { id: "establishing", text: "Server located! Establishing secure connection...", status: "pending" },
    { id: "verifying", text: "Verifying phone number...", status: "pending" },
    { id: "valid", text: "Valid phone number", status: "pending" },
    { id: "analyzing", text: "Analyzing database...", status: "pending" },
    { id: "fetching", text: "Fetching profile information...", status: "pending" },
    { id: "detecting", text: "Detecting device location...", status: "pending" },
    { id: "suspicious", text: `Suspicious location found in ${location}`, status: "pending" },
    { id: "preparing", text: "Preparing private reading channel...", status: "pending" },
    { id: "established", text: "Private channel established!", status: "pending" },
    { id: "synchronizing", text: "Synchronizing messages...", status: "pending" },
    { id: "complete", text: "Synchronization complete!", status: "pending" },
    { id: "granted", text: "Access successfully granted!", status: "pending" },
  ], [location]);

  const [currentSteps, setCurrentSteps] = useState<ProgressStep[]>([])

  // Initialize steps once the base `steps` array is ready
  useEffect(() => {
    if (steps.length > 0) {
      setCurrentSteps(steps.map((step, index) => index === 0 ? { ...step, status: 'loading' } : step));
    }
  }, [steps]);


  // Timer for progress bar and step completion
  useEffect(() => {
    if (!steps.length) return; // Don't run timers until steps are initialized

    const totalDuration = 45 * 1000; // 45 seconds total duration
    const stepInterval = totalDuration / steps.length;
    const progressInterval = 100; // Update progress bar every 100ms for smoothness

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          setIsCompleted(true)
          return 100
        }
        return prev + (100 / (totalDuration / progressInterval));
      })
    }, progressInterval)

    const stepTimer = setInterval(() => {
       setCurrentStepIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex < steps.length) {
          setCurrentSteps(current => 
            current.map((step, index) => {
              if (index < nextIndex) return { ...step, status: 'completed' };
              if (index === nextIndex) return { ...step, status: 'loading' };
              return step;
            })
          );
          return nextIndex;
        } else {
          // Final step completed
          setCurrentSteps(current => current.map(step => ({ ...step, status: 'completed' })));
          clearInterval(stepTimer);
          return prev;
        }
      });
    }, stepInterval);

    return () => {
      clearInterval(progressTimer)
      clearInterval(stepTimer)
    }
  }, [steps])

  const handleViewReport = () => {
    router.push("/step-4") // Or your final step page
  }

  // Helper to format the phone number
  const formattedPhone = phoneNumber ? phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') : 'Loading...';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8 gap-6">
      {/* VSL Card - Top */}
      <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-2xl">
        <div className="aspect-video bg-black rounded-md flex items-center justify-center overflow-hidden">
          {/* Replace with your actual video player component */}
          <video src="/path-to-your-video.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Connection/Profile Card - Bottom */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
        {/* Profile Info - Always Visible */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300">
            {profilePhoto ? (
               <Image
                src={profilePhoto}
                alt="WhatsApp Profile"
                width={64}
                height={64}
                className="object-cover h-full w-full"
                unoptimized
              />
            ) : (
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            )}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-800 text-lg">WhatsApp Profile</h3>
            <p className="text-gray-600">{phoneNumber || "Loading number..."}</p>
            <div className="flex items-center gap-1.5 text-green-600 text-sm mt-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content: Loading or Completed */}
        {!isCompleted ? (
          // Loading State
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">{currentSteps[currentStepIndex]?.text || "Connecting..."}</span>
                <span className="text-green-600 font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {currentSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-3 text-sm">
                  <div className="flex-shrink-0 w-4 h-4 mt-0.5">
                    {step.status === "loading" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    ) : step.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                       <div className="h-3.5 w-3.5 mt-px rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <span className={`${step.status === "completed" ? "text-green-600 font-medium" : "text-gray-600"}`}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Completed State
          <div className="text-center py-4">
             <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-800 mb-2">Synchronization Complete!</h3>
             <p className="text-gray-600 mb-6">Your private access has been successfully established.</p>
            <Button
              onClick={handleViewReport}
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-lg"
            >
              View Full Report Now
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-2xl text-center py-4">
        <div className="flex justify-center space-x-6 text-sm mb-3">
          <Link href="#" className="text-gray-500 hover:text-blue-500">Privacy Policy</Link>
          <Link href="#" className="text-gray-500 hover:text-blue-500">Terms of Use</Link>
          <Link href="#" className="text-gray-500 hover:text-blue-500">Email Support</Link>
        </div>
        <p className="text-gray-400 text-xs">© 2024 Protect Your Relationship. All rights reserved.</p>
      </footer>
    </div>
  )
}
