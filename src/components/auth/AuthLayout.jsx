import AuthBackground from "./AuthBackground";

export default function AuthLayout({
    formTitle,
    subtitleText,
    subtitleLinkHref,
    subtitleLinkText,
    children
}) {
    return (
        <div className="w-full min-h-screen text-[var(--foreground)] flex flex-col lg:flex-row">
            {/* 왼쪽: 폼 섹션 */}
            <div className="lg:w-2/5 flex flex-col justify-center items-center px-6 pt-16 pb-8 lg:px-8 xl:px-12">
                {/* Mobile Logo */}
                <div className="block lg:hidden text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[var(--foreground)]">RPGPT</h1>
                </div>
                <div className="max-w-md w-full">
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold mb-2">{formTitle}</h2>
                        {subtitleText && (
                            <p className="text-base mt-1">
                                {subtitleText}<br />
                                <a href={subtitleLinkHref} className="font-bold hover:underline text-[var(--link-accent-color)]">
                                    {subtitleLinkText}
                                </a>
                            </p>
                        )}
                    </div>
                    {children} {/* 폼 내용이 여기에 렌더링됩니다. */}
                </div>
            </div>
            {/* 오른쪽: 배경 사진 */}
            <AuthBackground className="lg:w-3/5 flex-shrink-0" />
        </div>
    );
} 