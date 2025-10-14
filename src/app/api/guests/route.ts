import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, getAllGuests, addGuest, clearDatabase } from '@/lib/database'

// Initialize database on first import
initDatabase()

// GET - Retrieve all guests
export async function GET() {
  try {
    const guests = await getAllGuests()
    return NextResponse.json(guests)
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guests' },
      { status: 500 }
    )
  }
}

// POST - Create new guest invitation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body
    
    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string' },
        { status: 400 }
      )
    }
    
    const newGuest = await addGuest(name.trim())
    
    return NextResponse.json(newGuest, { status: 201 })
  } catch (error) {
    console.error('Error creating guest:', error)
    return NextResponse.json(
      { error: 'Failed to create guest invitation' },
      { status: 500 }
    )
  }
}

// DELETE - Clear all guests and RSVPs
export async function DELETE() {
  try {
    await clearDatabase()
    return NextResponse.json({ message: 'Database cleared successfully' })
  } catch (error) {
    console.error('Error clearing database:', error)
    return NextResponse.json(
      { error: 'Failed to clear database' },
      { status: 500 }
    )
  }
}


