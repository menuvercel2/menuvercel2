'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error en la aplicación:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Algo salió mal</h2>
      <p className="mb-4">Lo sentimos, ha ocurrido un error inesperado.</p>
      {error.digest && (
        <p className="mb-4">
          Error digest: {error.digest}
        </p>
      )}
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}