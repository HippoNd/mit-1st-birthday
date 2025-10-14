import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join } from 'path'

// Define the data structure
export interface GuestInvitation {
  id: string
  name: string
  inviteCode: string
  isInvited: boolean
  createdAt: string
}

export interface RSVPData {
  id: string
  guestId: string
  guestName: string
  isAttending: boolean
  submittedAt: string
}

export interface DatabaseSchema {
  guests: GuestInvitation[]
  rsvps: RSVPData[]
}

// Database file path
const file = join(process.cwd(), 'data', 'db.json')

// Initialize database
const adapter = new JSONFile<DatabaseSchema>(file)
const defaultData: DatabaseSchema = { guests: [], rsvps: [] }
const db = new Low(adapter, defaultData)

// Initialize database
export const initDatabase = async (): Promise<void> => {
  await db.read()
  if (!db.data) {
    db.data = defaultData
    await db.write()
  }
}

// Guest Management Functions
export const getAllGuests = async (): Promise<GuestInvitation[]> => {
  await db.read()
  return db.data?.guests || []
}

export const addGuest = async (name: string): Promise<GuestInvitation> => {
  await db.read()
  
  const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase()
  
  const newGuest: GuestInvitation = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    inviteCode,
    isInvited: true,
    createdAt: new Date().toISOString()
  }
  
  if (!db.data) {
    db.data = defaultData
  }
  
  db.data.guests.push(newGuest)
  await db.write()
  
  return newGuest
}

export const getGuestByInviteCode = async (inviteCode: string): Promise<GuestInvitation | null> => {
  await db.read()
  return db.data?.guests.find(guest => guest.inviteCode === inviteCode) || null
}

export const getGuestById = async (id: string): Promise<GuestInvitation | null> => {
  await db.read()
  return db.data?.guests.find(guest => guest.id === id) || null
}

// RSVP Functions
export const getAllRSVPs = async (): Promise<RSVPData[]> => {
  await db.read()
  return db.data?.rsvps || []
}

export const addRSVP = async (guestId: string, isAttending: boolean): Promise<RSVPData> => {
  await db.read()
  
  const guest = await getGuestById(guestId)
  if (!guest) {
    throw new Error('Guest not found')
  }
  
  const newRSVP: RSVPData = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    guestId,
    guestName: guest.name,
    isAttending,
    submittedAt: new Date().toISOString()
  }
  
  if (!db.data) {
    db.data = defaultData
  }
  
  db.data.rsvps.push(newRSVP)
  await db.write()
  
  return newRSVP
}

// Get RSVP by ID
export const getRSVPById = async (id: string): Promise<RSVPData | null> => {
  await db.read()
  return db.data?.rsvps.find(rsvp => rsvp.id === id) || null
}

// Update RSVP
export const updateRSVP = async (id: string, updates: Partial<Omit<RSVPData, 'id' | 'submittedAt'>>): Promise<RSVPData | null> => {
  await db.read()
  
  if (!db.data) {
    return null
  }
  
  const rsvpIndex = db.data.rsvps.findIndex(rsvp => rsvp.id === id)
  if (rsvpIndex === -1) {
    return null
  }
  
  const updatedRSVP = {
    ...db.data.rsvps[rsvpIndex],
    ...updates
  }
  
  db.data.rsvps[rsvpIndex] = updatedRSVP
  await db.write()
  
  return updatedRSVP
}

// Delete RSVP
export const deleteRSVP = async (id: string): Promise<boolean> => {
  await db.read()
  
  if (!db.data) {
    return false
  }
  
  const rsvpIndex = db.data.rsvps.findIndex(rsvp => rsvp.id === id)
  if (rsvpIndex === -1) {
    return false
  }
  
  db.data.rsvps.splice(rsvpIndex, 1)
  await db.write()
  
  return true
}

// Get RSVP statistics
export const getRSVPStats = async () => {
  await db.read()
  
  if (!db.data) {
    return {
      totalGuests: 0,
      totalRSVPs: 0,
      attendingCount: 0,
      notAttendingCount: 0,
      pendingCount: 0
    }
  }
  
  const totalGuests = db.data.guests.length
  const totalRSVPs = db.data.rsvps.length
  const attendingCount = db.data.rsvps.filter(rsvp => rsvp.isAttending).length
  const notAttendingCount = db.data.rsvps.filter(rsvp => !rsvp.isAttending).length
  const pendingCount = totalGuests - totalRSVPs
  
  return {
    totalGuests,
    totalRSVPs,
    attendingCount,
    notAttendingCount,
    pendingCount
  }
}

export default db
