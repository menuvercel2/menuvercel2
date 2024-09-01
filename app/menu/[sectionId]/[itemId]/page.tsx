import { sql } from '@vercel/postgres'
import Image from 'next/image'

export default async function ItemPage({ params }: { params: { itemId: string } }) {
  const { rows } = await sql`SELECT * FROM items WHERE id = ${params.itemId}`
  const item = rows[0]

  return (
    <div className="container mx-auto px-4 py-8">
      <Image src={item.image} alt={item.name} width={400} height={300} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
      <p className="text-xl font-semibold mb-4">${item.price.toFixed(2)}</p>
      <p className="text-gray-600">{item.description}</p>
    </div>
  )
}