"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Guest {
  id: string
  name: string
  inviteCode: string
}

interface RSVPResponse {
  guest: Guest
  hasRSVPed: boolean
  rsvp: {
    id: string
    isAttending: boolean
    submittedAt: string
  } | null
}

function SmartRSVPContent() {
  const [isVisible, setIsVisible] = useState(false)
  const [guestData, setGuestData] = useState<RSVPResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isAttending, setIsAttending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rsvpId, setRsvpId] = useState("")
  const sectionRef = useRef<HTMLElement>(null)
  const searchParams = useSearchParams()

  // Check for invite code in URL
  const inviteCode = searchParams.get('invite')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Fetch guest data if invite code is present
  useEffect(() => {
    if (inviteCode) {
      const fetchGuestData = async () => {
        try {
          setIsLoading(true)
          setError('')
          
          const response = await fetch(`/api/rsvp/invite/${inviteCode}`)
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to fetch guest data')
          }
          
          const data = await response.json()
          setGuestData(data)
          
          if (data.hasRSVPed && data.rsvp) {
            setIsAttending(data.rsvp.isAttending)
            setSubmitted(true)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
          setIsLoading(false)
        }
      }

      fetchGuestData()
    }
  }, [inviteCode])

  const handleSubmit = async () => {
    if (!inviteCode || !guestData) return

    try {
      setIsSubmitting(true)
      setError('')
      
      const response = await fetch(`/api/rsvp/invite/${inviteCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAttending
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit RSVP')
      }
      
      const result = await response.json()
      setRsvpId(result.id)
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  // If there's an invite code but still loading
  if (inviteCode && isLoading) {
    return (
      <section
        ref={sectionRef}
        className={`py-20 px-4 bg-[#FAF0E6] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#F8C8DC]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            RSVP
          </h2>
          <p className="text-center text-lg text-[#6A6A6A] mb-12">{"We can't wait to celebrate with you!"}</p>

          <Card className="p-8 md:p-12 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F8C8DC] mx-auto mb-4"></div>
              <p className="text-[#6A6A6A]">Loading your invitation...</p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  // If there's an invite code but error occurred
  if (inviteCode && error) {
    return (
      <section
        ref={sectionRef}
        className={`py-20 px-4 bg-[#FAF0E6] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#F8C8DC]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            RSVP
          </h2>
          <p className="text-center text-lg text-[#6A6A6A] mb-12">{"We can't wait to celebrate with you!"}</p>

          <Card className="p-8 md:p-12 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl">
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">😞</span>
              <h3 className="text-2xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
                Oops!
              </h3>
              <p className="text-[#6A6A6A] mb-6">{error}</p>
              <p className="text-sm text-[#8A8A8A]">
                Please check your invitation link or contact the host.
              </p>
            </div>
          </Card>
        </div>
      </section>
    )
  }

  // If there's an invite code and guest data is loaded
  if (inviteCode && guestData) {
    return (
      <section
        ref={sectionRef}
        className={`py-20 px-4 bg-[#FAF0E6] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#F8C8DC]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            🎉 Mit's 1st Birthday! 🎉
          </h2>
          <p className="text-center text-lg text-[#6A6A6A]">You're invited to celebrate!</p>

          <Card className="p-8 md:p-12 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl">
            {submitted ? (
              <div className="text-center py-8">
                <span className="text-7xl mb-4 block">
                  {isAttending ? "🎉" : "😢"}
                </span>
                <h3 className="text-4xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
                  {isAttending ? "Thank You!" : "We'll Miss You!"}
                </h3>
                <p className="text-lg text-[#6A6A6A] mb-4">
                  {isAttending 
                    ? `Hi ${guestData.guest.name}! We're so excited to celebrate with you!`
                    : `Hi ${guestData.guest.name}! We understand you can't make it. We'll miss you!`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-[#F8C8DC] mb-2" style={{ fontFamily: "var(--font-script)" }}>
                    Hello, {guestData.guest.name}! 👋
                  </h3>
                  <p className="text-lg text-[#6A6A6A]">
                    We would love to celebrate Mit's special day with you!
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-lg text-[#4A4A4A] mb-6">
                      Will you be joining us for the celebration?
                    </p>
                    
                    <div className="space-y-4">
                      <label className="flex items-center justify-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="attendance"
                          checked={isAttending === true}
                          onChange={() => setIsAttending(true)}
                          className="w-5 h-5 text-[#F8C8DC] border-2 border-[#FFD1DC] focus:ring-[#F8C8DC]"
                        />
                        <span className="text-xl text-[#4A4A4A] font-medium">
                          🎉 Yes, I'll be there!
                        </span>
                      </label>
                      
                      <label className="flex items-center justify-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="attendance"
                          checked={isAttending === false}
                          onChange={() => setIsAttending(false)}
                          className="w-5 h-5 text-[#F8C8DC] border-2 border-[#FFD1DC] focus:ring-[#F8C8DC]"
                        />
                        <span className="text-xl text-[#4A4A4A] font-medium">
                          😢 Sorry, I can't make it
                        </span>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg font-semibold rounded-2xl bg-[#FFD1DC] hover:bg-[#F8C8DC] text-[#4A4A4A] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm RSVP ✨"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>
    )
  }

  // Default RSVP form (no invite code)
  return (
    <section
      ref={sectionRef}
      className={`py-20 px-4 bg-[#FAF0E6] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#F8C8DC]"
          style={{ fontFamily: "var(--font-script)" }}
        >
          RSVP
        </h2>
        <p className="text-center text-lg text-[#6A6A6A] mb-12">{"We can't wait to celebrate with you!"}</p>

        <Card className="p-8 md:p-12 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl">
          <div className="text-center py-8">
            <span className="text-7xl mb-4 block">🎉</span>
            <h3 className="text-3xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
              Join the Celebration!
            </h3>
            <p className="text-lg text-[#6A6A6A] mb-6">
              If you received a personal invitation link, please use that to RSVP. 
              Otherwise, you can contact the host directly.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-[#8A8A8A]">
                📧 Contact: [Host Email/Phone]
              </p>
              <p className="text-sm text-[#8A8A8A]">
                📅 Date: [Event Date]
              </p>
              <p className="text-sm text-[#8A8A8A]">
                📍 Location: [Event Location]
              </p>
            </div>
          </div>
        </Card>

        {/* Decorative Footer */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-3 mb-4">
            <span className="text-4xl animate-float">🎈</span>
            <span className="text-4xl animate-float" style={{ animationDelay: "0.5s" }}>
              💕
            </span>
            <span className="text-4xl animate-float" style={{ animationDelay: "1s" }}>
              🎈
            </span>
          </div>
          <p className="text-[#8A8A8A] text-sm">{"See you at Mit's special day!"}</p>
        </div>
      </div>
    </section>
  )
}

export default function SmartRSVP() {
  return (
    <Suspense fallback={
      <section className="py-20 px-4 bg-[#FAF0E6]">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#F8C8DC]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            RSVP
          </h2>
          <p className="text-center text-lg text-[#6A6A6A] mb-12">{"We can't wait to celebrate with you!"}</p>

          <Card className="p-8 md:p-12 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F8C8DC] mx-auto mb-4"></div>
              <p className="text-[#6A6A6A]">Loading...</p>
            </div>
          </Card>
        </div>
      </section>
    }>
      <SmartRSVPContent />
    </Suspense>
  )
}
