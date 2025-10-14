import { NextRequest, NextResponse } from 'next/server'
import { getGuestByInviteCode, addRSVP, getAllRSVPs } from '@/lib/database'

// GET - Get guest info by invite code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    
    if (!code) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }
    
    const guest = await getGuestByInviteCode(code.toUpperCase())
    
    if (!guest) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }
    
    // Check if guest has already RSVP'd
    const rsvps = await getAllRSVPs()
    const existingRSVP = rsvps.find(rsvp => rsvp.guestId === guest.id)
    
    return NextResponse.json({
      guest: {
        id: guest.id,
        name: guest.name,
        inviteCode: guest.inviteCode
      },
      hasRSVPed: !!existingRSVP,
      rsvp: existingRSVP || null
    })
  } catch (error) {
    console.error('Error fetching guest by invite code:', error)
    return NextResponse.json(
      { error: 'Failed to fetch guest information' },
      { status: 500 }
    )
  }
}

// POST - Submit RSVP for guest
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const { isAttending } = body
    
    if (!code) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }
    
    if (typeof isAttending !== 'boolean') {
      return NextResponse.json(
        { error: 'isAttending must be a boolean value' },
        { status: 400 }
      )
    }
    
    const guest = await getGuestByInviteCode(code.toUpperCase())
    
    if (!guest) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }
    
    // Check if guest has already RSVP'd
    const rsvps = await getAllRSVPs()
    const existingRSVP = rsvps.find(rsvp => rsvp.guestId === guest.id)
    
    if (existingRSVP) {
      return NextResponse.json(
        { error: 'RSVP already submitted for this guest' },
        { status: 400 }
      )
    }
    
    const newRSVP = await addRSVP(guest.id, isAttending)
    
    return NextResponse.json(newRSVP, { status: 201 })
  } catch (error) {
    console.error('Error submitting RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    )
  }
}


