import React from 'react'
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
  onDelete: (id: number) => void
}

export default function AdminItemCard({ item, sectionId, onDelete }: AdminItemCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-600">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</p>
      </div>
      <div className="flex space-x-2">
        <Link 
          href={`/admin/${sectionId}/edit-item/${item.id}`}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Editar
        </Link>
        <button 
          onClick={() => onDelete(item.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}