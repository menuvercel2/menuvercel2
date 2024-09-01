'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '../../../components/ImageUpload'

export default function EditSectionPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSection = async () => {
      const response = await fetch(`/api/sections?id=${params.id}`)
      const section = await response.json()
      setName(section.name)
      setImage(section.image)
    }
    fetchSection()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: params.id, name, image }),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        console.error('Failed to update section')
      }
    } catch (error) {
      console.error('Error updating section:', error)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Section</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Section Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Section Image
          </label>
          <ImageUpload onUpload={(url) => setImage(url)} />
          {image && <img src={image} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Section'}
        </button>
      </form>
    </div>
  )
}