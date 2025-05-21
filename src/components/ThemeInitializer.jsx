"use client";

import { useEffect, useState } from "react";

export default function ThemeInitializer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let initialDark;
    if (storedTheme === "dark") {
      initialDark = true;
    } else if (storedTheme === "light") {
      initialDark = false;
    } else { // storedTheme is null, undefined, or "system"
      initialDark = prefersDark;
    }

    document.body.classList.toggle("dark", initialDark);
    document.body.classList.toggle("light", !initialDark);

  }, [isClient]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
} 