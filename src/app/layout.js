import "./globals.css";
import Footer from "@/components/Footer";


export const metadata = {
  title: "RPGPT",
  description: "게임 정보 커뮤니티 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body> 
        <main className="flex-grow overflow-y-auto">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
