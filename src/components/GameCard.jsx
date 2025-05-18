import Link from 'next/link';
import Image from 'next/image';

export default function GameCard({ title, description, imageUrl, link }) {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        <Link
          href={link}
          className="block w-full text-center bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          캐릭터 조회하기
        </Link>
      </div>
    </div>
  );
} 