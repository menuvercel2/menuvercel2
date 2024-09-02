import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM sections`
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, image } = await request.json()
    const { rows } = await sql`
      INSERT INTO sections (name, image)
      VALUES (${name}, ${image})
      RETURNING *
    `
    revalidatePath('/admin')
    revalidatePath('/')
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 })
    }

    await sql`DELETE FROM sections WHERE id = ${id}`
    revalidatePath('/admin')
    revalidatePath('/')
    return NextResponse.json({ message: 'Section deleted successfully' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}