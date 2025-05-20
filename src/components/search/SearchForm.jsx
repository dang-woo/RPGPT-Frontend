"use client";

import React from 'react';

export default function SearchForm({
    onSubmit,
    serverOptions = [],
    selectedServer,
    onServerChange,
    characterPlaceholder = "캐릭터, 모험단, 길드",
    characterName,
    onCharacterNameChange,
    buttonText = "SEARCH",
    isLoading = false,
    // children prop은 이 UI 디자인에서는 기본적으로 활용되지 않음
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="mb-8 flex items-center rounded-t-md shadow-lg border border-b-0 h-14"
            style={{
                backgroundColor: 'var(--search-bg)',
                borderColor: 'var(--search-border)',
            }}
        >
            {/* 서버 선택 (옵션이 있을 경우에만 렌더링) */}
            {serverOptions && serverOptions.length > 0 && (
                <div className="relative w-1/3 sm:w-1/4 md:w-1/5 h-full border-r" style={{ borderColor: 'var(--search-border)' }}>
                    <select
                        id="search-form-server-select"
                        value={selectedServer}
                        onChange={onServerChange}
                        className="w-full h-full pl-4 pr-10 text-base appearance-none focus:outline-none bg-transparent"
                        style={{ color: 'var(--search-text)' }}
                        aria-label="서버 선택"
                    >
                        {serverOptions.map((option) => (
                            <option
                                key={option.id}
                                value={option.id}
                                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                            >
                                {option.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'var(--search-icon)' }}>
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            )}

            {/* 캐릭터명 입력 */}
            <div className="relative flex-grow h-full">
                <input
                    id="search-form-character-input"
                    type="text"
                    placeholder={characterPlaceholder}
                    value={characterName}
                    onChange={onCharacterNameChange}
                    className="w-full h-full px-4 text-base focus:outline-none bg-transparent placeholder-current"
                    style={{
                        color: 'var(--search-text)',
                        '--placeholder-color': 'var(--search-placeholder)',
                    }}
                    aria-label={characterPlaceholder}
                />
            </div>

            {/* 검색 버튼 */}
            <button
                type="submit"
                disabled={isLoading}
                className="h-full px-6 font-semibold text-base text-white transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded-r-md shrink-0"
                style={{
                    backgroundColor: isLoading ? 'var(--main-button-disabled-bg, #A0A0A0)' : 'var(--main-button-bg)',
                    color: 'var(--main-button-text, white)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    borderTopLeftRadius: !(serverOptions && serverOptions.length > 0) ? '0.375rem' : '0', // 서버 선택 없을 시 왼쪽 모서리 둥글게
                    borderBottomLeftRadius: !(serverOptions && serverOptions.length > 0) ? '0.375rem' : '0', // 서버 선택 없을 시 왼쪽 모서리 둥글게
                }}
                onMouseOver={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--main-button-hover-bg)'; }}
                onMouseOut={e => { if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--main-button-bg)'; }}
            >
                {isLoading ? "검색중..." : buttonText}
            </button>
        </form>
    );
} 