import Link from 'next/link'
import { sql } from '@vercel/postgres'
import AdminSectionCard from '../components/AdminSectionCard'

interface Section {
  id: number
  name: string
  image: string
}

export default async function AdminPage() {
  const { rows: sections } = await sql<Section>`SELECT * FROM sections`

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      {sections.length === 0 ? (
        <p>No sections found. Add a new section to get started.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <AdminSectionCard key={section.id} section={section} />
          ))}
        </div>
      )}
      <Link href="/admin/new-section" className="mt-6 inline-block bg-green-500 text-white px-4 py-2 rounded">
        Add New Section
      </Link>
    </div>
  )
}