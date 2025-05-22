import "./globals.css";
import Footer from "@/components/Footer";
import ThemeInitializer from "@/components/ThemeInitializer";

export const metadata = {
  title: "RPGPT - AI 기반 던전앤파이터 공략 커뮤니티",
  description: "RPGPT에서 AI 추천을 통해 던전앤파이터 캐릭터 성장법, 던전 공략, 스킬 트리 등 맞춤형 정보를 얻고, 다른 유저들과 소통하세요!",
  keywords: ["던전앤파이터", "던파", "RPGPT", "AI공략", "캐릭터성장", "던파커뮤니티", "던파공략", "던전앤파이터공략", "던파AI", "게임공략"],
  authors: [{ name: "RPGPT Team" }], 
  openGraph: {
    title: "RPGPT: AI와 함께하는 던전앤파이터 공략의 모든 것",
    description: "던파, 이제 AI에게 물어보세요! RPGPT가 맞춤형 성장 가이드와 공략을 제공합니다.",
    url: "https://www.rpgpt.store", 
    siteName: "RPGPT",
    images: [
      {
        url: "/images/logo.jpg", // public/images/logo.jpg 사용
        width: 1200, // 예시 너비, 실제 이미지에 맞게 조정 권장
        height: 630, // 예시 높이, 실제 이미지에 맞게 조정 권장
        alt: "RPGPT 로고",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RPGPT: AI 던파 공략의 새로운 기준",
    description: "AI가 추천하는 던전앤파이터 공략, 지금 RPGPT에서 확인하세요!",
    images: ["/images/logo.jpg"], // public/images/logo.jpg 사용
    // site: "@rpgpt_twitter_handle", // TODO: 실제 트위터 핸들 사용 시 주석 해제 및 수정
    // creator: "@creator_twitter_handle",
  },
  icons: {
    icon: "/favicon.ico", // public 폴더 기준
    apple: "/images/logo.jpg", // 애플 터치 아이콘도 logo.jpg로 우선 설정
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // themeColor: "#D10FA7", // 필요시 주석 해제 및 색상 코드 확인
  // manifest: "/manifest.json", // PWA 구성 시 주석 해제 및 파일 생성
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ThemeInitializer />
        <main className="flex flex-col flex-1 overflow-y-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
