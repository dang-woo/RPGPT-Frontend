"use client";

import { useState } from "react";
import { MdPerson, MdBadge, MdLockOutline } from "react-icons/md";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthButton from "@/components/auth/AuthButton";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthInput from "@/components/auth/AuthInput";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        nickname: '',
        username: '',
        password: '',
        confirmPassword: '',
        termsAgreement: false
    });

    const [errors, setErrors] = useState({
        nickname: '',
        username: '',
        password: '',
        confirmPassword: '',
        termsAgreement: ''
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({
            ...prev,
            [id]: ''
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            nickname: '',
            username: '',
            password: '',
            confirmPassword: '',
            termsAgreement: ''
        };

        // 닉네임 검증
        newErrors.nickname = !formData.nickname.trim()
            ? '닉네임을 입력해주세요'
            : formData.nickname.length < 2
            ? '닉네임은 2자 이상이어야 합니다'
            : '';
        if (newErrors.nickname) isValid = false;

        // 아이디 검증
        newErrors.username = !formData.username.trim()
            ? '아이디를 입력해주세요'
            : formData.username.length < 4
            ? '아이디는 4자 이상이어야 합니다'
            : '';
        if (newErrors.username) isValid = false;

        // 비밀번호 검증
        newErrors.password = !formData.password
            ? '비밀번호를 입력해주세요'
            : formData.password.length < 6
            ? '비밀번호는 6자 이상이어야 합니다'
            : '';
        if (newErrors.password) isValid = false;

        // 비밀번호 확인 검증
        newErrors.confirmPassword = !formData.confirmPassword
            ? '비밀번호 확인을 입력해주세요'
            : formData.password !== formData.confirmPassword
            ? '비밀번호가 일치하지 않습니다'
            : '';
        if (newErrors.confirmPassword) isValid = false;

        // 이용약관 동의 검증
        newErrors.termsAgreement = !formData.termsAgreement
            ? '이용약관에 동의해주세요.'
            : '';
        if (newErrors.termsAgreement) isValid = false;

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // TODO: 백엔드 API 연동
            console.log('Form submitted:', formData);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col lg:flex-row">
            {/* 왼쪽: 회원가입 폼 */}
            <div className="lg:w-2/5 flex flex-col justify-center px-6 py-8 lg:px-16 xl:px-24 2xl:px-32">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2">회원가입</h2>
                        <p className="mb-4 text-base">
                            이미 계정이 있으신가요?<br />
                            <a href="/login" className="font-bold hover:underline text-[var(--link-accent-color)]">로그인</a>
                        </p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <AuthInput 
                            id="nickname"
                            label="닉네임"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="닉네임을 입력하세요"
                            icon={MdBadge}
                            error={errors.nickname}
                        />
                        <AuthInput 
                            id="username"
                            label="아이디"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="아이디를 입력하세요"
                            icon={MdPerson}
                            error={errors.username}
                        />
                        <PasswordInput 
                            id="password"
                            label="비밀번호"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                            error={errors.password}
                        />
                        <PasswordInput 
                            id="confirmPassword"
                            label="비밀번호 확인"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력하세요"
                            error={errors.confirmPassword}
                        />
                        <div className="flex items-center justify-between text-xs">
                            <label htmlFor="termsAgreement" className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    id="termsAgreement"
                                    checked={formData.termsAgreement}
                                    onChange={handleChange}
                                    className="mr-2 h-4 w-4 text-[var(--main-button-bg)] focus:ring-[var(--main-button-bg)] border-gray-300 rounded"
                                /> 
                                <span className="text-gray-400 hover:text-[var(--foreground)]">
                                    이용약관에 동의합니다. (필수)
                                </span>
                            </label>
                        </div>
                        {errors.termsAgreement && (
                            <p className="text-red-500 text-xs -mt-3 mb-2">{errors.termsAgreement}</p>
                        )}
                        <AuthButton text="회원가입" />
                    </form>
                </div>
            </div>
            {/* 오른쪽: 배경 사진 */}
            <AuthBackground className="lg:w-3/5 flex-shrink-0" />
        </div>
    );
}