import Link from 'next/link'
import SectionCard from '../components/SectionCard'

interface Section {
  id: number
  name: string
  image: string
}

async function getSections() {
  const url = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/sections`
  console.log('Fetching sections from:', url)
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error('Failed to fetch sections')
  }
  const data = await res.json()
  console.log('Fetched sections:', data)
  return data
}

export const revalidate = 0

export default async function MenuPage() {
  const sections = await getSections()
  const timestamp = new Date().toISOString()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Menu</h1>
      <p className="text-sm text-gray-500 mb-4">Last updated: {timestamp}</p>
      {sections.length === 0 ? (
        <p>No menu sections available yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section: Section) => (
            <Link key={section.id} href={`/menu/${section.id}`}>
              <SectionCard name={section.name} image={section.image} />
            </Link>
          ))}
        </div>
      )}
      <p className="mt-4 text-sm text-gray-500">Number of sections: {sections.length}</p>
    </div>
  )
}