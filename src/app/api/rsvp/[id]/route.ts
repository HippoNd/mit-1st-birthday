import { NextRequest, NextResponse } from 'next/server'
import { getRSVPById, updateRSVP, deleteRSVP } from '@/lib/database'

// GET - Retrieve specific RSVP by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'RSVP ID is required' },
        { status: 400 }
      )
    }
    
    const rsvp = await getRSVPById(id)
    
    if (!rsvp) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(rsvp)
  } catch (error) {
    console.error('Error fetching RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSVP' },
      { status: 500 }
    )
  }
}

// PUT - Update specific RSVP by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { isAttending } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'RSVP ID is required' },
        { status: 400 }
      )
    }
    
    // Validate data if provided
    const updates: any = {}
    
    if (isAttending !== undefined) {
      if (typeof isAttending !== 'boolean') {
        return NextResponse.json(
          { error: 'isAttending must be a boolean' },
          { status: 400 }
        )
      }
      updates.isAttending = isAttending
    }
  
    const updatedRSVP = await updateRSVP(id, updates)
    
    if (!updatedRSVP) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(updatedRSVP)
  } catch (error) {
    console.error('Error updating RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to update RSVP' },
      { status: 500 }
    )
  }
}

// DELETE - Delete specific RSVP by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'RSVP ID is required' },
        { status: 400 }
      )
    }
    
    const deleted = await deleteRSVP(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'RSVP not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'RSVP deleted successfully' })
  } catch (error) {
    console.error('Error deleting RSVP:', error)
    return NextResponse.json(
      { error: 'Failed to delete RSVP' },
      { status: 500 }
    )
  }
}


