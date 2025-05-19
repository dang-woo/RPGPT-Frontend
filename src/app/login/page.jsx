"use client";

import { MdPerson } from "react-icons/md";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthButton from "@/components/auth/AuthButton";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthInput from "@/components/auth/AuthInput";

export default function LoginPage() {
    return (
        <div className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col lg:flex-row">
            {/* 왼쪽: 로그인 폼 */}
            <div className="lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-16 xl:px-24 2xl:px-32">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">로그인</h2>
                        <p className="mb-4 text-base">
                            아직 계정이 없으신가요?<br />
                            <a href="/signup" className="font-bold hover:underline text-[var(--link-accent-color)]">회원가입</a>
                        </p>
                    </div>
                    <form className="space-y-6">
                        <AuthInput 
                            id="username"
                            label="아이디"
                            placeholder="아이디를 입력하세요"
                            icon={MdPerson}
                        />
                        <PasswordInput 
                            id="password"
                            label="비밀번호"
                            placeholder="비밀번호를 입력하세요"
                        />
                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" /> 로그인 상태 유지
                            </label>
                            <a href="#" className="hover:underline">비밀번호를 잊으셨나요?</a>
                        </div>
                        <AuthButton text="로그인" />
                    </form>
                </div>
            </div>
            {/* 오른쪽: 배경 사진 */}
            <AuthBackground className="lg:w-3/5 flex-shrink-0" />
        </div>
    );
}