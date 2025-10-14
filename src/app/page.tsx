import HeroSection from "@/components/hero-section"
import EventDetails from "@/components/event-details"
import PhotoGallery from "@/components/photo-gallery"
import SmartRSVP from "@/components/smart-rsvp"

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  return (
    <main className="min-h-screen">
      <HeroSection />
      <EventDetails />
      <PhotoGallery />
      <SmartRSVP inviteCode={params.invite as string} />
    </main>
  )
}
