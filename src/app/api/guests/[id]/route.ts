import { NextRequest, NextResponse } from 'next/server'
import { initDatabase, deleteGuest } from '@/lib/database'

// Initialize database on first import
initDatabase()

// DELETE - Delete specific guest by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Guest ID is required' },
        { status: 400 }
      )
    }
    
    const deleted = await deleteGuest(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Guest not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Guest deleted successfully' })
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { error: 'Failed to delete guest' },
      { status: 500 }
    )
  }
}
