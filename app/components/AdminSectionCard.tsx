import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
      const response = await fetch('/api/sections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: section.id }),
      })

      if (response.ok) {
        router.refresh()
      } else {
        console.error('Failed to delete section')
      }
    } catch (error) {
      console.error('Error deleting section:', error)
    }
    setIsDeleting(false)
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">{section.name}</h2>
      <div className="space-x-2">
        <Link href={`/admin/${section.id}`} className="bg-blue-500 text-white px-3 py-1 rounded">
          Enter
        </Link>
        <Link href={`/admin/edit-section/${section.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded">
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