import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Item {
  id: number
  name: string
  price: number
  image: string
  description: string
}

interface AdminItemCardProps {
  item: Item
  sectionId: number
}

export default function AdminItemCard({ item, sectionId }: AdminItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/items', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        console.error('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
    setIsDeleting(false)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="relative h-16 w-16 mr-4">
          <Image
            src={item.image}
            alt={item.name}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-600">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="space-x-2">
        <Link href={`/admin/${sectionId}/edit-item/${item.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded">
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}