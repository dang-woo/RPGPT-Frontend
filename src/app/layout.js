import "./globals.css";
import Footer from "@/components/Footer";
import ThemeInitializer from "@/components/ThemeInitializer";

export const metadata = {
  title: "RPGPT",
  description: "게임 정보 커뮤니티 플랫폼",
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
