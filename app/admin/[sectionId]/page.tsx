import { sql } from '@vercel/postgres'
import { notFound } from 'next/navigation'
import AdminItemCard from '../../components/AdminItemCard'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

interface Item {
  id: number
  name: string
  price: number
  image: string
  description: string
}

interface Section {
  id: number
  name: string
}

export const revalidate = 0

async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log('Database connection successful:', result)
    return true
  } catch (error) {
    console.error('Database connection error:', error)
    return false
  }
}

async function getAllItems() {
  try {
    const result = await sql`SELECT * FROM items LIMIT 10`
    console.log('Sample items retrieved:', result.rows)
    return result.rows
  } catch (error) {
    console.error('Error retrieving items:', error)
    return []
  }
}

async function getItemsForSection(sectionId: string) {
  try {
    const result = await sql<Item>`
      SELECT id, name, CAST(price AS FLOAT) as price, image, description 
      FROM items 
      WHERE section_id = ${sectionId}
    `
    console.log(`Items retrieved for section ${sectionId}:`, result.rows)
    return result.rows
  } catch (error) {
    console.error(`Error retrieving items for section ${sectionId}:`, error)
    throw error
  }
}

async function getSection(sectionId: string) {
  try {
    const result = await sql<Section>`
      SELECT id, name 
      FROM sections 
      WHERE id = ${sectionId}
    `
    console.log(`Section retrieved:`, result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.error(`Error retrieving section ${sectionId}:`, error)
    throw error
  }
}

export default async function AdminSectionPage({ params }: { params: { sectionId: string } }) {
  console.log('Rendering AdminSectionPage for sectionId:', params.sectionId)

  const deleteItem = async (id: number) => {
    'use server'
    try {
      await sql`DELETE FROM items WHERE id = ${id}`
      revalidatePath('/admin')
      revalidatePath('/')
      revalidatePath(`/menu/${params.sectionId}`)
    } catch (error) {
      console.error('Error deleting item:', error)
      throw new Error('Failed to delete item. Please try again.')
    }
  }

  try {
    const isConnected = await testDatabaseConnection()
    if (!isConnected) {
      throw new Error('Database connection failed')
    }

    const sampleItems = await getAllItems()
    console.log('Sample items in database:', sampleItems)

    const sectionId = params.sectionId
    console.log(`Attempting to retrieve items for section ID: ${sectionId}`)

    const [items, section] = await Promise.all([
      getItemsForSection(sectionId),
      getSection(sectionId)
    ])

    if (!section) {
      console.error(`Section not found with ID: ${sectionId}`)
      notFound()
    }

    console.log(`Section "${section.name}" (ID: ${section.id}) found with ${items.length} items`)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{section.name} - Administration</h1>
        {items.length === 0 ? (
          <p>No items in this section. Add a new item to get started.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <AdminItemCard 
                key={item.id} 
                item={item} 
                sectionId={parseInt(sectionId)} 
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}
        <div className="mt-6 space-x-4">
          <Link 
            href={`/admin/${sectionId}/new-item`}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Add New Item
          </Link>
          <Link 
            href="/admin"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Sections
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Detailed error:', error)
    console.error('Stack trace:', (error as Error).stack)

    if ((error as any).code) {
      console.error('SQL error code:', (error as any).code)
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Error</h1>
        <p>Sorry, an error occurred while loading the section data. Please try again later.</p>
        <p className="text-sm text-gray-600 mt-2">Error: {(error as Error).message}</p>
        <Link 
          href="/admin"
          className="mt-4 inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Back to Sections
        </Link>
      </div>
    )
  }
}