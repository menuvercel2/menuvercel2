'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '../../../../components/ImageUpload'

export default function EditItemPage({ params }: { params: { sectionId: string; id: string } }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/api/items?id=${params.id}`)
      const item = await response.json()
      setName(item.name)
      setPrice(item.price.toString())
      setDescription(item.description)
      setImage(item.image)
    }
    fetchItem()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/items', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.id,
          name,
          price: parseFloat(price),
          description,
          image,
        }),
      })

      if (response.ok) {
        router.push(`/admin/${params.sectionId}`)
        router.refresh()
      } else {
        console.error('Failed to update item')
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Item</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name
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
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            rows={3}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Item Image
          </label>
          <ImageUpload onUpload={(url) => setImage(url)} />
          {image && <img src={image} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded" />}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update Item'}
        </button>
      </form>
    </div>
  )
}