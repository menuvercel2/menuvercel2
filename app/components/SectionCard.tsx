import Image from 'next/image'

interface SectionCardProps {
  name: string
  image: string
}

export default function SectionCard({ name, image }: SectionCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative h-40">
        <Image
          src={image}
          alt={name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
    </div>
  )
}