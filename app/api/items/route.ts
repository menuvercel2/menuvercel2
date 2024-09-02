import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export const revalidate = 0; // This ensures the API route is not cached

export async function GET() {
  console.log('GET request received for sections')
  try {
    const { rows } = await sql`SELECT * FROM sections`
    console.log('Fetched sections:', rows)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log('POST request received for sections')
  const { name, image } = await request.json()
  try {
    const { rows } = await sql`
      INSERT INTO sections (name, image)
      VALUES (${name}, ${image})
      RETURNING *
    `
    console.log('Created new section:', rows[0])
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  console.log('DELETE request received for sections')
  const { id } = await request.json()
  try {
    await sql`DELETE FROM sections WHERE id = ${id}`
    console.log('Deleted section with id:', id)
    return NextResponse.json({ message: 'Section deleted successfully' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}