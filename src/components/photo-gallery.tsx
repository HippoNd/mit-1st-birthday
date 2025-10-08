"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export default function PhotoGallery() {
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

  const photos = [
    {
      src: "/mit-phun-mua.mp4",
      alt: "Baby with birthday cake",
    },
    {
      src: "/mit-phun-mua.mp4",
      alt: "Baby playing with balloons",
    },
    {
      src: "/mit-phun-mua.mp4",
      alt: "Baby in party dress",
    },
    {
      src: "/mit-phun-mua.mp4",
      alt: "Baby with presents",
    },
  ]

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-4 bg-gradient-to-b from-[#FBFBFB] to-[#FAF0E6] transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-5xl md:text-6xl font-bold text-center mb-12 text-[#F8C8DC]"
          style={{ fontFamily: "var(--font-script)" }}
        >
          Sweet Memories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-auto rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow transform duration-300 border-4 border-white">
                <video src={photo.src || "/placeholder.svg"} autoPlay muted loop className="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
