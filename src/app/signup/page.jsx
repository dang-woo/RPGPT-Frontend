"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdPerson, MdBadge } from "react-icons/md";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthInput from "@/components/auth/AuthInput";
import useAuthStore from "@/lib/store/authStore";

export default function SignupPage() {
    const router = useRouter();
    const { signup, isLoading, error: authError, clearError, isSigningUp } = useAuthStore();
    
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
        termsAgreement: '',
        form: ''
    });

    useEffect(() => {
        if (authError) {
            setErrors(prev => ({ ...prev, form: authError }));
        }
        return () => {
            clearError();
        };
    }, [authError, clearError]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
        setErrors(prev => ({
            ...prev,
            [id]: '',
            form: ''
        }));
        if (authError) clearError();
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            nickname: '',
            username: '',
            password: '',
            confirmPassword: '',
            termsAgreement: '',
            form: errors.form
        };

        newErrors.nickname = !formData.nickname.trim()
            ? '닉네임을 입력해주세요'
            : formData.nickname.length < 2
            ? '닉네임은 2자 이상이어야 합니다'
            : '';
        if (newErrors.nickname) isValid = false;

        newErrors.username = !formData.username.trim()
            ? '아이디를 입력해주세요'
            : formData.username.length < 4
            ? '아이디는 4자 이상이어야 합니다'
            : '';
        if (newErrors.username) isValid = false;

        newErrors.password = !formData.password
            ? '비밀번호를 입력해주세요'
            : formData.password.length < 6
            ? '비밀번호는 6자 이상이어야 합니다'
            : '';
        if (newErrors.password) isValid = false;

        newErrors.confirmPassword = !formData.confirmPassword
            ? '비밀번호 확인을 입력해주세요'
            : formData.password !== formData.confirmPassword
            ? '비밀번호가 일치하지 않습니다'
            : '';
        if (newErrors.confirmPassword) isValid = false;

        newErrors.termsAgreement = !formData.termsAgreement
            ? '이용약관에 동의해주세요.'
            : '';
        if (newErrors.termsAgreement) isValid = false;

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, form: '' }));
        if (authError) clearError();

        if (validateForm()) {
            try {
                const payload = {
                    userId: formData.username,
                    password: formData.password,
                    passwordConfirm: formData.confirmPassword,
                    nickname: formData.nickname
                };
                const result = await signup(payload);
                
                alert(result.message || '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                router.push('/login');

            } catch (error) {
                console.error('Signup submission failed:', error.message);
            }
        }
    };

    return (
        <AuthLayout
            formTitle="회원가입"
            subtitleText="이미 계정이 있으신가요?"
            subtitleLinkHref="/login"
            subtitleLinkText="로그인"
        >
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
                    <p className="text-red-500 text-xs mt-1 mb-2">{errors.termsAgreement}</p>
                )}
                {errors.form && (
                    <p className="text-red-500 text-sm text-center -mt-3 mb-2">{errors.form}</p>
                )}
                <AuthButton text={isSigningUp ? "회원가입 중..." : "회원가입"} />
            </form>
        </AuthLayout>
    );
}