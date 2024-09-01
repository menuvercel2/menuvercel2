import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  const { rows } = await sql`SELECT * FROM sections`
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const { name, image } = await request.json()
  try {
    const { rows } = await sql`
      INSERT INTO sections (name, image)
      VALUES (${name}, ${image})
      RETURNING *
    `
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  try {
    await sql`DELETE FROM sections WHERE id = ${id}`
    return NextResponse.json({ message: 'Section deleted successfully' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}