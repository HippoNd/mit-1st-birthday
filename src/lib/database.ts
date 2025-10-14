import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { Memory } from 'lowdb'
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

// Check if we're in Vercel environment
const isVercel = process.env.VERCEL === '1'

// Database configuration
const defaultData: DatabaseSchema = { guests: [], rsvps: [] }
let db: Low<DatabaseSchema>

// Initialize database based on environment
if (isVercel) {
  // Use in-memory database for Vercel
  const adapter = new Memory<DatabaseSchema>()
  db = new Low(adapter, defaultData)
} else {
  // Use file-based database for local development
  const file = join(process.cwd(), 'data', 'db.json')
  const adapter = new JSONFile<DatabaseSchema>(file)
  db = new Low(adapter, defaultData)
}

// Initialize database
export const initDatabase = async (): Promise<void> => {
  if (isVercel) {
    // For Vercel, just ensure data is initialized
    if (!db.data) {
      db.data = defaultData
    }
  } else {
    // For local development, read from file
    await db.read()
    if (!db.data) {
      db.data = defaultData
      await db.write()
    }
  }
}

// Helper function to handle database operations
const ensureData = async (): Promise<void> => {
  if (!isVercel) {
    await db.read()
  }
  if (!db.data) {
    db.data = defaultData
  }
}

const saveData = async (): Promise<void> => {
  if (!isVercel) {
    await db.write()
  }
}

// Guest Management Functions
export const getAllGuests = async (): Promise<GuestInvitation[]> => {
  await ensureData()
  return db.data?.guests || []
}

export const addGuest = async (name: string): Promise<GuestInvitation> => {
  await ensureData()
  
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
  await saveData()
  
  return newGuest
}

export const getGuestByInviteCode = async (inviteCode: string): Promise<GuestInvitation | null> => {
  await ensureData()
  return db.data?.guests.find(guest => guest.inviteCode === inviteCode) || null
}

export const getGuestById = async (id: string): Promise<GuestInvitation | null> => {
  await ensureData()
  return db.data?.guests.find(guest => guest.id === id) || null
}

export const deleteGuest = async (id: string): Promise<boolean> => {
  await ensureData()
  
  if (!db.data) {
    return false
  }
  
  const guestIndex = db.data.guests.findIndex(guest => guest.id === id)
  if (guestIndex === -1) {
    return false
  }
  
  // Also delete associated RSVPs
  db.data.rsvps = db.data.rsvps.filter(rsvp => rsvp.guestId !== id)
  
  // Delete the guest
  db.data.guests.splice(guestIndex, 1)
  await saveData()
  
  return true
}

export const clearDatabase = async (): Promise<void> => {
  if (!db.data) {
    db.data = defaultData
  } else {
    db.data.guests = []
    db.data.rsvps = []
  }
  await saveData()
}

// RSVP Functions
export const getAllRSVPs = async (): Promise<RSVPData[]> => {
  await ensureData()
  return db.data?.rsvps || []
}

export const addRSVP = async (guestId: string, isAttending: boolean): Promise<RSVPData> => {
  await ensureData()
  
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
  await saveData()
  
  return newRSVP
}

// Get RSVP by ID
export const getRSVPById = async (id: string): Promise<RSVPData | null> => {
  await ensureData()
  return db.data?.rsvps.find(rsvp => rsvp.id === id) || null
}

// Update RSVP
export const updateRSVP = async (id: string, updates: Partial<Omit<RSVPData, 'id' | 'submittedAt'>>): Promise<RSVPData | null> => {
  await ensureData()
  
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
  await saveData()
  
  return updatedRSVP
}

// Delete RSVP
export const deleteRSVP = async (id: string): Promise<boolean> => {
  await ensureData()
  
  if (!db.data) {
    return false
  }
  
  const rsvpIndex = db.data.rsvps.findIndex(rsvp => rsvp.id === id)
  if (rsvpIndex === -1) {
    return false
  }
  
  db.data.rsvps.splice(rsvpIndex, 1)
  await saveData()
  
  return true
}

// Get RSVP statistics
export const getRSVPStats = async () => {
  await ensureData()
  
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
