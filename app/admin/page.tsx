import Link from 'next/link'
import { sql } from '@vercel/postgres'
import AdminSectionCard from '../components/AdminSectionCard'
import { Suspense } from 'react'

interface Section {
  id: number
  name: string
  image: string
}

async function getSections(): Promise<Section[]> {
  const { rows } = await sql<Section>`SELECT id, name, image FROM sections`
  return rows
}

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">PANEL DE ADMINISTRACIÓN</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SectionList />
      </Suspense>
      <Link href="/admin/new-section" className="mt-6 inline-block bg-green-500 text-white px-4 py-2 rounded">
        Añadir nueva sección
      </Link>
    </div>
  )
}

async function SectionList() {
  const sections = await getSections()

  return (
    <div>
      {sections.length === 0 ? (
        <p>No hay secciones, añada una.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <AdminSectionCard key={section.id} section={section} />
          ))}
        </div>
      )}
    </div>
  )
}