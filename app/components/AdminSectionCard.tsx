'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Section {
  id: number
  name: string
  image: string
}

interface AdminSectionCardProps {
  section: Section
}

export default function AdminSectionCard({ section }: AdminSectionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/sections?id=${section.id}`, {
        method: 'DELETE',
      })
  
      if (response.ok) {
        const data = await response.json()
        alert(data.message || `${section.name} has been successfully deleted.`)
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete section')
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      alert(`Failed to delete ${section.name}. Please try again.`)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Image 
          src={section.image} 
          alt={section.name} 
          width={48} 
          height={48} 
          className="rounded-full object-cover"
        />
        <h2 className="text-lg font-semibold">{section.name}</h2>
      </div>
      <div className="flex space-x-2">
        <Link 
          href={`/admin/${section.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Enter
        </Link>
        <Link 
          href={`/admin/edit-section/${section.id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}