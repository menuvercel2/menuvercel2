import Link from 'next/link'
import { sql } from '@vercel/postgres'
import SectionCard from './components/SectionCard'

export default async function Home() {
  const { rows } = await sql`SELECT * FROM sections`

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Menu</h1>
      <div className="grid grid-cols-2 gap-4">
        {rows.map((section) => (
          <Link key={section.id} href={`/menu/${section.id}`}>
            <SectionCard name={section.name} image={section.image} />
          </Link>
        ))}
      </div>
    </div>
  )
}