import Link from 'next/link'
import { sql } from '@vercel/postgres'
import ItemCard from '../../components/ItemCard'
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

export const revalidate = 0; // Deshabilita el caché temporalmente

export default async function SectionPage({ params }: { params: { sectionId: string } }) {
  try {
    const { rows: items } = await sql<Item>`SELECT * FROM items WHERE section_id = ${parseInt(params.sectionId, 10)}`
    const { rows: sections } = await sql<Section>`SELECT * FROM sections WHERE id = ${parseInt(params.sectionId, 10)}`
    
    if (sections.length === 0) {
      notFound()
    }

    const section = sections[0]

    console.log(`Fetched ${items.length} items for section ${section.name}`)
    console.log('Fetched items:', JSON.stringify(items, null, 2));

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{section.name}</h1>
        {items.length === 0 ? (
          <p>No hay ítems disponibles en esta sección.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Link key={item.id} href={`/menu/${params.sectionId}/${item.id}`}>
                <ItemCard name={item.name} price={item.price} image={item.image} />
              </Link>
            ))}
          </div>
        )}
        <Link href="/" className="mt-6 inline-block bg-gray-500 text-white px-4 py-2 rounded">
          Volver al Menú
        </Link>
      </div>
    )
  } catch (error) {
    console.error('Error al obtener datos de la sección:', error)
    return <div>Error al cargar la sección. Por favor, intente más tarde.</div>
  }
}