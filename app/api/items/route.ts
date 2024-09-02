import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const revalidate = 0 // Esto asegura que la ruta de la API no se almacene en caché

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sectionId = searchParams.get('sectionId')

  try {
    let query = 'SELECT * FROM items'
    let params: any[] = []

    if (sectionId) {
      query += ' WHERE section_id = $1'
      params.push(parseInt(sectionId, 10)) // Asegura que sectionId sea un número
    }

    const { rows } = await sql.query(query, params)
    console.log(`Fetched ${rows.length} items${sectionId ? ` for section ${sectionId}` : ''}`)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, description, image, sectionId } = await request.json()
    const { rows } = await sql`
      INSERT INTO items (name, price, description, image, section_id)
      VALUES (${name}, ${parseFloat(price)}, ${description}, ${image}, ${parseInt(sectionId, 10)})
      RETURNING *
    `
    console.log(`Created new item: ${JSON.stringify(rows[0])}`)
    revalidatePath('/admin')
    revalidatePath('/')
    revalidatePath(`/menu/${sectionId}`)
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const { rows } = await sql`DELETE FROM items WHERE id = ${parseInt(id, 10)} RETURNING section_id`
    console.log(`Deleted item with id: ${id}`)
    revalidatePath('/admin')
    revalidatePath('/')
    if (rows.length > 0) {
      revalidatePath(`/menu/${rows[0].section_id}`)
    }
    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}