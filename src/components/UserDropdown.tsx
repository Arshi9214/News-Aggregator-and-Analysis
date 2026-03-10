import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Trash2, ChevronDown } from 'lucide-react';
import { User as UserType, UserManager } from '../utils/userManager';
import { Language, ThemeMode } from '../App';
import DatabaseService from '../utils/database';

interface UserDropdownProps {
  currentUser: UserType;
  onLogout: () => void;
  themeMode?: ThemeMode;
  language: Language;
}

const TRANSLATIONS = {
  en: {
    logout: 'Logout',
    deleteAccount: 'Delete Account',
    confirmDelete: 'Are you sure you want to delete your account? This will permanently delete all your data.',
    cancel: 'Cancel',
    delete: 'Delete'
  },
  hi: {
    logout: 'लॉगआउट',
    deleteAccount: 'खाता हटाएं',
    confirmDelete: 'क्या आप वाकई अपना खाता हटाना चाहते हैं? इससे आपका सारा डेटा स्थायी रूप से हट जाएगा।',
    cancel: 'रद्द करें',
    delete: 'हटाएं'
  }
};

function UserDropdown({ currentUser, onLogout, themeMode, language }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = import.meta.env.VITE_API_URL || 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5000'
          : `http://${window.location.hostname}:5000`);
      
      const response = await fetch(`${API_URL}/api/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      
      // Clear local data and logout
      localStorage.removeItem('auth_token');
      localStorage.removeItem('currentUser');
      onLogout();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  if (showDeleteConfirm) {
    return (
      <div ref={dropdownRef} className={`absolute right-0 top-full mt-2 w-80 rounded-lg shadow-lg border z-50 p-4 ${
        themeMode === 'newspaper'
          ? 'bg-[#f9f3e8] border-[#8b7355]'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}>
        <p className={`text-sm mb-4 ${
          themeMode === 'newspaper' ? 'text-[#2c1810]' : 'text-gray-900 dark:text-white'
        }`}>
          {t.confirmDelete}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              themeMode === 'newspaper'
                ? 'bg-[#e8dcc8] hover:bg-[#d4c5a9] text-[#3d2817]'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t.cancel}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            {t.delete}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
          themeMode === 'newspaper'
            ? 'bg-[#f4e8d0] hover:bg-[#e8dcc8] text-[#2c1810]'
            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        }`}
      >
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">{currentUser.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-50 ${
          themeMode === 'newspaper'
            ? 'bg-[#f9f3e8] border-[#8b7355]'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}>
          <div className="py-1">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                themeMode === 'newspaper'
                  ? 'hover:bg-[#f4e8d0] text-[#2c1810]'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <LogOut className="h-4 w-4" />
              {t.logout}
            </button>
            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              {t.deleteAccount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;