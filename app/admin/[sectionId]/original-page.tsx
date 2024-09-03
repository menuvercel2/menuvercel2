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

async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as test`
    console.log('Conexión a la base de datos exitosa:', result)
    return true
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error)
    return false
  }
}

async function getAllItems() {
  try {
    const result = await sql`SELECT * FROM items LIMIT 10`
    console.log('Items obtenidos (muestra):', result.rows)
    return result.rows
  } catch (error) {
    console.error('Error al obtener items:', error)
    return []
  }
}

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
      throw new Error('No se pudo eliminar el ítem. Por favor, intente de nuevo.')
    }
  }

  // Verificar la conexión a la base de datos
  const isConnected = await testDatabaseConnection()
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Error de Conexión</h1>
        <p>No se pudo conectar a la base de datos. Por favor, verifica la configuración y vuelve a intentarlo.</p>
      </div>
    )
  }

  // Obtener una muestra de items para verificar
  const sampleItems = await getAllItems()
  console.log('Muestra de items en la base de datos:', sampleItems)

  try {
    const sectionId = parseInt(params.sectionId, 10)
    if (isNaN(sectionId)) {
      console.error(`ID de sección inválido: ${params.sectionId}`)
      notFound()
    }

    console.log(`Intentando obtener items para la sección ID: ${sectionId}`)

    // Consulta de items
    const itemsResult = await sql<Item>`
      SELECT id, name, price, image, description 
      FROM items 
      WHERE section_id = ${sectionId}
    `
    console.log(`Query SQL ejecutada: SELECT id, name, price, image, description FROM items WHERE section_id = ${sectionId}`)
    console.log('Resultado de la consulta de items:', itemsResult)

    // Consulta de sección
    const sectionsResult = await sql<Section>`
      SELECT id, name 
      FROM sections 
      WHERE id = ${sectionId}
    `
    console.log(`Query SQL ejecutada: SELECT id, name FROM sections WHERE id = ${sectionId}`)
    console.log('Resultado de la consulta de sección:', sectionsResult)
    
    const items = itemsResult.rows
    const sections = sectionsResult.rows

    if (sections.length === 0) {
      console.error(`No se encontró la sección con ID: ${sectionId}`)
      notFound()
    }

    const section = sections[0]

    console.log(`Sección "${section.name}" (ID: ${section.id}) encontrada con ${items.length} items`)
    console.log('Items:', JSON.stringify(items, null, 2))

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
    console.error('Error detallado:', error)
    console.error('Stack trace:', (error as Error).stack)
    console.error('Error digest:', '1036038948')

    if ((error as any).code) {
      console.error('Código de error SQL:', (error as any).code)
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Error</h1>
        <p>Lo sentimos, ha ocurrido un error al cargar los datos de la sección. Por favor, intenta de nuevo más tarde.</p>
        <p className="text-sm text-gray-600 mt-2">Error: {(error as Error).message}</p>
        <Link 
          href="/admin"
          className="mt-4 inline-block px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Volver a Secciones
        </Link>
      </div>
    )
  }
}