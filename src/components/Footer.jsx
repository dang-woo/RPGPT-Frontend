import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-neutral-100 dark:bg-gray-800 text-neutral-700 dark:text-white py-8 px-4 sm:px-6 lg:px-8 border-t dark:border-neutral-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 md:ml-4">
          {/* TODO: 로고 이미지 또는 텍스트로 교체 */}
          <Link href="/" className="text-2xl font-bold text-neutral-900 dark:text-white">
            RPGPT
          </Link>
        </div>
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">&copy; {new Date().getFullYear()} RPGPT. All rights reserved.</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">주소:경기도 성남시 수정구 대왕판교로 815 판교제2테크노밸리 기업지원허브 1층 메타버스 아카데미 </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">고객센터: 010-1234-5678 (평일 09:00 ~ 18:00)</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/privacy-policy" className="hover:text-sky-600 dark:hover:text-gray-300 text-sm text-neutral-700 dark:text-neutral-300">
            개인정보처리방침
          </Link>

          <div className="w-32 h-8 relative"> {/* 이미지 크기에 맞게 w, h 값 조절 */}
            <Image 
              src="/images/apiLogo.png" 
              alt="Neople OpenAPI Logo" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain filter dark:brightness-0 dark:invert"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 