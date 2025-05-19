import "./globals.css";

export const metadata = {
  title: "RPGPT",
  description: "게임 정보 커뮤니티 플랫폼",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
