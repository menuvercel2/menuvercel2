import { sql } from '@vercel/postgres'

export async function getSections() {
  const { rows } = await sql`SELECT * FROM sections`
  return rows
}

export async function getSection(id: string) {
  const { rows } = await sql`SELECT * FROM sections WHERE id = ${id}`
  return rows[0]
}

export async function getItems(sectionId: string) {
  const { rows } = await sql`SELECT * FROM items WHERE section_id = ${sectionId}`
  return rows
}

export async function getItem(id: string) {
  const { rows } = await sql`SELECT * FROM items WHERE id = ${id}`
  return rows[0]
}