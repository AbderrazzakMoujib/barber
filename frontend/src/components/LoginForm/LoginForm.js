// LoginForm.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../../Context/Context';
import axiosInstance from '../../fetch/fetch.js';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import './LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        userInput: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { setUser, language } = useContext(Context);

    const texts = {
        en: {
            username: "Username / Phone",
            password: "Password",
            login: "Login",
            loggingIn: "Logging in...",
            noAccount: "Don't have an account yet?",
            signUp: "Sign Up",
            admin: "Admin Portal",
            fillFields: "Please fill in all fields 🚫",
            loginFailed: "Login failed. Please check your credentials.",
            welcomeBack: "Welcome back",
            loginToAccount: "Login to your account"
        },
        fr: {
            username: "Nom d'utilisateur / Téléphone",
            password: "Mot de passe",
            login: "Connexion",
            loggingIn: "Connexion en cours...",
            noAccount: "Vous n'avez pas encore de compte ?",
            signUp: "Inscrivez-vous",
            admin: "Portail Admin",
            fillFields: "Veuillez remplir tous les champs 🚫",
            loginFailed: "Échec de la connexion. Veuillez vérifier vos informations.",
            welcomeBack: "Bon retour",
            loginToAccount: "Connectez-vous à votre compte"
        },
        ar: {
            username: "اسم المستخدم / الهاتف",
            password: "كلمة المرور",
            login: "تسجيل الدخول",
            loggingIn: "جاري تسجيل الدخول...",
            noAccount: "ليس لديك حساب بعد؟",
            signUp: "اشتراك",
            admin: "بوابة المشرف",
            fillFields: "يرجى ملء جميع الحقول 🚫",
            loginFailed: "فشل تسجيل الدخول. يرجى التحقق من بياناتك.",
            welcomeBack: "مرحباً بعودتك",
            loginToAccount: "تسجيل الدخول إلى حسابك"
        }
    };

    const currentTexts = texts[language] || texts.en;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userInput || !formData.password) {
            toast.error(currentTexts.fillFields);
            return;
        }

        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/api/users/login', {
                user: formData.userInput,
                password: formData.password
            });

            if (response.data && response.data._id) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
                toast.success(`${currentTexts.login} successful! 🎉`);
                navigate('/appointment-screen');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || currentTexts.loginFailed;
            toast.error(errorMessage);
            setFormData(prev => ({
                ...prev,
                password: ''
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="login-container">
                <div className="logo-container">
                    <img src="/logo.PNG" alt="Logo" className="logo" />
                </div>

                <div className="welcome-text">
                    <h2>{currentTexts.welcomeBack}</h2>
                    <p>{currentTexts.loginToAccount}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>{currentTexts.username}</label>
                        <div className="input-container">
                            <User className="input-icon" />
                            <input
                                type="text"
                                name="userInput"
                                value={formData.userInput}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    userInput: e.target.value.trim() 
                                }))}
                                placeholder={currentTexts.username}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{currentTexts.password}</label>
                        <div className="input-container">
                            <Lock className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ 
                                    ...prev, 
                                    password: e.target.value.trim() 
                                }))}
                                placeholder={currentTexts.password}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                            >
                                {showPassword ? 
                                    <EyeOff className="toggle-icon" /> : 
                                    <Eye className="toggle-icon" />
                                }
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`login-buttons ${isLoading ? 'loading' : ''}`}
                    >
                        {isLoading ? currentTexts.loggingIn : currentTexts.login}
                    </button>

                    <div className="signup-text">
                        {currentTexts.noAccount}{' '}
                        <a href="/sign-in">{currentTexts.signUp}</a>
                    </div>
                </form>

                <button
                    onClick={() => navigate('/admin-login')}
                    className="admin-button"
                >
                    {currentTexts.admin}
                </button>
            </div>
        </div>
    );
};

export default LoginForm;