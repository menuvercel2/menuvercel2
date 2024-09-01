import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function GET() {
  const { rows } = await sql`SELECT * FROM sections`
  return NextResponse.json(rows)
}

export async function POST(request: Request) {
  const { name, image } = await request.json()
  const { rows } = await sql`INSERT INTO sections (name, image) VALUES (${name}, ${image}) RETURNING *`
  return NextResponse.json(rows[0])
}

export async function PUT(request: Request) {
  const { id, name, image } = await request.json()
  const { rows } = await sql`UPDATE sections SET name = ${name}, image = ${image} WHERE id = ${id} RETURNING *`
  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  await sql`DELETE FROM sections WHERE id = ${id}`
  return NextResponse.json({ message: 'Section deleted successfully' })
}