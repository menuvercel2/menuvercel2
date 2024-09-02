import Link from 'next/link'
import { sql } from '@vercel/postgres'
import AdminItemCard from '../../components/AdminItemCard'
import { notFound } from 'next/navigation'

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

export default async function AdminSectionPage({ params }: { params: { sectionId: string } }) {
  try {
    const { rows: items } = await sql<Item>`SELECT * FROM items WHERE section_id = ${params.sectionId}`
    const { rows: sections } = await sql<Section>`SELECT * FROM sections WHERE id = ${params.sectionId}`
    
    if (sections.length === 0) {
      notFound()
    }

    const section = sections[0]

    console.log(`Fetched ${items.length} items for section ${section.name} (Admin view)`)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{section.name} - Admin</h1>
        {items.length === 0 ? (
          <p>No items in this section. Add a new item to get started.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <AdminItemCard key={item.id} item={item} sectionId={parseInt(params.sectionId)} />
            ))}
          </div>
        )}
        <Link href={`/admin/${params.sectionId}/new-item`} className="mt-6 inline-block bg-green-500 text-white px-4 py-2 rounded">
          Add New Item
        </Link>
        <Link href="/admin" className="mt-6 ml-4 inline-block bg-gray-500 text-white px-4 py-2 rounded">
          Back to Sections
        </Link>
      </div>
    )
  } catch (error) {
    console.error('Error fetching section data:', error)
    return <div>Error loading section. Please try again later.</div>
  }
}