import { useState, useEffect } from 'react';
import { User, UserPlus, LogIn, Users } from 'lucide-react';
import { UserManager, User as UserType } from '../utils/userManager';
import { Language } from '../App';

interface UserAuthProps {
  language: Language;
  onUserLogin: (user: UserType) => void;
  themeMode?: 'light' | 'dark' | 'newspaper';
}

export function UserAuth({ language, onUserLogin, themeMode }: UserAuthProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasExistingAccount, setHasExistingAccount] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    setMode('login');
  }, []);

  const t = {
    en: {
      title: 'Welcome to AI News Analyzer',
      subtitle: hasExistingAccount ? 'Sign in to your account' : 'Create your account',
      login: 'Login',
      signup: 'Create Account',
      selectUser: 'Select User',
      name: 'Full Name',
      email: 'Email (optional)',
      password: 'Password',
      nameOrEmail: 'Name or Email',
      createAccount: 'Create Account',
      loginAccount: 'Login',
      switchToLogin: 'Already have an account? Login',
      switchToSignup: 'Don\'t have an account? Sign up',
      enterName: 'Enter your name',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      enterNameOrEmail: 'Enter name or email'
    },
    hi: {
      title: 'AI न्यूज़ एनालाइज़र में आपका स्वागत है',
      subtitle: hasExistingAccount ? 'अपने खाते में साइन इन करें' : 'अपना खाता बनाएं',
      login: 'लॉगिन',
      signup: 'खाता बनाएं',
      selectUser: 'उपयोगकर्ता चुनें',
      name: 'पूरा नाम',
      email: 'ईमेल (वैकल्पिक)',
      password: 'पासवर्ड',
      nameOrEmail: 'नाम या ईमेल',
      createAccount: 'खाता बनाएं',
      loginAccount: 'लॉगिन',
      switchToLogin: 'पहले से खाता है? लॉगिन करें',
      switchToSignup: 'खाता नहीं है? साइन अप करें',
      enterName: 'अपना नाम दर्ज करें',
      enterEmail: 'अपना ईमेल दर्ज करें',
      enterPassword: 'अपना पासवर्ड दर्ज करें',
      enterNameOrEmail: 'नाम या ईमेल दर्ज करें'
    }
  };

  const translations = t[language as keyof typeof t] || t.en;

  const loadUsers = async () => {
    const allUsers = await UserManager.getAllUsers();
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const user = await UserManager.createUser(name.trim(), password.trim(), email.trim() || undefined);
      onUserLogin(user);
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!name.trim()) {
      setError('Name or email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const user = await UserManager.loginUser(name.trim(), password.trim());
      onUserLogin(user);
    } catch (error: any) {
      setError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-cyan-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 backdrop-blur-lg border relative z-10 ${
        themeMode === 'newspaper'
          ? 'bg-[#f9f3e8]/90 border-[#8b7355]'
          : 'bg-white/10 border-white/20'
      }`}>
        <div className="text-center mb-8">
          <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 relative ${
            themeMode === 'newspaper' ? 'bg-[#8b7355]' : 'bg-gradient-to-r from-blue-500 to-cyan-600'
          }`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 animate-spin opacity-75"></div>
            <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
              themeMode === 'newspaper' ? 'bg-[#8b7355]' : 'bg-blue-900'
            }`}>
              {mode === 'signup' ? (
                <UserPlus className="h-8 w-8 text-white" />
              ) : (
                <LogIn className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent ${
            themeMode === 'newspaper' ? 'text-[#2c1810] bg-gradient-to-r from-[#2c1810] to-[#5a4a3a]' : ''
          }`}>
            {translations.title}
          </h1>
          <p className={`text-sm leading-relaxed ${
            themeMode === 'newspaper' ? 'text-[#5a4a3a]' : 'text-gray-300'
          }`}>
            {translations.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {mode === 'signup' ? (
            <>
              <div className="group">
                <label className={`block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-400 ${
                  themeMode === 'newspaper' ? 'text-[#3d2817]' : 'text-gray-300'
                }`}>
                  {translations.name}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={translations.enterName}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    themeMode === 'newspaper'
                      ? 'border-[#8b7355] focus:ring-[#8b7355]/30 bg-[#f4e8d0]/80 text-[#2c1810] placeholder-[#5a4a3a]'
                      : 'border-white/20 focus:ring-blue-500/30 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20'
                  }`}
                  disabled={loading}
                />
              </div>
              <div className="group">
                <label className={`block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-400 ${
                  themeMode === 'newspaper' ? 'text-[#3d2817]' : 'text-gray-300'
                }`}>
                  {translations.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={translations.enterEmail}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    themeMode === 'newspaper'
                      ? 'border-[#8b7355] focus:ring-[#8b7355]/30 bg-[#f4e8d0]/80 text-[#2c1810] placeholder-[#5a4a3a]'
                      : 'border-white/20 focus:ring-blue-500/30 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20'
                  }`}
                  disabled={loading}
                />
              </div>
              <div className="group">
                <label className={`block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-400 ${
                  themeMode === 'newspaper' ? 'text-[#3d2817]' : 'text-gray-300'
                }`}>
                  {translations.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={translations.enterPassword}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    themeMode === 'newspaper'
                      ? 'border-[#8b7355] focus:ring-[#8b7355]/30 bg-[#f4e8d0]/80 text-[#2c1810] placeholder-[#5a4a3a]'
                      : 'border-white/20 focus:ring-blue-500/30 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20'
                  }`}
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <>
              <div className="group">
                <label className={`block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-400 ${
                  themeMode === 'newspaper' ? 'text-[#3d2817]' : 'text-gray-300'
                }`}>
                  {translations.nameOrEmail}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={translations.enterNameOrEmail}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    themeMode === 'newspaper'
                      ? 'border-[#8b7355] focus:ring-[#8b7355]/30 bg-[#f4e8d0]/80 text-[#2c1810] placeholder-[#5a4a3a]'
                      : 'border-white/20 focus:ring-blue-500/30 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20'
                  }`}
                  disabled={loading}
                />
              </div>
              <div className="group">
                <label className={`block text-sm font-medium mb-2 transition-colors group-focus-within:text-blue-400 ${
                  themeMode === 'newspaper' ? 'text-[#3d2817]' : 'text-gray-300'
                }`}>
                  {translations.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={translations.enterPassword}
                  className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:border-transparent transition-all duration-300 backdrop-blur-sm ${
                    themeMode === 'newspaper'
                      ? 'border-[#8b7355] focus:ring-[#8b7355]/30 bg-[#f4e8d0]/80 text-[#2c1810] placeholder-[#5a4a3a]'
                      : 'border-white/20 focus:ring-blue-500/30 bg-white/10 text-white placeholder-gray-400 focus:bg-white/20'
                  }`}
                  disabled={loading}
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center py-3 px-4 rounded-xl backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={mode === 'signup' ? handleSignup : handleLogin}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 relative overflow-hidden group ${
                themeMode === 'newspaper'
                  ? 'bg-[#8b7355] hover:bg-[#6b5744] text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-2xl shadow-blue-500/25'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Please wait...
                  </>
                ) : (
                  <>
                    {mode === 'signup' ? <UserPlus className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
                    {mode === 'signup' ? translations.createAccount : translations.loginAccount}
                  </>
                )}
              </span>
            </button>
            
            {mode === 'signup' && (
              <button
                onClick={() => setMode('login')}
                className={`w-full py-3 px-4 text-sm transition-all duration-300 hover:scale-105 ${
                  themeMode === 'newspaper'
                    ? 'text-[#5a4a3a] hover:text-[#3d2817]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {translations.switchToLogin}
              </button>
            )}
            
            {mode === 'login' && (
              <button
                onClick={() => setMode('signup')}
                className={`w-full py-3 px-4 text-sm transition-all duration-300 hover:scale-105 ${
                  themeMode === 'newspaper'
                    ? 'text-[#5a4a3a] hover:text-[#3d2817]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {translations.switchToSignup}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}