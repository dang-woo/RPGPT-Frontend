"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Navigation() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // 페이지 로드 시 현재 모드 반영
        if (typeof window !== "undefined") {
            const dark = localStorage.getItem("theme") === "dark"
            setIsDark(dark)
            document.body.classList.toggle("dark", dark)
            document.body.classList.toggle("light", !dark)
        }
    }, [])

    const toggleMenu = () => setIsOpen(!isOpen)
    const toggleDarkMode = () => {
        setIsDark((prev) => {
            const next = !prev
            if (next) {
                document.body.classList.add("dark")
                document.body.classList.remove("light")
                localStorage.setItem("theme", "dark")
            } else {
                document.body.classList.remove("dark")
                document.body.classList.add("light")
                localStorage.setItem("theme", "light")
            }
            return next
        })
    }

    // 클래스 이름을 조건부로 결합하는 함수
    const classNames = (...classes) => {
        return classes.filter(Boolean).join(" ")
    }

    const gameLinks = [
        { name: "홈", href: "/" },
        { name: "로스트아크", href: "/lostark" },
        { name: "메이플스토리", href: "/maplestory" },
        { name: "던전앤파이터", href: "/dnf" },
    ]

    return (
        <>
            {/* 헤더 */}
            <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 shadow-sm navigation-header">
                <div className="flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors navigation-button"
                        aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
                    >
                        {isOpen ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <line x1="4" x2="20" y1="12" y2="12"></line>
                                <line x1="4" x2="20" y1="6" y2="6"></line>
                                <line x1="4" x2="20" y1="18" y2="18"></line>
                            </svg>
                        )}
                    </button>
                    <Link href="/" className="text-xl font-bold navigation-logo">
                        RPGPT
                    </Link>
                </div>
                {/* 다크모드 토글 버튼 */}
                <button
                    onClick={toggleDarkMode}
                    className="ml-4 text-2xl focus:outline-none navigation-button"
                    aria-label="다크모드 토글"
                    title="다크모드 토글"
                >
                    {isDark ? "🌙" : "☀️"}
                </button>
            </header>

            {/* 네비게이션 사이드바 */}
            <div
                className={classNames(
                    "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transition-transform duration-300 ease-in-out navigation-sidebar",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex flex-col p-4">
                    <nav className="space-y-2">
                        {gameLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={classNames(
                                    "flex h-10 items-center rounded-md px-4 text-lg transition-colors navigation-sidebar-item",
                                    pathname === link.href ? "active font-medium" : "",
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 모바일에서 사이드바가 열렸을 때 배경 오버레이 */}
            {isOpen && <div className="fixed inset-0 z-30 pt-16 navigation-overlay" onClick={() => setIsOpen(false)} />}
        </>
    )
}