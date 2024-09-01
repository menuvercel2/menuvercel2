'use client'

import { useState } from 'react'
import { put } from '@vercel/blob'

export default function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setUploading(true)
    const file = e.target.files[0]
    const response = await put(file.name, file, { access: 'public' })
    onUpload(response.url)
    setUploading(false)
  }

  return (
    <div>
      <input type="file" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
    </div>
  )
}