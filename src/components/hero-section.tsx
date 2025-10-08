"use client"

import { useEffect, useState } from "react"

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Elements */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute top-20 left-10 text-8xl animate-float">🎈</div>
        <div className="absolute top-40 right-20 text-6xl animate-float" style={{ animationDelay: "1s" }}>
          ⭐
        </div>
        <div className="absolute bottom-40 left-1/4 text-7xl animate-float" style={{ animationDelay: "2s" }}>
          👑
        </div>
        <div className="absolute top-1/3 right-1/4 text-6xl animate-float" style={{ animationDelay: "1.5s" }}>
          🎀
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div
          className="mb-8"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <h1
            className="text-6xl md:text-8xl font-bold mb-8 text-[#FFD1DC]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            {"Celebrating Mit's"}
          </h1>
          <h2
            className="text-6xl md:text-8xl font-bold text-[#FFD1DC]"
            style={{ fontFamily: "var(--font-script)" }}
          >
            1st Birthday!
          </h2>
        </div>

        <div className="flex justify-center my-8">
          <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden border-8 border-white shadow-2xl">
            <img
              src="/mit-hero-section.jpg"
              alt="Birthday celebration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="playful wrap" aria-label="Wash your hands">
          <span aria-hidden="true">N</span><span aria-hidden="true">g</span><span aria-hidden="true">u</span><span aria-hidden="true">y</span><span aria-hidden="true">e</span><span aria-hidden="true">n</span><span aria-hidden="true"> </span><span aria-hidden="true">n</span><span aria-hidden="true">g</span><span aria-hidden="true">o</span><span aria-hidden="true">c</span><span aria-hidden="true"> </span><span aria-hidden="true">h</span><span aria-hidden="true">a</span><span aria-hidden="true">n</span>
        </div>
      </div>
    </section>
  )
}
