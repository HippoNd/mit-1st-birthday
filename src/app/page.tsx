import HeroSection from "@/components/hero-section"
import EventDetails from "@/components/event-details"
import PhotoGallery from "@/components/photo-gallery"
import SmartRSVP from "@/components/smart-rsvp"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <EventDetails />
      <PhotoGallery />
      <SmartRSVP />
    </main>
  )
}
