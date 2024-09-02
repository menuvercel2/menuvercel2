import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { sql } from '@vercel/postgres'
import SectionCard from '../components/SectionCard'

interface Section {
  id: number
  name: string
  image: string
}

interface MenuPageProps {
  sections: Section[]
}

export default function MenuPage({ sections }: MenuPageProps) {
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

export const getServerSideProps: GetServerSideProps = async () => {
  const { rows: sections } = await sql<Section>`SELECT * FROM sections`
  
  return {
    props: {
      sections,
    },
  }
}