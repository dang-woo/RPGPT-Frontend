"use client";

import { useEffect } from 'react';
import useAuthStore from '@/lib/store/authStore';
import Navigation from "@/components/navegation";

export default function MainLayout({ children }) {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Navigation />
      <div 
        id="main-content-area" 
        className="flex flex-col flex-1 pt-16 transition-all duration-300 ease-in-out"
      >
        {children}
      </div>
    </div>
  );
} 