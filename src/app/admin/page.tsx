"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RSVPStats {
  totalGuests: number
  totalRSVPs: number
  attendingCount: number
  notAttendingCount: number
  pendingCount: number
}

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

export default function AdminPage() {
  const [stats, setStats] = useState<RSVPStats | null>(null)
  const [guests, setGuests] = useState<GuestInvitation[]>([])
  const [rsvps, setRsvps] = useState<RSVPData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [newGuestName, setNewGuestName] = useState('')
  const [isAddingGuest, setIsAddingGuest] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      console.log('Fetching data...')
      
      // Fetch statistics
      const statsResponse = await fetch('/api/rsvp?stats=true')
      console.log('Stats response:', statsResponse.status)
      if (!statsResponse.ok) throw new Error('Failed to fetch statistics')
      const statsData = await statsResponse.json()
      console.log('Stats data:', statsData)
      setStats(statsData)
      
      // Fetch all guests
      const guestsResponse = await fetch('/api/guests')
      console.log('Guests response:', guestsResponse.status)
      if (!guestsResponse.ok) throw new Error('Failed to fetch guests')
      const guestsData = await guestsResponse.json()
      console.log('Guests data:', guestsData)
      setGuests(guestsData)
      
      // Fetch all RSVPs
      const rsvpsResponse = await fetch('/api/rsvp')
      console.log('RSVPs response:', rsvpsResponse.status)
      if (!rsvpsResponse.ok) throw new Error('Failed to fetch RSVPs')
      const rsvpsData = await rsvpsResponse.json()
      console.log('RSVPs data:', rsvpsData)
      setRsvps(rsvpsData)
      
      console.log('Data fetch completed successfully')
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuestName.trim()) return

    try {
      setIsAddingGuest(true)
      setError('')
      
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGuestName.trim()
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add guest')
      }
      
      setNewGuestName('')
      await fetchData() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAddingGuest(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F8C8DC] mx-auto mb-4"></div>
          <p className="text-[#6A6A6A]">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF0E6] flex items-center justify-center">
        <Card className="p-8 max-w-md mx-auto bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl">
          <div className="text-center">
            <span className="text-6xl mb-4 block">😞</span>
            <h2 className="text-2xl font-bold text-[#F8C8DC] mb-4">Error</h2>
            <p className="text-[#6A6A6A] mb-6">{error}</p>
            <Button 
              onClick={fetchData}
              className="bg-[#FFD1DC] hover:bg-[#F8C8DC] text-[#4A4A4A]"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF0E6] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
            RSVP Admin
          </h1>
          <p className="text-lg text-[#6A6A6A]">Mit's 1st Birthday Party RSVP Management</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-2xl shadow-lg text-center">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="text-2xl font-bold text-[#F8C8DC]">{stats.totalGuests}</h3>
              <p className="text-[#6A6A6A]">Total Guests</p>
            </Card>
            
            <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-2xl shadow-lg text-center">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="text-2xl font-bold text-[#F8C8DC]">{stats.totalRSVPs}</h3>
              <p className="text-[#6A6A6A]">Total RSVPs</p>
            </Card>
            
            <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-2xl shadow-lg text-center">
              <div className="text-3xl mb-2">🎉</div>
              <h3 className="text-2xl font-bold text-[#F8C8DC]">{stats.attendingCount}</h3>
              <p className="text-[#6A6A6A]">Attending</p>
            </Card>
            
            <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-2xl shadow-lg text-center">
              <div className="text-3xl mb-2">😢</div>
              <h3 className="text-2xl font-bold text-[#F8C8DC]">{stats.notAttendingCount}</h3>
              <p className="text-[#6A6A6A]">Not Attending</p>
            </Card>
            
            <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-2xl shadow-lg text-center">
              <div className="text-3xl mb-2">⏳</div>
              <h3 className="text-2xl font-bold text-[#F8C8DC]">{stats.pendingCount}</h3>
              <p className="text-[#6A6A6A]">Pending</p>
            </Card>
          </div>
        )}

        {/* Add Guest Form */}
        <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-[#F8C8DC] mb-4" style={{ fontFamily: "var(--font-script)" }}>
            Add New Guest
          </h2>
          <form onSubmit={handleAddGuest} className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="guestName" className="text-sm text-[#4A4A4A] font-medium">
                Guest Name
              </Label>
              <Input
                id="guestName"
                type="text"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="Enter guest name"
                className="h-10 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FFD1DC]"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isAddingGuest || !newGuestName.trim()}
              className="h-10 px-6 bg-[#FFD1DC] hover:bg-[#F8C8DC] text-[#4A4A4A] rounded-xl disabled:opacity-50"
            >
              {isAddingGuest ? "Adding..." : "Add Guest"}
            </Button>
          </form>
        </Card>

        {/* Guest List */}
        <Card className="p-6 bg-white border-[#FFD1DC] border-2 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#F8C8DC]" style={{ fontFamily: "var(--font-script)" }}>
              Guest List & RSVPs
            </h2>
            <Button 
              onClick={fetchData}
              className="bg-[#FFD1DC] hover:bg-[#F8C8DC] text-[#4A4A4A]"
            >
              Refresh
            </Button>
          </div>
          
          {guests.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">👥</span>
              <p className="text-[#6A6A6A] text-lg">No guests added yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#FFD1DC]">
                    <th className="text-left py-3 px-4 text-[#4A4A4A] font-semibold">Guest Name</th>
                    <th className="text-left py-3 px-4 text-[#4A4A4A] font-semibold">Invite Link</th>
                    <th className="text-center py-3 px-4 text-[#4A4A4A] font-semibold">Status</th>
                    <th className="text-center py-3 px-4 text-[#4A4A4A] font-semibold">Response</th>
                    <th className="text-left py-3 px-4 text-[#4A4A4A] font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest) => {
                    const rsvp = rsvps.find(r => r.guestId === guest.id)
                    const status = rsvp ? 'Responded' : 'Pending'
                    const response = rsvp ? (rsvp.isAttending ? '🎉 Attending' : '😢 Not Attending') : '⏳ Pending'
                    
                    return (
                      <tr key={guest.id} className="border-b border-[#F0F0F0] hover:bg-[#FAF0E6]">
                        <td className="py-3 px-4 text-[#4A4A4A] font-medium">{guest.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-[#F0F0F0] px-2 py-1 rounded">
                              ?invite={guest.inviteCode}
                            </code>
                            <Button
                              size="sm"
                              onClick={() => {
                                const fullUrl = `${window.location.origin}?invite=${guest.inviteCode}`
                                navigator.clipboard.writeText(fullUrl)
                              }}
                              className="text-xs bg-[#FFD1DC] hover:bg-[#F8C8DC] text-[#4A4A4A] px-2 py-1"
                            >
                              Copy
                            </Button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status === 'Responded' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-[#4A4A4A]">{response}</td>
                        <td className="py-3 px-4 text-[#6A6A6A] text-sm">
                          {rsvp ? formatDate(rsvp.submittedAt) : '-'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
