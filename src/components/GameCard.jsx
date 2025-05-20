import Link from 'next/link';
import Image from 'next/image';

export default function GameCard({ title, description, imageUrl, link }) {
  return (
    <div className="rounded-xl shadow-lg overflow-hidden bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col">
      <div className="relative w-full aspect-video">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">{title}</h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-5 text-sm line-clamp-3 flex-grow">
          {description}
        </p>
        <Link
          href={link}
          className="block w-full text-center bg-sky-600 dark:bg-sky-500 text-white py-3 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors font-medium mt-auto"
        >
          캐릭터 조회하기
        </Link>
      </div>
    </div>
  );
} 