import Image from 'next/image'

interface ItemCardProps {
  name: string
  price: number
  image: string
}

export default function ItemCard({ name, price, image }: ItemCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex">
      <div className="relative h-24 w-24 flex-shrink-0">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sin Imagen</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">${price.toFixed(2)}</p>
      </div>
    </div>
  )
}