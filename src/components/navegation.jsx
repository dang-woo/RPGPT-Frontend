"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function Navigation() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const toggleMenu = () => setIsOpen(!isOpen)

    const handleSearch = (e) => {
        e.preventDefault()
        alert(`검색어: ${searchQuery}`)
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
                        3차 프로젝트
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="relative flex items-center">
                    <input
                        type="search"
                        placeholder="검색..."
                        className="flex h-10 w-40 rounded-full border px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950 md:w-64 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden navigation-search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors navigation-search-icon"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>
                        <span className="sr-only">검색</span>
                    </button>
                </form>
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