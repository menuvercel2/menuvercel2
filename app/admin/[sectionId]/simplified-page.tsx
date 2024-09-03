import { sql } from '@vercel/postgres'
import Link from 'next/link'

export const revalidate = 0

export default async function SimplifiedAdminPage({ params }: { params: { sectionId: string } }) {
  let debugInfo = []
  
  try {
    debugInfo.push('Iniciando la función SimplifiedAdminPage')
    
    // Test de conexión básica
    const testResult = await sql`SELECT 1 as test`
    debugInfo.push(`Test de conexión: ${JSON.stringify(testResult)}`)
    
    // Intenta obtener la sección
    const sectionId = parseInt(params.sectionId, 10)
    debugInfo.push(`ID de sección: ${sectionId}`)
    
    const sectionResult = await sql`SELECT id, name FROM sections WHERE id = ${sectionId}`
    debugInfo.push(`Resultado de sección: ${JSON.stringify(sectionResult)}`)
    
    // Intenta obtener los items
    const itemsResult = await sql`SELECT id, name FROM items WHERE section_id = ${sectionId} LIMIT 5`
    debugInfo.push(`Resultado de items: ${JSON.stringify(itemsResult)}`)
    
    // Renderiza los resultados
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Página de Administración Simplificada</h1>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(debugInfo, null, 2)}</pre>
        <Link href="/admin" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
          Volver
        </Link>
      </div>
    )
  } catch (error) {
    console.error('Error en SimplifiedAdminPage:', error)
    debugInfo.push(`Error: ${(error as Error).message}`)
    debugInfo.push(`Stack: ${(error as Error).stack}`)
    
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error en la Página de Administración</h1>
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(debugInfo, null, 2)}</pre>
        <Link href="/admin" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
          Volver
        </Link>
      </div>
    )
  }
}