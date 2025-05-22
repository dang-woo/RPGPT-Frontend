"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthInput from "@/components/auth/AuthInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthButton from "@/components/auth/AuthButton";
import useAuthStore from "@/lib/store/authStore";
import { MdPerson } from "react-icons/md";

export default function LoginPage() {
    const router = useRouter();
    const { user, isLoading, login, error: authError, clearError, isLoggingIn } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (!isLoading && user && !isLoggingIn) {
            router.push('/');
        }
    }, [user, isLoading, isLoggingIn, router]);

    useEffect(() => {
        if (authError) {
            setFormError(authError);
        }
        return () => {
            clearError();
        };
    }, [authError, clearError]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setFormError('');
        if (authError) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        if (authError) clearError();

        if (!formData.username || !formData.password) {
            setFormError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }
        try {
            const payload = {
                userId: formData.username,
                password: formData.password
            };
            await login(payload);
        } catch (err) {
            console.error('Login submission failed:', err.message);
        }
    };

    return (
        <AuthLayout 
            formTitle="로그인"
            subtitleText="계정이 없으신가요?"
            subtitleLinkHref="/signup"
            subtitleLinkText="회원가입"
        >
            <form className="space-y-6" onSubmit={handleSubmit}>
                <AuthInput 
                    id="username"
                    label="아이디"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="아이디를 입력하세요"
                    icon={MdPerson}
                />
                <PasswordInput 
                    id="password"
                    label="비밀번호"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력하세요"
                />
                 <div className="flex items-center justify-end text-xs">
                    <Link href="#" className="font-medium text-[var(--link-accent-color)] hover:text-[var(--foreground)]">
                        아이디/비밀번호 찾기
                    </Link>
                </div>
                {formError && (
                    <p className="text-red-500 text-sm text-center -mt-3 mb-2">{formError}</p>
                )}
                <AuthButton text={isLoggingIn ? "로그인 중..." : "로그인"} />
            </form>
        </AuthLayout>
    );
}