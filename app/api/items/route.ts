import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sectionId = searchParams.get('sectionId')

  if (sectionId) {
    const { rows } = await sql`SELECT * FROM items WHERE section_id = ${sectionId}`
    return NextResponse.json(rows)
  } else {
    const { rows } = await sql`SELECT * FROM items`
    return NextResponse.json(rows)
  }
}

export async function POST(request: Request) {
  const { sectionId, name, price, description, image } = await request.json()
  const { rows } = await sql`
    INSERT INTO items (section_id, name, price, description, image)
    VALUES (${sectionId}, ${name}, ${price}, ${description}, ${image})
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const { id, name, price, description, image } = await request.json()
  const { rows } = await sql`
    UPDATE items
    SET name = ${name}, price = ${price}, description = ${description}, image = ${image}
    WHERE id = ${id}
    RETURNING *
  `
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await sql`DELETE FROM items WHERE id = ${id}`
  return NextResponse.json({ message: 'Item deleted successfully' })
}