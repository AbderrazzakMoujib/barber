// LoginForm.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../../Context/Context';
import axiosInstance from '../../fetch/fetch.js';
import './LoginForm.css';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userInput: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Get language directly from context
    const { setUser, language } = useContext(Context);

    // Multilingual texts
    const texts = {
        en: {
            username: "Username / Phone",
            password: "Password",
            login: "Login",
            loggingIn: "Logging in...",
            noAccount: "Don't have an account yet?",
            signUp: "Sign Up",
            admin: "Admin",
            fillFields: "Please fill in all fields 🚫",
            loginFailed: "Login failed. Please check your credentials."
        },
        fr: {
            username: "Nom d'utilisateur / Téléphone",
            password: "Mot de passe",
            login: "Connexion",
            loggingIn: "Connexion en cours...",
            noAccount: "Vous n'avez pas encore de compte ?",
            signUp: "Inscrivez-vous",
            admin: "Admin",
            fillFields: "Veuillez remplir tous les champs 🚫",
            loginFailed: "Échec de la connexion. Veuillez vérifier vos informations."
        },
        ar: {
            username: "اسم المستخدم / الهاتف",
            password: "كلمة المرور",
            login: "تسجيل الدخول",
            loggingIn: "جاري تسجيل الدخول...",
            noAccount: "ليس لديك حساب بعد؟",
            signUp: "اشتراك",
            admin: "مدير",
            fillFields: "يرجى ملء جميع الحقول 🚫",
            loginFailed: "فشل تسجيل الدخول. يرجى التحقق من بياناتك."
        }
    };

    const currentTexts = texts[language] || texts.en;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value.trim()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userInput || !formData.password) {
            toast.error(currentTexts.fillFields);
            return;
        }

        setIsLoading(true);

        try {
            console.log('Attempting login with:', { 
                user: formData.userInput,
                passwordLength: formData.password.length 
            });
            
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
            setFormData((prev) => ({
                ...prev,
                password: ''
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminClick = () => {
        navigate('/admin-login');
    };

    return (
        <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="login-container">
                <div className="logo4">
                    <img className="logo-img4" src="/logo.PNG" alt="Logo" />
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="userInput">{currentTexts.username}</label>
                    <input
                        type="text"
                        id="userInput"
                        name="userInput"
                        value={formData.userInput}
                        onChange={handleChange}
                        placeholder={currentTexts.username}
                        disabled={isLoading}
                        required
                    />

                    <label htmlFor="password">{currentTexts.password}</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={currentTexts.password}
                        disabled={isLoading}
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={isLoading ? 'loading' : ''}
                    >
                        {isLoading ? currentTexts.loggingIn : currentTexts.login}
                    </button>
                </form>

                <p className="signup-text">
                    {currentTexts.noAccount}{' '}
                    <a href="/sign-in">{currentTexts.signUp}</a>
                </p>
            </div>
            <div>
                <button
                    type="button"
                    className="admin-button"
                    onClick={handleAdminClick}
                    disabled={isLoading}
                >
                    {currentTexts.admin}
                </button>
            </div>
        </div>
    );
};

export default LoginForm;