import Link from 'next/link'
import { sql } from '@vercel/postgres'
import SectionCard from './components/SectionCard'
import { Suspense } from 'react'

async function getSections() {
  const { rows } = await sql`SELECT * FROM sections`
  return rows
}

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Menu</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SectionList />
      </Suspense>
    </div>
  )
}

async function SectionList() {
  const sections = await getSections()
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {sections.map((section) => (
        <Link key={section.id} href={`/menu/${section.id}`}>
          <SectionCard name={section.name} image={section.image} />
        </Link>
      ))}
    </div>
  )
}