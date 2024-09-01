import Link from 'next/link'
import { sql } from '@vercel/postgres'
import ItemCard from '../../components/ItemCard'

export default async function SectionPage({ params }: { params: { sectionId: string } }) {
  const { rows: items } = await sql`SELECT * FROM items WHERE section_id = ${params.sectionId}`
  const { rows: sections } = await sql`SELECT * FROM sections WHERE id = ${params.sectionId}`
  const section = sections[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{section.name}</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <Link key={item.id} href={`/menu/${params.sectionId}/${item.id}`}>
            <ItemCard name={item.name} price={item.price} image={item.image} />
          </Link>
        ))}
      </div>
    </div>
  )
}