"use client";

import { useEffect } from 'react';
import useAuthStore from '@/lib/store/authStore';
import Navigation from "@/components/navegation"; // Navigation 컴포넌트 import

export default function MainLayout({ children }) {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // 이 레이아웃은 이제 단순히 children을 전달하는 역할만 하거나,
  // (main) 그룹에만 특정적으로 필요한 추가 래퍼가 있다면 여기에 구성합니다.
  // Navigation과 기본 flex 구조는 RootLayout으로 이동했습니다.
  return (
    <>
      <Navigation />
      {/* Navigation 아래 컨텐츠가 fixed된 Navigation에 가려지지 않도록 pt-16 추가 */}
      {/* 이 div는 RootLayout의 main 태그 안에서 flex-grow를 통해 공간을 차지하고 자체적으로 스크롤됩니다. */}
      {/* (main) 레이아웃 내부에서는 특별히 flex-grow나 overflow를 줄 필요는 없습니다. RootLayout의 main이 처리합니다. */}
      <div id="main-content-area" className="pt-16 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </>
  );
} 