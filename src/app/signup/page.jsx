"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdPerson, MdBadge, MdEmail, MdVpnKey } from "react-icons/md";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthButton from "@/components/auth/AuthButton";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthInput from "@/components/auth/AuthInput";
import useAuthStore from "@/lib/store/authStore";
import apiClient from "@/lib/apiClient";

export default function SignupPage() {
    const router = useRouter();
    const { signup, isLoading, error: authError, clearError, isSigningUp } = useAuthStore();
    
    const [formData, setFormData] = useState({
        nickname: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });

    const [errors, setErrors] = useState({
        nickname: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        verificationCode: '',
        form: ''
    });

    const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
    const [verificationApiError, setVerificationApiError] = useState('');
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        if (authError) {
            setErrors(prev => ({ ...prev, form: authError }));
        }
        return () => {
            clearError();
        };
    }, [authError, clearError]);

    useEffect(() => {
        let interval;
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setVerificationApiError('인증 코드 유효 시간이 만료되었습니다. 이메일을 확인하고 다시 시도해주세요.');
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

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
        
        if (id === 'email') {
            setIsEmailVerified(false);
            setIsVerificationCodeSent(false);
            setTimer(0);
            setIsTimerRunning(false);
            setVerificationApiError('');
            setErrors(prev => ({ ...prev, verificationCode: ''}));
        }
        if (id === 'verificationCode') {
            setVerificationApiError('');
        }

        if (authError) clearError();
    };

    const handleSendVerificationCode = async () => {
        setVerificationApiError('');
        setErrors(prev => ({ ...prev, email: '', verificationCode: '' }));

        if (!formData.email.trim()) {
            setErrors(prev => ({ ...prev, email: '이메일을 입력해주세요.' }));
            return;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setErrors(prev => ({ ...prev, email: '유효한 이메일 주소를 입력해주세요.' }));
            return;
        }

        setEmailVerificationLoading(true);
        try {
            const response = await apiClient.post('/auth/send-verification', { email: formData.email });
            if (response.data && response.data.success) {
                setIsVerificationCodeSent(true);
                setTimer(300);
                setIsTimerRunning(true);
                setVerificationApiError('');
            } else {
                setVerificationApiError(response.data?.message || '인증 코드 발송에 실패했습니다.');
            }
        } catch (error) {
            setVerificationApiError(error.response?.data?.message || error.message || '인증 코드 발송 중 오류가 발생했습니다.');
        } finally {
            setEmailVerificationLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setVerificationApiError('');
        setErrors(prev => ({ ...prev, verificationCode: '' }));

        if (!formData.verificationCode || !formData.verificationCode.trim()) {
            setErrors(prev => ({ ...prev, verificationCode: '인증 코드를 입력해주세요.' }));
            return;
        }
        
        setEmailVerificationLoading(true);
        try {
            const response = await apiClient.post('/auth/verify-email', {
                email: formData.email,
                verificationCode: formData.verificationCode
            });
            if (response.data && response.data.success) {
                setIsEmailVerified(true);
                setIsTimerRunning(false);
                setVerificationApiError('');
            } else {
                setVerificationApiError(response.data?.message || '인증 코드가 올바르지 않거나 만료되었습니다.');
                setIsEmailVerified(false);
            }
        } catch (error) {
            setVerificationApiError(error.response?.data?.message || error.message || '인증 확인 중 오류가 발생했습니다.');
            setIsEmailVerified(false);
        } finally {
            setEmailVerificationLoading(false);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            nickname: '',
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            verificationCode: '',
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
            : formData.password.length < 4
            ? '비밀번호는 4자 이상이어야 합니다'
            : '';
        if (newErrors.password) isValid = false;

        newErrors.confirmPassword = !formData.confirmPassword
            ? '비밀번호 확인을 입력해주세요'
            : formData.password !== formData.confirmPassword
            ? '비밀번호가 일치하지 않습니다'
            : '';
        if (newErrors.confirmPassword) isValid = false;

        const emailRegexValidate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        newErrors.email = !formData.email.trim()
            ? '이메일을 입력해주세요.'
            : !emailRegexValidate.test(formData.email)
            ? '유효한 이메일 주소를 입력해주세요.'
            : '';
        if (newErrors.email) isValid = false;

        if (!isEmailVerified) {
            if (!newErrors.form) {
                 newErrors.form = '이메일 인증을 완료해주세요.';
            }
            isValid = false;
            if (isVerificationCodeSent && (!formData.verificationCode || !formData.verificationCode.trim()) && !newErrors.verificationCode) {
                newErrors.verificationCode = '인증 코드를 입력해주세요.';
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(prev => ({ ...prev, form: '' }));
        setVerificationApiError('');
        if (authError) clearError();

        if (validateForm()) {
            try {
                const payload = {
                    userId: formData.username,
                    email: formData.email,
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
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
                <div className="space-y-1">
                    <div className="flex items-end space-x-2">
                        <AuthInput
                            id="email"
                            label="이메일"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일 주소를 입력하세요"
                            icon={MdEmail}
                            error={errors.email}
                            disabled={isVerificationCodeSent && !isEmailVerified || emailVerificationLoading}
                        />
                        <button
                            type="button"
                            onClick={handleSendVerificationCode}
                            disabled={isVerificationCodeSent && !isEmailVerified || emailVerificationLoading || !formData.email.trim() || !!errors.email}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-[var(--main-button-bg)] rounded-md hover:bg-[var(--main-button-hover-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-button-bg)] disabled:opacity-50 whitespace-nowrap h-[42px] flex-shrink-0"
                        >
                            {emailVerificationLoading && !isVerificationCodeSent ? "발송 중..." : (isVerificationCodeSent && !isEmailVerified ? "재발송" : "인증코드 발송")}
                        </button>
                    </div>
                    {isVerificationCodeSent && !isEmailVerified && !verificationApiError && timer > 0 && (
                        <p className="text-green-600 text-xs mt-1">인증 코드가 발송되었습니다. 이메일을 확인해주세요.</p>
                    )}
                    {verificationApiError && !errors.email && !errors.verificationCode && (
                        <p className="text-red-500 text-xs mt-1">{verificationApiError}</p>
                    )}
                </div>

                {isVerificationCodeSent && !isEmailVerified && (
                    <div className="space-y-1">
                        <div className="flex items-end space-x-2">
                            <AuthInput
                                id="verificationCode"
                                label="인증 코드"
                                type="text"
                                value={formData.verificationCode || ''}
                                onChange={handleChange}
                                placeholder="인증 코드를 입력하세요"
                                icon={MdVpnKey}
                                error={errors.verificationCode}
                                disabled={emailVerificationLoading || isEmailVerified}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={emailVerificationLoading || isEmailVerified || !formData.verificationCode?.trim()}
                                className="px-4 py-2.5 text-sm font-medium text-white bg-[var(--main-button-bg)] rounded-md hover:bg-[var(--main-button-hover-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-button-bg)] disabled:opacity-50 whitespace-nowrap h-[42px] flex-shrink-0"
                            >
                                {emailVerificationLoading && isVerificationCodeSent ? "확인 중..." : "인증 확인"}
                            </button>
                        </div>
                        {timer > 0 && !isEmailVerified && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                유효 시간: {Math.floor(timer / 60)}분 {timer % 60}초
                            </p>
                        )}
                        {verificationApiError && !errors.verificationCode && (
                             <p className="text-red-500 text-xs mt-1">{verificationApiError}</p>
                        )}
                    </div>
                )}
                {isEmailVerified && (
                    <p className="text-green-600 text-sm font-medium mt-1">이메일 인증이 완료되었습니다.</p>
                )}

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
                {errors.form && (
                    <p className="text-red-500 text-sm text-center -mt-3 mb-2">{errors.form}</p>
                )}
                <AuthButton text={isSigningUp ? "회원가입 중..." : "회원가입"} />
            </form>
        </AuthLayout>
    );
}