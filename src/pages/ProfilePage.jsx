import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ConfirmModal from '../components/ConfirmModal';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setShowLogoutConfirm(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {t('profile.title')}
        </h1>
        <p className="page-subtitle">
          {user?.email}
        </p>
      </div>

      <div className="page-content">
        {/* User Info Card */}
        <div className="dark-card fade-in" style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-3)' }}>👤</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
            {user?.email}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
            {user?.created_at ? t('profile.memberSince').replace('{date}', formatDate(user.created_at)) : ''}
          </div>
        </div>

        {/* Settings Section */}
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-lg)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
            ⚙️ {t('profile.settings.title')}
          </h2>

          <div className="dark-card" style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  🌐 {t('profile.settings.language')}
                </div>
              </div>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="dark-card" style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {theme === 'dark' ? '🌙' : '☀️'} {t('profile.settings.theme')}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                  {theme === 'dark' ? t('profile.settings.themeDark') : t('profile.settings.themeLight')}
                </div>
              </div>
              <button
                onClick={toggleTheme}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '24px',
                  padding: '8px 16px',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--accent-primary)';
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--bg-tertiary)';
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.color = 'var(--text-primary)';
                }}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            padding: 'var(--space-3)',
            background: 'transparent',
            border: '2px solid var(--danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--danger)',
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--font-bold)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--danger)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'var(--danger)';
          }}
        >
          🚪 {t('profile.logout')}
        </button>

        {/* Version Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-8)',
          padding: 'var(--space-4)',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-xs)'
        }}>
          <div className="divider" />
          {t('profile.version')} • Made with 💪
        </div>
      </div>

      {/* Confirm Logout Modal */}
      <ConfirmModal
        show={showLogoutConfirm}
        title={t('profile.logoutConfirm.title')}
        message={t('profile.logoutConfirm.message')}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        confirmText={t('profile.logoutConfirm.confirm')}
        cancelText={t('profile.logoutConfirm.cancel')}
        isDanger={false}
      />

      <BottomNav />
    </div>
  );
};

export default ProfilePage;
