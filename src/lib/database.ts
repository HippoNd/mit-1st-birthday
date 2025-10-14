// Redis Database Layer
// This works on both local development and Vercel production

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

// Check if we have Redis URL (for production)
const hasRedisUrl = !!process.env.REDIS_URL

// For local development, we'll use a simple in-memory store
// For production, we'll use Redis
// Use a global variable to persist data across requests in local development
declare global {
  var __localStore: DatabaseSchema | undefined
  var __redisClient: any | undefined
}

const getLocalStore = (): DatabaseSchema => {
  if (!global.__localStore) {
    global.__localStore = { guests: [], rsvps: [] }
  }
  return global.__localStore
}

// Redis client functions (will be used in production)
const getRedisClient = async () => {
  if (hasRedisUrl && process.env.REDIS_URL) {
    if (!global.__redisClient) {
      try {
        // Dynamic import to avoid issues in local development
        const { createClient } = await import('redis')
        global.__redisClient = createClient({ url: process.env.REDIS_URL })
        await global.__redisClient.connect()
        console.log('Connected to Redis')
      } catch (error) {
        console.error('Failed to connect to Redis:', error)
        return null
      }
    }
    return global.__redisClient
  }
  return null
}

// Helper functions for data operations
const getData = async (): Promise<DatabaseSchema> => {
  if (hasRedisUrl && process.env.REDIS_URL) {
    const redis = await getRedisClient()
    if (redis) {
      try {
        const data = await redis.get('rsvp-database')
        return data ? JSON.parse(data) : { guests: [], rsvps: [] }
      } catch (error) {
        console.error('Failed to get data from Redis:', error)
        return { guests: [], rsvps: [] }
      }
    }
  }
  return getLocalStore()
}

const setData = async (data: DatabaseSchema): Promise<void> => {
  if (hasRedisUrl && process.env.REDIS_URL) {
    const redis = await getRedisClient()
    if (redis) {
      try {
        await redis.set('rsvp-database', JSON.stringify(data))
        return
      } catch (error) {
        console.error('Failed to set data in Redis:', error)
        throw error
      }
    }
  }
  global.__localStore = data
}

// Initialize database
export const initDatabase = async (): Promise<void> => {
  // For Redis, we don't need to initialize anything
  // For local development, we already have the default data
  console.log('Database initialized for', hasRedisUrl ? 'Redis' : 'local development')
}

// Guest Management Functions
export const getAllGuests = async (): Promise<GuestInvitation[]> => {
  const data = await getData()
  return data.guests || []
}

export const addGuest = async (name: string): Promise<GuestInvitation> => {
  const data = await getData()
  
  const inviteCode = Math.random().toString(36).substr(2, 8).toUpperCase()
  
  const newGuest: GuestInvitation = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: name.trim(),
    inviteCode,
    isInvited: true,
    createdAt: new Date().toISOString()
  }
  
  data.guests.push(newGuest)
  await setData(data)
  
  return newGuest
}

export const getGuestByInviteCode = async (inviteCode: string): Promise<GuestInvitation | null> => {
  const data = await getData()
  return data.guests.find(guest => guest.inviteCode === inviteCode) || null
}

export const getGuestById = async (id: string): Promise<GuestInvitation | null> => {
  const data = await getData()
  return data.guests.find(guest => guest.id === id) || null
}

export const deleteGuest = async (id: string): Promise<boolean> => {
  const data = await getData()
  
  const guestIndex = data.guests.findIndex(guest => guest.id === id)
  if (guestIndex === -1) {
    return false
  }
  
  // Also delete associated RSVPs
  data.rsvps = data.rsvps.filter(rsvp => rsvp.guestId !== id)
  
  // Delete the guest
  data.guests.splice(guestIndex, 1)
  await setData(data)
  
  return true
}

export const clearDatabase = async (): Promise<void> => {
  const emptyData: DatabaseSchema = { guests: [], rsvps: [] }
  await setData(emptyData)
}

// RSVP Functions
export const getAllRSVPs = async (): Promise<RSVPData[]> => {
  const data = await getData()
  return data.rsvps || []
}

export const addRSVP = async (guestId: string, isAttending: boolean): Promise<RSVPData> => {
  const data = await getData()
  
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
  
  data.rsvps.push(newRSVP)
  await setData(data)
  
  return newRSVP
}

// Get RSVP by ID
export const getRSVPById = async (id: string): Promise<RSVPData | null> => {
  const data = await getData()
  return data.rsvps.find(rsvp => rsvp.id === id) || null
}

// Update RSVP
export const updateRSVP = async (id: string, updates: Partial<Omit<RSVPData, 'id' | 'submittedAt'>>): Promise<RSVPData | null> => {
  const data = await getData()
  
  const rsvpIndex = data.rsvps.findIndex(rsvp => rsvp.id === id)
  if (rsvpIndex === -1) {
    return null
  }
  
  const updatedRSVP = {
    ...data.rsvps[rsvpIndex],
    ...updates
  }
  
  data.rsvps[rsvpIndex] = updatedRSVP
  await setData(data)
  
  return updatedRSVP
}

// Delete RSVP
export const deleteRSVP = async (id: string): Promise<boolean> => {
  const data = await getData()
  
  const rsvpIndex = data.rsvps.findIndex(rsvp => rsvp.id === id)
  if (rsvpIndex === -1) {
    return false
  }
  
  data.rsvps.splice(rsvpIndex, 1)
  await setData(data)
  
  return true
}

// Get RSVP statistics
export const getRSVPStats = async () => {
  const data = await getData()
  
  const totalGuests = data.guests.length
  const totalRSVPs = data.rsvps.length
  const attendingCount = data.rsvps.filter(rsvp => rsvp.isAttending).length
  const notAttendingCount = data.rsvps.filter(rsvp => !rsvp.isAttending).length
  const pendingCount = totalGuests - totalRSVPs
  
  return {
    totalGuests,
    totalRSVPs,
    attendingCount,
    notAttendingCount,
    pendingCount
  }
}

export default { initDatabase, getAllGuests, addGuest, getGuestByInviteCode, getGuestById, deleteGuest, clearDatabase, getAllRSVPs, addRSVP, getRSVPById, updateRSVP, deleteRSVP, getRSVPStats }