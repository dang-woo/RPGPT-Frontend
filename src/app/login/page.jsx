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
    const { user, isLoading, login, fetchCurrentUser } = useAuthStore();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // 사용자가 이미 로그인 되어 있고, 로딩이 끝난 상태라면 메인으로 보낼 수 있으나,
        // 요청은 "페이지가 항상 보이게" 이므로, 이 부분은 로그인 성공 시 handleSubmit 내부에서 처리.
        // 만약 이 페이지에 접근했을 때 이미 로그인 되어있다면, handleSubmit은 일어나지 않으므로,
        // 이 부분은 사용자의 명확한 의도에 따라 남겨두거나 제거할 수 있습니다.
        // 여기서는 "페이지가 항상 보이게"에 집중하여, 페이지 로드 시 리디렉션은 제거합니다.
        // if (!isLoading && user) {
        //     router.push('/');
        // }
    }, [user, isLoading, router]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.username || !formData.password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }
        try {
            const payload = {
                userId: formData.username,
                password: formData.password
            };
            const result = await login(payload);
            router.push('/');
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.message || '로그인 중 오류가 발생했습니다.');
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
                    <Link href="#" className="font-medium text-[var(--main-hover-text)] hover:text-[var(--main-text)]">
                        아이디/비밀번호 찾기
                    </Link>
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center -mt-3 mb-2">{error}</p>
                )}
                <AuthButton text="로그인" />
            </form>
        </AuthLayout>
    );
}