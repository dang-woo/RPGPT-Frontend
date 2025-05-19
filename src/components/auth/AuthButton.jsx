import React from 'react';

export default function AuthButton({ text }) {
    return (
        <button
            type="submit"
            className="w-full py-3 rounded-full font-semibold shadow-md transition-colors text-lg mt-2"
            style={{background: 'var(--main-button-bg)', color: '#fff'}}
            onMouseOver={e => e.currentTarget.style.background = 'var(--main-button-hover-bg)'}
            onMouseOut={e => e.currentTarget.style.background = 'var(--main-button-bg)'}
        >
            {text}
        </button>
    );
} 