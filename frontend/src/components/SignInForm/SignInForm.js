import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './SignInForm.css';
import axiosInstance from '../../fetch/fetch.js';
import { Context } from '../../Context/Context';

const SignInForm = () => {
    const navigate = useNavigate();
    const { language } = useContext(Context);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        user: '',
        phone: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const texts = {
        en: {
            name: "Full Name",
            username: "Username",
            phone: "Phone Number",
            password: "Password",
            enterPhone: "Enter 10 digits",
            signIn: "Sign In",
            signingIn: "Signing In...",
            haveAccount: "Already have an account?",
            login: "Login",
            createAccount: "Create an account",
            letsGetStarted: "Let's get you started",
            // Validation messages
            nameRequired: "Name is required",
            userRequired: "Username is required",
            userLength: "Username must be at least 3 characters",
            phoneRequired: "Phone number is required",
            phoneLength: "Phone number must be exactly 10 digits",
            passwordRequired: "Password is required",
            passwordLength: "Password must be at least 8 characters",
            registrationSuccess: "Registration successful! 🎉",
            registrationFailed: "Registration failed"
        },
        fr: {
            name: "Nom complet",
            username: "Nom d'utilisateur",
            phone: "Numéro de téléphone",
            password: "Mot de passe",
            enterPhone: "Entrez 10 chiffres",
            signIn: "S'inscrire",
            signingIn: "Inscription en cours...",
            haveAccount: "Vous avez déjà un compte ?",
            login: "Connexion",
            createAccount: "Créer un compte",
            letsGetStarted: "Commençons",
            // Validation messages
            nameRequired: "Le nom est requis",
            userRequired: "Le nom d'utilisateur est requis",
            userLength: "Le nom d'utilisateur doit contenir au moins 3 caractères",
            phoneRequired: "Le numéro de téléphone est requis",
            phoneLength: "Le numéro de téléphone doit contenir exactement 10 chiffres",
            passwordRequired: "Le mot de passe est requis",
            passwordLength: "Le mot de passe doit contenir au moins 8 caractères",
            registrationSuccess: "Inscription réussie ! 🎉",
            registrationFailed: "Échec de l'inscription"
        },
        ar: {
            name: "الاسم الكامل",
            username: "اسم المستخدم",
            phone: "رقم الهاتف",
            password: "كلمة المرور",
            enterPhone: "أدخل 10 أرقام",
            signIn: "تسجيل",
            signingIn: "جاري التسجيل...",
            haveAccount: "لديك حساب بالفعل؟",
            login: "تسجيل الدخول",
            createAccount: "إنشاء حساب",
            letsGetStarted: "هيا نبدأ",
            // Validation messages
            nameRequired: "الاسم مطلوب",
            userRequired: "اسم المستخدم مطلوب",
            userLength: "يجب أن يحتوي اسم المستخدم على 3 أحرف على الأقل",
            phoneRequired: "رقم الهاتف مطلوب",
            phoneLength: "يجب أن يتكون رقم الهاتف من 10 أرقام بالضبط",
            passwordRequired: "كلمة المرور مطلوبة",
            passwordLength: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل",
            registrationSuccess: "تم التسجيل بنجاح! 🎉",
            registrationFailed: "فشل التسجيل"
        }
    };

    const currentTexts = texts[language] || texts.en;

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        // For phone, only allow digits
        if (name === 'phone') {
            processedValue = value.replace(/\D/g, '').slice(0, 10);
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue.trim()
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = currentTexts.nameRequired;
        }
        
        if (!formData.user.trim()) {
            newErrors.user = currentTexts.userRequired;
        } else if (formData.user.length < 3) {
            newErrors.user = currentTexts.userLength;
        }
        
        if (!formData.phone) {
            newErrors.phone = currentTexts.phoneRequired;
        } else if (formData.phone.length !== 10) {
            newErrors.phone = currentTexts.phoneLength;
        }
        
        if (!formData.password) {
            newErrors.password = currentTexts.passwordRequired;
        } else if (formData.password.length < 8) {
            newErrors.password = currentTexts.passwordLength;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post('/api/users/register', formData);
            toast.success(currentTexts.registrationSuccess);
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || currentTexts.registrationFailed;
            toast.error(errorMessage);
            
            if (err.response?.data?.field) {
                setErrors(prev => ({
                    ...prev,
                    [err.response.data.field]: errorMessage
                }));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signin-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="logo5">
                <img className='logo-img3' src="/logo.PNG" alt="Logo" />
            </div>

            <div className="welcome-text">
                <h2>{currentTexts.createAccount}</h2>
                <p>{currentTexts.letsGetStarted}</p>
            </div>

            <form className="signin-forms" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">{currentTexts.name}</label>
                    <div className="input-containe">
                        <User className="input-icon" />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder={currentTexts.name}
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                        />
                    </div>
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="user">{currentTexts.username}</label>
                    <div className="input-containe">
                        <Mail className="input-icon" />
                        <input
                            type="text"
                            id="user"
                            name="user"
                            placeholder={currentTexts.username}
                            value={formData.user}
                            onChange={handleChange}
                            className={errors.user ? 'error' : ''}
                        />
                    </div>
                    {errors.user && <span className="error-message">{errors.user}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">{currentTexts.phone}</label>
                    <div className="input-containe">
                        <Phone className="input-icon" />
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder={currentTexts.enterPhone}
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? 'error' : ''}
                        />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">{currentTexts.password}</label>
                    <div className="input-container">
                        <Lock className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder={currentTexts.password}
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-toggles"
                        >
                            {showPassword ? 
                                <EyeOff className="toggle-icon" /> : 
                                <Eye className="toggle-icon" />
                            }
                        </button>
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`signin-button ${isSubmitting ? 'loading' : ''}`}
                >
                    {isSubmitting ? currentTexts.signingIn : currentTexts.signIn}
                </button>
            </form>

            <p className="login-text">
                {currentTexts.haveAccount}{' '}
                <a href="/login">{currentTexts.login}</a>
            </p>
        </div>
    );
};

export default SignInForm;