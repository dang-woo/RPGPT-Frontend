"use client";

import { useState } from "react";
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
    const { login, fetchCurrentUser } = useAuthStore(); // login, fetchCurrentUser 액션 가져오기

    const [formData, setFormData] = useState({
        username: '', // 백엔드 LoginDto의 userId에 해당
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setError(''); // 입력 시 에러 메시지 초기화
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 제출 시 에러 메시지 초기화
        if (!formData.username || !formData.password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }
        try {
            const payload = {
                userId: formData.username, // 백엔드 LoginDto의 userId에 맞게 전달
                password: formData.password
            };
            const result = await login(payload); // authStore의 login 액션 호출
            console.log('Login successful:', result);
            await fetchCurrentUser(); // 로그인 성공 후 최신 사용자 정보 가져오기
            router.push('/'); // 로그인 성공 시 메인 페이지로 이동
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