import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, addRSVP, getAllRSVPs, getRSVPStats } from '@/lib/database'

// Initialize database on first import
initDatabase()

// GET - Retrieve all RSVPs or statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stats = searchParams.get('stats')
    
    if (stats === 'true') {
      const statistics = await getRSVPStats()
      return NextResponse.json(statistics)
    }
    
    const rsvps = await getAllRSVPs()
    return NextResponse.json(rsvps)
  } catch (error) {
    console.error('Error fetching RSVPs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSVPs' },
      { status: 500 }
    )
  }
}

// POST - Create new RSVP (Legacy endpoint - use /api/rsvp/invite/[code] instead)
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'This endpoint is deprecated. Please use the new invitation system at /api/rsvp/invite/[code]' },
    { status: 410 }
  )
}
