import Link from 'next/link'
import { sql } from '@vercel/postgres'
import SectionCard from '../../components/SectionCard'

interface Section {
  id: number
  name: string
  image: string
}

async function getSections() {
  const { rows } = await sql<Section>`SELECT * FROM sections`
  return rows
}

export const revalidate = 0 // This will revalidate the page on every request

export default async function MenuPage() {
  const sections = await getSections()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Menu</h1>
      {sections.length === 0 ? (
        <p>No menu sections available yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section) => (
            <Link key={section.id} href={`/menu/${section.id}`}>
              <SectionCard name={section.name} image={section.image} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}