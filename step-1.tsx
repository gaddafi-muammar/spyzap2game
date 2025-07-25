"use client"

import { Button } from "@/components/ui/button"
import { User, Menu, Download } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Step1() {
  const router = useRouter()

  const handleSelection = (gender: "male" | "female") => {
    // Store selection in localStorage or state management
    localStorage.setItem("selectedGender", gender)
    router.push("/step-2")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Menu className="h-6 w-6" />
        </Button>
        <Button size="icon" className="bg-green-500 hover:bg-green-600 text-white rounded-full h-12 w-12">
          <Download className="h-6 w-6" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Protect Your Relationship</h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            Discover how to keep your relationship safe and healthy with our exclusive solution.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 w-full max-w-md">
          <Button
  onClick={() => handleSelection("male")}
  className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-2xl flex items-center justify-start px-6 gap-4"
>
  <div className="bg-white rounded-full p-2">
    <User className="h-6 w-6 text-green-500" />
  </div>
  <span>
    I Want to Monitor My Partner
    <br className="sm:hidden" /> {/* Adicione esta linha */}
    (Male)
  </span>
</Button>

          <Button
  onClick={() => handleSelection("female")}
  className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-lg font-medium rounded-2xl flex items-center justify-start px-6 gap-4"
>
  <div className="bg-white rounded-full p-2">
    <User className="h-6 w-6 text-green-500" />
  </div>
  <span>
    I Want to Monitor My Partner
    <br className="sm:hidden" /> {/* Quebra de linha adicionada aqui */}
    (Female)
  </span>
</Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="pb-8 px-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-8 text-sm">
            <Link href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-blue-500 hover:underline">
              Terms of Use
            </Link>
            <Link href="#" className="text-blue-500 hover:underline">
              Email Support
            </Link>
          </div>
          <p className="text-gray-400 text-sm">© 2024 Protect Your Relationship. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
