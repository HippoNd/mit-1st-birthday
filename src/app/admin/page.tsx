"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GuestInvitation {
  id: string
  name: string
  inviteCode: string
  isInvited: boolean
  createdAt: string
}

interface RSVPData {
  id: string
  guestId: string
  guestName: string
  isAttending: boolean
  submittedAt: string
}

interface RSVPStats {
  totalGuests: number
  totalRSVPs: number
  attendingCount: number
  notAttendingCount: number
  pendingCount: number
}

export default function AdminPage() {
  const [guests, setGuests] = useState<GuestInvitation[]>([])
  const [rsvps, setRsvps] = useState<RSVPData[]>([])
  const [stats, setStats] = useState<RSVPStats | null>(null)
  const [newGuestName, setNewGuestName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      const [guestsResponse, rsvpsResponse, statsResponse] = await Promise.all([
        fetch("/api/guests"),
        fetch("/api/rsvp"),
        fetch("/api/rsvp?stats=true")
      ])
      
      if (!guestsResponse.ok || !rsvpsResponse.ok || !statsResponse.ok) {
        throw new Error("Failed to fetch data")
      }
      
      const guestsData = await guestsResponse.json()
      const rsvpsData = await rsvpsResponse.json()
      const statsData = await statsResponse.json()
      
      setGuests(guestsData)
      setRsvps(rsvpsData)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddGuest = async () => {
    if (!newGuestName.trim()) return

    try {
      setIsLoading(true)
      setError("")
      
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGuestName.trim() }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add guest")
      }
      
      setNewGuestName("")
      await fetchData() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Are you sure you want to delete this guest? This will also delete their RSVP.")) {
      return
    }

    try {
      setIsLoading(true)
      setError("")
      
      const response = await fetch(`/api/guests/${guestId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete guest")
      }
      
      await fetchData() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearDatabase = async () => {
    if (!confirm("Are you sure you want to clear the entire database? This action cannot be undone!")) {
      return
    }

    try {
      setIsLoading(true)
      setError("")
      
      const response = await fetch("/api/guests", {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to clear database")
      }
      
      await fetchData() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyInviteLink = (inviteCode: string) => {
    const inviteLink = `${window.location.origin}/?invite=${inviteCode}`
    navigator.clipboard.writeText(inviteLink)
    alert("Invite link copied to clipboard!")
  }

  if (isLoading && guests.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F8C8DC] mx-auto mb-4"></div>
          <p className="text-[#6A6A6A]">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#F8C8DC] mb-2" style={{ fontFamily: "var(--font-script)" }}>
            Admin Panel
          </h1>
          <p className="text-[#6A6A6A]">Manage guests and RSVPs</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-4 bg-white border-[#FFD1DC] border-2 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-[#F8C8DC]">{stats.totalGuests}</h3>
              <p className="text-sm text-[#6A6A6A]">Total Guests</p>
            </Card>
            <Card className="p-4 bg-white border-[#FFD1DC] border-2 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-[#F8C8DC]">{stats.totalRSVPs}</h3>
              <p className="text-sm text-[#6A6A6A]">Total RSVPs</p>
            </Card>
            <Card className="p-4 bg-white border-[#FFD1DC] border-2 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-green-600">{stats.attendingCount}</h3>
              <p className="text-sm text-[#6A6A6A]">Attending</p>
            </Card>
            <Card className="p-4 bg-white border-[#FFD1DC] border-2 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-red-600">{stats.notAttendingCount}</h3>
              <p className="text-sm text-[#6A6A6A]">Not Attending</p>
            </Card>
            <Card className="p-4 bg-white border-[#FFD1DC] border-2 rounded-2xl text-center">
              <h3 className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</h3>
              <p className="text-sm text-[#6A6A6A]">Pending</p>
            </Card>
          </div>
        )}

        {/* Add Guest Form */}
        <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
            Add New Guest
          </h2>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Guest name"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleAddGuest()}
            />
            <Button
              onClick={handleAddGuest}
              disabled={isLoading || !newGuestName.trim()}
              className="bg-[#FFD1DC] hover:bg-[#F8C8DC] text-[#4A4A4A] px-6"
            >
              {isLoading ? "Adding..." : "Add Guest"}
            </Button>
          </div>
        </Card>

        {/* Clear Database Button */}
        <div className="mb-8 text-center">
          <Button
            onClick={handleClearDatabase}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-2xl"
          >
            {isLoading ? "Clearing..." : "🗑️ Clear Database"}
          </Button>
        </div>

        {/* Guests List */}
        <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-2xl">
          <h2 className="text-2xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
            Guest List
          </h2>
          
          {guests.length === 0 ? (
            <p className="text-[#6A6A6A] text-center py-8">No guests found</p>
          ) : (
            <div className="space-y-4">
              {guests.map((guest) => {
                const guestRSVP = rsvps.find(rsvp => rsvp.guestId === guest.id)
                return (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between p-4 bg-[#FAF0E6] rounded-2xl border border-[#FFD1DC]"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#4A4A4A]">{guest.name}</h3>
                      <p className="text-sm text-[#6A6A6A]">
                        Invite Code: <code className="bg-white px-2 py-1 rounded">{guest.inviteCode}</code>
                      </p>
                      <p className="text-sm text-[#6A6A6A]">
                        Status: {guestRSVP ? (
                          <span className={`font-semibold ${guestRSVP.isAttending ? 'text-green-600' : 'text-red-600'}`}>
                            {guestRSVP.isAttending ? '✅ Attending' : '❌ Not Attending'}
                          </span>
                        ) : (
                          <span className="text-yellow-600 font-semibold">⏳ Pending</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyInviteLink(guest.inviteCode)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded-xl"
                      >
                        📋 Copy Link
                      </Button>
                      <Button
                        onClick={() => handleDeleteGuest(guest.id)}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-xl"
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}