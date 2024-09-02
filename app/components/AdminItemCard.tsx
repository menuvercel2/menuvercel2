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
  const formattedPrice = typeof item.price === 'number' 
    ? item.price.toFixed(2) 
    : parseFloat(item.price).toFixed(2)

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex">
      <div className="relative h-24 w-24 flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sin Imagen</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-gray-600">${formattedPrice}</p>
          <p className="text-sm text-gray-500">{item.description}</p>
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
    </div>
  )
}