import "./globals.css";
import Navigation from "@/components/navegation";


export const metadata = {
  title: "3차 프로젝트",
  description: "다양한 게임 정보를 제공하는 프로젝트 입니다.",
};



export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="light">
      <body>
      <main className="container mx-auto pt-20 px-4">
        <Navigation/>
        {children}
          </main>
      </body>
    </html>
  );
}
