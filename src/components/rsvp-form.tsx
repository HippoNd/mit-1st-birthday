"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RSVPForm() {
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    adults: "",
    children: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // Here you would typically send the data to your backend
    console.log("RSVP submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
          {submitted ? (
            <div className="text-center py-8">
              <span className="text-7xl mb-4 block">🎉</span>
              <h3 className="text-4xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
                Thank You!
              </h3>
              <p className="text-lg text-[#6A6A6A]">{"We're so excited to celebrate with you!"}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg text-[#4A4A4A] font-medium">
                  Guest Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 rounded-2xl border-2 border-[#E0E0E0] focus:border-[#FFD1DC] text-lg"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adults" className="text-lg text-[#4A4A4A] font-medium">
                    Number of Adults
                  </Label>
                  <Input
                    id="adults"
                    name="adults"
                    type="number"
                    min="0"
                    required
                    value={formData.adults}
                    onChange={handleChange}
                    className="h-12 rounded-2xl border-2 border-[#E0E0E0] focus:border-[#FFD1DC] text-lg"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="children" className="text-lg text-[#4A4A4A] font-medium">
                    Number of Children
                  </Label>
                  <Input
                    id="children"
                    name="children"
                    type="number"
                    min="0"
                    required
                    value={formData.children}
                    onChange={handleChange}
                    className="h-12 rounded-2xl border-2 border-[#E0E0E0] focus:border-[#FFD1DC] text-lg"
                    placeholder="0"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-semibold rounded-2xl bg-[#FFD1DC] hover:bg-[#F8C8DC] text-[#4A4A4A] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Confirm RSVP ✨
              </Button>
            </form>
          )}
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
