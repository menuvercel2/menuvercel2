import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface AdminItemCardProps {
  item: {
    id: number
    name: string
    price: number | string
    image: string
    description: string
  }
  sectionId: number
  onDelete: (id: number) => Promise<void>
}

export default function AdminItemCard({ item, sectionId, onDelete }: AdminItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(item.id)
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="relative h-16 w-16 mr-4">
          <Image
            src={item.image || '/placeholder.svg'}
            alt={item.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-600">
            ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">{item.description}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Link 
          href={`/admin/${sectionId}/edit-item/${item.id}`}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Editar
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  )
}