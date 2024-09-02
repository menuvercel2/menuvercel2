import { sql } from '@vercel/postgres'
import { notFound } from 'next/navigation'
import AdminItemCard from '../../components/AdminItemCard'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

interface Item {
  id: number
  name: string
  price: number | string
  image: string
  description: string
}

interface Section {
  id: number
  name: string
}

export const revalidate = 0

export default async function AdminSectionPage({ params }: { params: { sectionId: string } }) {
  const deleteItem = async (id: number) => {
    'use server'
    try {
      await sql`DELETE FROM items WHERE id = ${id}`
      revalidatePath('/admin')
      revalidatePath('/')
      revalidatePath(`/menu/${params.sectionId}`)
    } catch (error) {
      console.error('Error al eliminar el ítem:', error)
    }
  }

  try {
    const sectionId = parseInt(params.sectionId, 10)
    if (isNaN(sectionId)) {
      notFound()
    }

    const { rows: items } = await sql<Item>`SELECT * FROM items WHERE section_id = ${sectionId}`
    const { rows: sections } = await sql<Section>`SELECT * FROM sections WHERE id = ${sectionId}`
    
    if (sections.length === 0) {
      notFound()
    }

    const section = sections[0]

    console.log(`Fetched ${items.length} items for section ${section.name} (Admin view)`)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{section.name} - Administración</h1>
        {items.length === 0 ? (
          <p>No hay ítems en esta sección. Añade un nuevo ítem para comenzar.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <AdminItemCard 
                key={item.id} 
                item={item} 
                sectionId={sectionId} 
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
            Añadir Nuevo Ítem
          </Link>
          <Link 
            href="/admin"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Volver a Secciones
          </Link>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error al obtener datos de la sección:', error)
    throw error
  }
}