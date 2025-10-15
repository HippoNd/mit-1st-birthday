"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"

export default function EventDetails() {
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-4 bg-[#FBFBFB] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-5xl md:text-6xl font-bold text-center mb-12 text-[#F8C8DC]"
          style={{ fontFamily: "var(--font-script)" }}
        >
          Event Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🕐</span>
              <div>
                <h3 className="text-2xl font-semibold text-[#4A4A4A] mb-2">Time</h3>
                <p className="text-lg text-[#6A6A6A]">18:30 - 20:00</p>
                <p className="text-sm text-[#8A8A8A] mt-1">Saturday Afternoon</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <img
                src="/october-25-icon.webp"
                alt="Birthday celebration"
                className="w-10 h-10 object-cover"
              />
              <div>
                <h3 className="text-2xl font-semibold text-[#4A4A4A] mb-2">Date</h3>
                <p className="text-lg text-[#6A6A6A]">October 25th, 2025</p>
                <p className="text-sm text-[#8A8A8A] mt-1">{"Don't miss the fun!"}</p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-lg hover:shadow-xl transition-shadow md:col-span-2">
            <div className="flex items-start gap-4">
              <span className="text-4xl">📍</span>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-[#4A4A4A] mb-2">Location</h3>
                <p className="text-lg text-[#6A6A6A] mb-4">Làng cổ Gia Hưng, Tổ 5 Đ. Kênh, Lộc Vượng, Nam Định</p>
                <div className="w-full h-64 bg-[#FAF0E6] rounded-2xl flex items-center justify-center border-2 border-[#E0E0E0]">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.6615825616427!2d106.16199317527419!3d20.438003081067635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135e76195126523%3A0x6afedb5562d2ab85!2zTmjDoCBow6BuZyBMw6BuZyBj4buVIEdpYSBIxrBuZw!5e0!3m2!1sen!2s!4v1760520782547!5m2!1sen!2s" className="border-0 w-full h-full rounded-2xl" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
