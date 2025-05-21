"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MdLogin, MdPersonAdd, MdLogout, MdOutlineBedtime, MdOutlineWbSunny } from "react-icons/md"
import { FaUserCircle } from "react-icons/fa"
import useAuthStore from "@/lib/store/authStore"
import { HomeIcon, UserCircleIcon as MyPageIcon } from "./icons"
import { MessageSquareText } from 'lucide-react'

// PC 및 모바일용 메뉴 아이콘 정의
const MdMenu = ({size}) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></svg>;
const MdClose = ({size}) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>;
const MdChevronLeft = ({size}) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>;
const MdMenuOpen = ({size}) => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h18V6H3zm15 12v3h3v-3h-3z"></path></svg>;

export default function Navigation() {
    const pathname = usePathname()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false);
    const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false)
    const [isNavExpandedPC, setIsNavExpandedPC] = useState(false)
    const [isMobileView, setIsMobileView] = useState(false)
    const [isDark, setIsDark] = useState(false)

    const { user, isLoading, logout: authLogout } = useAuthStore()

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const checkIsMobile = useCallback(() => {
        if (typeof window !== "undefined") {
            setIsMobileView(window.innerWidth < 768)
        }
    }, [])

    useEffect(() => {
        if (!isClient) return;

        checkIsMobile()
        window.addEventListener("resize", checkIsMobile)

        // ThemeInitializer가 body 클래스를 관리하므로, 여기서는 isDark 상태만 설정합니다.
        const storedTheme = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        let initialDark;
        if (storedTheme === "dark") {
            initialDark = true;
        } else if (storedTheme === "light") {
            initialDark = false;
        } else { 
            initialDark = prefersDark;
        }
        setIsDark(initialDark);
        // document.body.classList.toggle("dark", initialDark) // ThemeInitializer가 처리
        // document.body.classList.toggle("light", !initialDark) // ThemeInitializer가 처리
        
        return () => window.removeEventListener("resize", checkIsMobile)
    }, [isClient, checkIsMobile])

    useEffect(() => {
        if (!isClient) return;

        const mainContent = document.getElementById('main-content-area');
        if (mainContent) {
            const rootStyle = getComputedStyle(document.documentElement);
            const sidebarExpandedWidth = rootStyle.getPropertyValue('--sidebar-width-expanded').trim() || '16rem';
            const sidebarCollapsedWidth = rootStyle.getPropertyValue('--sidebar-width-collapsed').trim() || '5rem';
            
            if (isMobileView) {
                mainContent.style.paddingLeft = '0px';
            } else {
                mainContent.style.paddingLeft = isNavExpandedPC ? sidebarExpandedWidth : sidebarCollapsedWidth;
            }
        }
    }, [isClient, isMobileView, isNavExpandedPC]);

    const toggleMenu = () => {
        if (isMobileView) {
            setIsSidebarOpenMobile(!isSidebarOpenMobile)
        } else {
            setIsNavExpandedPC(!isNavExpandedPC)
        }
    }

    const toggleDarkMode = () => {
        setIsDark((prev) => {
            const next = !prev
            localStorage.setItem("theme", next ? "dark" : "light")
            document.body.classList.toggle("dark", next)
            document.body.classList.toggle("light", !next)
            return next
        })
    }

    const handleLogout = async () => {
        await authLogout()
        router.push("/")
        if (isMobileView) setIsSidebarOpenMobile(false)
    }

    const closeSidebarMenu = () => {
        if (isMobileView) {
            setIsSidebarOpenMobile(false);
        }
    }
    
    const handleMyPageClick = (e) => {
        closeSidebarMenu();
        if (!user) {
            e.preventDefault();
            alert("로그인이 필요합니다!");
            router.push("/login");
        }
    };

    const classNames = (...classes) => {
        return classes.filter(Boolean).join(" ")
    }
    
    const navigationItems = [
        { name: "홈", href: "/", icon: <HomeIcon size={22} />, action: closeSidebarMenu },
        { name: "마이페이지", href: "/mypage", icon: <MyPageIcon size={22} />, action: handleMyPageClick },
        { name: "채팅", href: "/chat", icon: <MessageSquareText size={22} />, action: closeSidebarMenu },
    ];

    if (!isClient) {
        return (
            <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 shadow-sm navigation-header animate-pulse">
                <div className="flex items-center">
                    <div className="mr-2 h-10 w-10 rounded-md bg-[var(--skeleton-bg)]"></div>
                    <div className="h-6 w-24 rounded bg-[var(--skeleton-bg)]"></div>
                </div>
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full mx-3 bg-[var(--skeleton-bg)]"></div>
                    <div className="h-8 w-28 rounded-md bg-[var(--skeleton-bg)]"></div>
                </div>
            </header>
        );
    }

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 shadow-sm navigation-header">
                <div className="flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md navigation-button"
                        aria-label={isSidebarOpenMobile || ( !isMobileView && isNavExpandedPC) ? "메뉴 닫기/축소" : "메뉴 열기/확장"}
                    >
                        {isMobileView ? (
                            isSidebarOpenMobile ? <MdClose size={24} /> : <MdMenu size={24} />
                        ) : (
                            isNavExpandedPC ? <MdChevronLeft size={28} /> : <MdMenuOpen size={24} />
                        )}
                    </button>
                    <Link href="/" className="text-xl font-bold navigation-logo">
                        RPGPT
                    </Link>
                </div>
                
                <div className="flex items-center">
                    <button
                        onClick={toggleDarkMode}
                        type="button"
                        className="p-2 rounded-full navigation-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--nav-bg)] focus:ring-[var(--nav-text)] mx-2"
                        aria-label="다크모드 토글"
                        title="다크모드 토글"
                    >
                        {isDark ? (
                            <MdOutlineWbSunny size={22} className={'text-[var(--icon-sun-color)]'} />
                        ) : (
                            <MdOutlineBedtime size={22} className={'text-[var(--icon-moon-color)]'} />
                        )}
                    </button>

                    {isLoading ? (
                        <div className="text-sm navigation-text px-3 py-2 animate-pulse">로딩...</div>
                    ) : user ? (
                        <div className="flex items-center">
                            <Link href="/mypage" className="flex items-center text-sm navigation-button px-3 py-1.5 rounded-md">
                                <MyPageIcon className="mr-1.5" size={18} />
                                {user.nickname}
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="ml-2 flex items-center text-sm navigation-button px-3 py-1.5 rounded-md">
                                <MdLogout className="mr-1.5" size={18} />
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            {pathname === "/login" ? (
                                <Link href="/signup" className="flex items-center text-sm navigation-button px-3 py-1.5 rounded-md">
                                    <MdPersonAdd className="mr-1.5" size={18} />
                                    회원가입
                                </Link>
                            ) : pathname === "/signup" ? (
                                <Link href="/login" className="flex items-center text-sm navigation-button px-3 py-1.5 rounded-md">
                                    <MdLogin className="mr-1.5" size={18} />
                                    로그인
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="flex items-center text-sm navigation-button px-3 py-1.5 rounded-md">
                                        <MdLogin className="mr-1.5" size={18} />
                                        로그인
                                    </Link>
                                    <Link href="/signup" className="ml-2 flex items-center text-sm navigation-button px-3 py-1.5 rounded-md">
                                        <MdPersonAdd className="mr-1.5" size={18} />
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <div
                className={classNames(
                    "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] shadow-lg overflow-y-auto navigation-sidebar",
                    "transition-[width,transform,opacity] duration-300 ease-in-out",
                    isMobileView 
                        ? (isSidebarOpenMobile ? "translate-x-0 w-[var(--sidebar-width-expanded)]" : "-translate-x-full w-[var(--sidebar-width-expanded)]") // 모바일에서는 항상 확장된 너비
                        : (isNavExpandedPC ? "w-[var(--sidebar-width-expanded)]" : "w-[var(--sidebar-width-collapsed)]") 
                )}
            >
                <nav className="flex flex-col p-2 space-y-1 mt-2">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name + item.href} 
                            href={item.href}
                            onClick={item.action}
                            className={classNames(
                                "flex items-center h-12 rounded-lg px-3 text-base navigation-sidebar-item",
                                pathname === item.href ? "active" : "", // active 클래스는 CSS에서 관리
                                !isMobileView && !isNavExpandedPC && "justify-center" 
                            )}
                            title={(!isMobileView && !isNavExpandedPC) ? item.name : ""}
                        >
                            <span className={classNames(
                                "flex-shrink-0 w-6 h-6 flex items-center justify-center",
                                (!isMobileView && isNavExpandedPC) && "mr-3" // PC 확장 시에만 아이콘 오른쪽 마진
                            )}>
                                {item.icon}
                            </span>
                            <span className={classNames(
                                "truncate transition-opacity duration-500 ease-in-out",
                                isMobileView // 모바일에서는 항상 텍스트 표시 (ml-3은 이미 적용됨)
                                    ? "ml-3 opacity-100"
                                    : (isNavExpandedPC // PC 확장 시에만 텍스트 표시
                                        ? "ml-3 opacity-100"
                                        : "opacity-0 w-0 overflow-hidden pointer-events-none" // PC 축소 시 텍스트 숨김
                                      )
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>

            {isMobileView && isSidebarOpenMobile && (
                <div 
                    className="fixed inset-0 z-30 pt-16 bg-black/60 md:hidden navigation-overlay" // navigation-overlay 클래스 추가
                    onClick={() => setIsSidebarOpenMobile(false)} 
                />
            )}
        </>
    )
}