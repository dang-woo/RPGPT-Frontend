import React from 'react';

export default function AuthInput({ 
    id, 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    icon: IconComponent, // 아이콘 컴포넌트를 prop으로 받음
    error,
    inputClassName // 추가적인 input 스타일링을 위한 prop
}) {

    const baseInputClasses = "w-full pr-3 py-2 border-b outline-none bg-transparent text-[var(--foreground)] placeholder-gray-400";
    const paddingLeftClass = IconComponent ? 'pl-10' : 'pl-3';
    const errorBorderClass = error ? 'border-red-500' : 'border-gray-500';
    const focusBorderClass = 'focus:border-[var(--main-button-bg)]';
    const finalInputClassName = `${baseInputClasses} ${paddingLeftClass} ${errorBorderClass} ${focusBorderClass} ${inputClassName || ''}`.trim();

    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>}
            <div className="relative">
                {IconComponent && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <IconComponent size={20} />
                    </span>
                )}
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={finalInputClassName}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
} 